"""Semantic search over a PDF using a beginner-friendly RAG building block.

Based on the LangChain Learn tutorial:
https://docs.langchain.com/oss/python/langchain/knowledge-base

This demonstrates:
- Documents
- PDF loading with pypdf
- Chunking with RecursiveCharacterTextSplitter
- Embeddings
- InMemoryVectorStore
- Similarity search
- Retrievers
"""

import os
from pathlib import Path
from typing import List

import pypdf
from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain_core.runnables import chain
from langchain_core.vectorstores import InMemoryVectorStore
# from langchain_openai import OpenAIEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

PROJECT_ROOT = Path(__file__).resolve().parents[2]
PDF_PATH = PROJECT_ROOT / "data" / "nke-10k-2023.pdf"

load_dotenv(PROJECT_ROOT / ".env")


def load_pdf_pages(file_path: Path) -> list[Document]:
    """Load PDF pages as LangChain Document objects."""
    reader = pypdf.PdfReader(str(file_path))
    return [
        Document(
            page_content=page.extract_text() or "",
            metadata={"source": str(file_path), "page": i},
        )
        for i, page in enumerate(reader.pages)
    ]


def preview_document(doc: Document, max_chars: int = 500) -> str:
    content = " ".join(doc.page_content.split())
    return f"metadata={doc.metadata}\ncontent={content[:max_chars]}..."


def limit_chunks_for_local_demo(splits: list[Document]) -> list[Document]:
    """Limit local embedding work unless MAX_CHUNKS=0 is provided."""
    max_chunks = int(os.getenv("MAX_CHUNKS", "20"))
    if max_chunks <= 0:
        print("Using all chunks. This can be slow with local embedding models.")
        return splits

    limited_splits = splits[:max_chunks]
    print(f"Using chunks for local demo: {len(limited_splits)}")
    return limited_splits


def main() -> None:
    if not PDF_PATH.exists():
        raise FileNotFoundError(
            f"Missing PDF at {PDF_PATH}. Download the sample Nike 10-K PDF first."
        )

    docs = load_pdf_pages(PDF_PATH)
    print(f"Loaded PDF pages: {len(docs)}")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        add_start_index=True,
    )
    all_splits = text_splitter.split_documents(docs)
    print(f"Created chunks: {len(all_splits)}")
    all_splits = limit_chunks_for_local_demo(all_splits)

    # Hosted API option:
    # embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

    # Local model option: downloads once, then runs inside this Python process.
    embeddings = HuggingFaceEmbeddings(
        model_name="Qwen/Qwen3-Embedding-0.6B",
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )
    vector_store = InMemoryVectorStore(embeddings)
    vector_store.add_documents(documents=all_splits)
    print("Indexed chunks in InMemoryVectorStore")

    query = (
        "What company is this report about? "
        "What products does Nike sell? "
        "What brands does Nike own?"
    )
    print(f"\nSimilarity search query: {query}")
    results = vector_store.similarity_search(query, k=1)
    print(preview_document(results[0]))

    print("\nThe next queries may fail with the default 20-chunk local demo.")
    print("Set MAX_CHUNKS=0 to index the full PDF.")

    query = "How many distribution centers does Nike have in the US?"
    print(f"\nSimilarity search query: {query}")
    results = vector_store.similarity_search(query, k=1)
    print(preview_document(results[0]))

    scored_query = "What was Nike's revenue in 2023?"
    print(f"\nSimilarity search with score query: {scored_query}")
    scored_results = vector_store.similarity_search_with_score(scored_query, k=1)
    doc, score = scored_results[0]
    print(f"Score: {score}")
    print(preview_document(doc))

    @chain
    def retriever(query: str) -> List[Document]:
        return vector_store.similarity_search(query, k=1)

    batch_queries = [
        "How many distribution centers does Nike have in the US?",
        "When was Nike incorporated?",
    ]
    print("\nRetriever batch queries:")
    for question, docs_for_question in zip(batch_queries, retriever.batch(batch_queries)):
        print(f"\nQuestion: {question}")
        print(preview_document(docs_for_question[0], max_chars=300))


if __name__ == "__main__":
    main()
