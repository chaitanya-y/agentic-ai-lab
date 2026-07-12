"""LangChain voice-agent sandwich pipeline.

Docs source:
https://docs.langchain.com/oss/python/langchain/voice-agent

The LangChain tutorial builds a voice agent with the "sandwich" architecture:

Audio bytes -> speech-to-text events -> LangChain agent tokens -> TTS audio bytes

This file keeps that docs structure:

1. `stt_stream`
   Receives audio bytes and yields `stt_chunk` / `stt_output` events.

2. `agent_stream`
   Passes through upstream events, sends final transcripts to a LangChain agent,
   and yields `agent_chunk` events while the model responds.

3. `tts_stream`
   Passes through upstream events, sends agent text chunks to TTS, and yields
   `tts_chunk` events.

4. `build_pipeline`
   Composes the three stages with `RunnableGenerator`, matching the docs.

Provider note:
- The docs use AssemblyAI for STT and Cartesia for TTS over WebSockets.
- This portfolio file includes provider-shaped adapter classes and a default
  local mock mode so the architecture can be inspected without API keys,
  microphone/browser setup, or paid STT/TTS calls.
- Set `VOICE_AGENT_MODE=provider` only when you have provider keys and the
  optional WebSocket provider dependencies installed.
"""

from __future__ import annotations

import asyncio
import base64
import contextlib
import json
import os
import pathlib
import sys
import time
from collections.abc import AsyncIterator
from dataclasses import dataclass

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.messages import HumanMessage
from langchain.tools import tool
from langchain_core.runnables import RunnableGenerator
from langchain_core.utils.uuid import uuid7
from langgraph.checkpoint.memory import InMemorySaver

PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC_ROOT = PROJECT_ROOT / "src"
sys.path.insert(0, str(SRC_ROOT))

from agents.model_config import build_chat_model
from utils.demo_io import enabled, log_block, log_line
from utils.token_usage import TokenUsage, print_openai_usage_report

load_dotenv(PROJECT_ROOT / ".env")


@dataclass
class VoiceAgentEvent:
    """Base event shape used by every stage in the streaming pipeline."""

    type: str


@dataclass
class STTChunkEvent(VoiceAgentEvent):
    """Partial transcript from speech-to-text."""

    transcript: str

    @classmethod
    def create(cls, transcript: str) -> "STTChunkEvent":
        return cls(type="stt_chunk", transcript=transcript)


@dataclass
class STTOutputEvent(VoiceAgentEvent):
    """Final transcript that should trigger the LangChain agent."""

    transcript: str

    @classmethod
    def create(cls, transcript: str) -> "STTOutputEvent":
        return cls(type="stt_output", transcript=transcript)


@dataclass
class AgentChunkEvent(VoiceAgentEvent):
    """One streamed text chunk from the LangChain agent."""

    text: str

    @classmethod
    def create(cls, text: str) -> "AgentChunkEvent":
        return cls(type="agent_chunk", text=text)


@dataclass
class TTSChunkEvent(VoiceAgentEvent):
    """One synthesized audio chunk from text-to-speech."""

    audio: bytes

    @classmethod
    def create(cls, audio: bytes) -> "TTSChunkEvent":
        return cls(type="tts_chunk", audio=audio)


async def merge_async_iters(*iters: AsyncIterator[VoiceAgentEvent]) -> AsyncIterator[VoiceAgentEvent]:
    """Merge async iterators so TTS audio can arrive while upstream events continue.

    This mirrors the docs conceptually. Each iterator runs concurrently and
    pushes events into one queue.
    """
    queue: asyncio.Queue[VoiceAgentEvent | None] = asyncio.Queue()

    async def pump(iterator: AsyncIterator[VoiceAgentEvent]) -> None:
        try:
            async for event in iterator:
                await queue.put(event)
        finally:
            await queue.put(None)

    tasks = [asyncio.create_task(pump(iterator)) for iterator in iters]
    finished = 0
    try:
        while finished < len(tasks):
            event = await queue.get()
            if event is None:
                finished += 1
                continue
            yield event
    finally:
        for task in tasks:
            task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)


class MockSTT:
    """Local STT adapter with the same send/receive shape as provider STT."""

    def __init__(self) -> None:
        self._words: list[str] = []
        self._closed = False
        self._queue: asyncio.Queue[VoiceAgentEvent | None] = asyncio.Queue()

    async def send_audio(self, audio_chunk: bytes) -> None:
        word = audio_chunk.decode("utf-8")
        self._words.append(word)
        partial = " ".join(self._words)
        await self._queue.put(STTChunkEvent.create(partial))

    async def receive_events(self) -> AsyncIterator[VoiceAgentEvent]:
        while True:
            event = await self._queue.get()
            if event is None:
                return
            yield event

    async def close(self) -> None:
        if self._closed:
            return
        self._closed = True
        await self._queue.put(STTOutputEvent.create(" ".join(self._words)))
        await self._queue.put(None)


class AssemblyAISTT:
    """AssemblyAI WebSocket adapter shaped like the LangChain docs example."""

    def __init__(self, api_key: str | None = None, sample_rate: int = 16000):
        self.api_key = api_key or os.getenv("ASSEMBLYAI_API_KEY")
        self.sample_rate = sample_rate
        self._ws = None

    async def send_audio(self, audio_chunk: bytes) -> None:
        """Send PCM audio bytes to AssemblyAI."""
        ws = await self._ensure_connection()
        await ws.send(audio_chunk)

    async def receive_events(self) -> AsyncIterator[VoiceAgentEvent]:
        """Yield STT events as they arrive from AssemblyAI."""
        ws = await self._ensure_connection()
        async for raw_message in ws:
            message = json.loads(raw_message)
            if message["type"] == "Turn":
                if message.get("turn_is_formatted"):
                    yield STTOutputEvent.create(message["transcript"])
                else:
                    yield STTChunkEvent.create(message["transcript"])

    async def close(self) -> None:
        if self._ws is not None:
            await self._ws.close()
            self._ws = None

    async def _ensure_connection(self):
        """Establish WebSocket connection if not already connected."""
        if not self.api_key:
            raise RuntimeError("ASSEMBLYAI_API_KEY is required for VOICE_AGENT_MODE=provider.")
        if self._ws is None:
            try:
                import websockets
            except ImportError as exc:
                raise RuntimeError("Install websockets to use AssemblyAI STT.") from exc
            url = (
                "wss://streaming.assemblyai.com/v3/ws"
                f"?sample_rate={self.sample_rate}&format_turns=true"
            )
            self._ws = await websockets.connect(
                url,
                additional_headers={"Authorization": self.api_key},
            )
        return self._ws


class MockTTS:
    """Local TTS adapter with the same send/receive shape as provider TTS."""

    def __init__(self) -> None:
        self._closed = False
        self._queue: asyncio.Queue[VoiceAgentEvent | None] = asyncio.Queue()

    async def send_text(self, text: str | None) -> None:
        if not text or not text.strip():
            return
        await self._queue.put(TTSChunkEvent.create(text.encode("utf-8")))

    async def receive_events(self) -> AsyncIterator[VoiceAgentEvent]:
        while True:
            event = await self._queue.get()
            if event is None:
                return
            yield event

    async def close(self) -> None:
        if self._closed:
            return
        self._closed = True
        await self._queue.put(None)


class CartesiaTTS:
    """Cartesia WebSocket adapter shaped like the LangChain docs example."""

    def __init__(
        self,
        api_key: str | None = None,
        voice_id: str = "f6ff7c0c-e396-40a9-a70b-f7607edb6937",
        model_id: str = "sonic-3",
        sample_rate: int = 24000,
        encoding: str = "pcm_s16le",
    ):
        self.api_key = api_key or os.getenv("CARTESIA_API_KEY")
        self.voice_id = voice_id
        self.model_id = model_id
        self.sample_rate = sample_rate
        self.encoding = encoding
        self.language = os.getenv("CARTESIA_LANGUAGE", "en")
        self.cartesia_version = os.getenv("CARTESIA_VERSION", "2025-04-16")
        self._context_counter = 0
        self._ws = None

    def _generate_context_id(self) -> str:
        """Generate a valid context_id for Cartesia."""
        timestamp = int(time.time() * 1000)
        counter = self._context_counter
        self._context_counter += 1
        return f"ctx_{timestamp}_{counter}"

    async def send_text(self, text: str | None) -> None:
        """Send text to Cartesia for synthesis."""
        if not text or not text.strip():
            return

        ws = await self._ensure_connection()
        payload = {
            "model_id": self.model_id,
            "transcript": text,
            "voice": {
                "mode": "id",
                "id": self.voice_id,
            },
            "output_format": {
                "container": "raw",
                "encoding": self.encoding,
                "sample_rate": self.sample_rate,
            },
            "language": self.language,
            "context_id": self._generate_context_id(),
        }
        await ws.send(json.dumps(payload))

    async def receive_events(self) -> AsyncIterator[VoiceAgentEvent]:
        """Yield audio chunks as they arrive from Cartesia."""
        ws = await self._ensure_connection()
        async for raw_message in ws:
            message = json.loads(raw_message)
            if "data" in message and message["data"]:
                audio_chunk = base64.b64decode(message["data"])
                if audio_chunk:
                    yield TTSChunkEvent.create(audio_chunk)

    async def close(self) -> None:
        if self._ws is not None:
            await self._ws.close()
            self._ws = None

    async def _ensure_connection(self):
        """Establish WebSocket connection if not already connected."""
        if not self.api_key:
            raise RuntimeError("CARTESIA_API_KEY is required for VOICE_AGENT_MODE=provider.")
        if self._ws is None:
            try:
                import websockets
            except ImportError as exc:
                raise RuntimeError("Install websockets to use Cartesia TTS.") from exc
            url = (
                "wss://api.cartesia.ai/tts/websocket"
                f"?api_key={self.api_key}&cartesia_version={self.cartesia_version}"
            )
            self._ws = await websockets.connect(url)
        return self._ws


def provider_mode() -> bool:
    """Use real STT/TTS providers only when explicitly requested."""
    return os.getenv("VOICE_AGENT_MODE", "mock").lower() == "provider"


def build_stt():
    """Create the STT adapter used by `stt_stream`."""
    return AssemblyAISTT(sample_rate=16000) if provider_mode() else MockSTT()


def build_tts():
    """Create the TTS adapter used by `tts_stream`."""
    return CartesiaTTS() if provider_mode() else MockTTS()


async def stt_stream(audio_stream: AsyncIterator[bytes]) -> AsyncIterator[VoiceAgentEvent]:
    """Transform stream: Audio bytes -> STT voice events.

    This follows the docs producer-consumer pattern:
    one task sends audio to STT while another receives transcript events.
    """
    stt = build_stt()

    async def send_audio() -> None:
        try:
            async for audio_chunk in audio_stream:
                await stt.send_audio(audio_chunk)
        finally:
            await stt.close()

    send_task = asyncio.create_task(send_audio())

    try:
        async for event in stt.receive_events():
            if event.type == "stt_chunk":
                log_line(f"STT partial transcript: {event.transcript}")
            if event.type == "stt_output":
                log_block("STT final transcript", event.transcript)
            yield event
    finally:
        with contextlib.suppress(asyncio.CancelledError):
            send_task.cancel()
            await send_task
        await stt.close()


@tool
def add_to_order(item: str, quantity: int) -> str:
    """Add an item to the customer's sandwich order."""
    return f"Added {quantity} x {item} to the order."


@tool
def confirm_order(order_summary: str) -> str:
    """Confirm the final order with the customer."""
    return f"Order confirmed: {order_summary}. Sending to kitchen."


VOICE_AGENT_PROMPT = """You are a helpful sandwich shop assistant.
Your goal is to take the user's order. Be concise and friendly.
Do NOT use emojis, special characters, or markdown.
Your responses will be read by a text-to-speech engine."""


def build_voice_agent():
    """Create the LangChain agent used in the voice pipeline."""
    model = build_chat_model(
        temperature=0,
        max_tokens=int(os.getenv("VOICE_AGENT_MAX_TOKENS", "1024")),
    )
    return create_agent(
        model,
        tools=[add_to_order, confirm_order],
        system_prompt=VOICE_AGENT_PROMPT,
        checkpointer=InMemorySaver(),
    )


agent = build_voice_agent()


async def _stream_agent_chunks(transcript: str, thread_id: str) -> AsyncIterator[str]:
    """Stream text chunks from the LangChain agent.

    The docs use `agent.astream_events(..., version="v3")` and iterate
    `stream.messages`. Some installed versions expose token chunks differently,
    so this function keeps the docs path first and falls back to `ainvoke`.
    """
    yielded_stream_chunk = False
    try:
        stream = await agent.astream_events(
            {"messages": [HumanMessage(content=transcript)]},
            {"configurable": {"thread_id": thread_id}},
            version="v3",
        )
        async for message in stream.messages:
            async for token in message.text:
                yielded_stream_chunk = True
                yield token
        if yielded_stream_chunk:
            return
    except (AttributeError, TypeError):
        pass

    # Keep the docs streaming path above, but make local demos robust when a
    # provider/runtime does not expose text chunks through `stream.messages`.
    result = await agent.ainvoke(
        {"messages": [HumanMessage(content=transcript)]},
        {"configurable": {"thread_id": thread_id}},
    )
    message = result["messages"][-1]
    content = getattr(message, "content", "")
    if isinstance(content, str) and content:
        yield content


async def agent_stream(event_stream: AsyncIterator[VoiceAgentEvent]) -> AsyncIterator[VoiceAgentEvent]:
    """Transform stream: Voice events -> voice events with agent text chunks."""
    thread_id = str(uuid7())

    async for event in event_stream:
        yield event

        if event.type == "stt_output":
            async for token in _stream_agent_chunks(event.transcript, thread_id):
                log_line(f"Agent chunk: {token}")
                yield AgentChunkEvent.create(token)


async def tts_stream(event_stream: AsyncIterator[VoiceAgentEvent]) -> AsyncIterator[VoiceAgentEvent]:
    """Transform stream: Voice events -> voice events with synthesized audio."""
    tts = build_tts()

    async def process_upstream() -> AsyncIterator[VoiceAgentEvent]:
        try:
            async for event in event_stream:
                yield event
                if event.type == "agent_chunk":
                    await tts.send_text(event.text)
        finally:
            await tts.close()

    try:
        async for event in merge_async_iters(process_upstream(), tts.receive_events()):
            if event.type == "tts_chunk":
                log_line(f"TTS audio chunk bytes: {len(event.audio)}")
            yield event
    finally:
        await tts.close()


def build_pipeline():
    """Compose STT, agent, and TTS stages exactly like the docs pattern."""
    return (
        RunnableGenerator(stt_stream)
        | RunnableGenerator(agent_stream)
        | RunnableGenerator(tts_stream)
    )


async def mock_browser_audio_stream() -> AsyncIterator[bytes]:
    """Local stand-in for browser microphone PCM bytes.

    The docs WebSocket endpoint would yield `await websocket.receive_bytes()`.
    This local stream yields word-sized byte chunks so the same pipeline can run
    without microphone permissions or provider API keys.
    """
    spoken_text = "I want two turkey sandwiches and one lemonade"
    log_block("Mock browser audio input", spoken_text)
    for index, word in enumerate(spoken_text.encode("utf-8").split(), start=1):
        await asyncio.sleep(0.02)
        log_line(f"Browser audio chunk {index}: {word!r}")
        yield word


async def websocket_endpoint(websocket) -> None:
    """Docs-style WebSocket endpoint body.

    In a FastAPI app this would be decorated with:

    `@app.websocket("/ws")`

    The endpoint receives browser audio bytes, runs the voice pipeline, and sends
    `tts_chunk` audio bytes back to the browser.
    """
    await websocket.accept()

    async def websocket_audio_stream() -> AsyncIterator[bytes]:
        while True:
            data = await websocket.receive_bytes()
            yield data

    output_stream = build_pipeline().atransform(websocket_audio_stream())

    async for event in output_stream:
        if event.type == "tts_chunk":
            await websocket.send_bytes(event.audio)


async def run_voice_agent() -> None:
    """Run the docs-aligned pipeline locally with mock browser audio."""
    log_line(f"Voice agent mode: {os.getenv('VOICE_AGENT_MODE', 'mock')}")
    output_stream = build_pipeline().atransform(mock_browser_audio_stream())

    agent_text: list[str] = []
    tts_bytes = 0
    async for event in output_stream:
        if event.type == "agent_chunk":
            agent_text.append(event.text)
        if event.type == "tts_chunk":
            tts_bytes += len(event.audio)

    log_block("Final agent text sent to TTS", "".join(agent_text))
    log_line(f"Total TTS bytes emitted: {tts_bytes}")

    if enabled("SHOW_TOKEN_USAGE", default=True):
        print_openai_usage_report(TokenUsage())
        log_line("Streaming token metadata is provider-dependent; inspect LangSmith for full voice traces.")


if __name__ == "__main__":
    asyncio.run(run_voice_agent())
