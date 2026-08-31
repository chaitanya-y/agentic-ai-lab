"use client";

import { useEffect, useState } from "react";

type SavedNote = {
  id: string;
  anchorId: string;
  endOffset?: number;
  note: string;
  startOffset?: number;
  selectedText: string;
};

type PendingSelection = {
  anchorId: string;
  endOffset: number;
  left: number;
  selectedText: string;
  startOffset: number;
  top: number;
};

type LessonNotesProps = {
  lessonSlug: string;
};

function noteStorageKey(lessonSlug: string) {
  return `agentic-ai-lab:lesson-notes:${lessonSlug}`;
}

function getSelectionElement(node: Node | null) {
  if (!node) {
    return null;
  }

  return node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
}

function getTextOffset(container: HTMLElement, node: Node, offset: number) {
  const range = document.createRange();
  range.selectNodeContents(container);
  range.setEnd(node, offset);
  return range.toString().length;
}

function getRangeForOffsets(container: HTMLElement, startOffset: number, endOffset: number) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let endNode: Text | null = null;
  let endNodeOffset = 0;
  let startNode: Text | null = null;
  let startNodeOffset = 0;
  let totalLength = 0;
  let textNode = walker.nextNode() as Text | null;

  while (textNode) {
    const nextLength = totalLength + textNode.data.length;

    if (!startNode && startOffset >= totalLength && startOffset <= nextLength) {
      startNode = textNode;
      startNodeOffset = startOffset - totalLength;
    }

    if (endOffset >= totalLength && endOffset <= nextLength) {
      endNode = textNode;
      endNodeOffset = endOffset - totalLength;
      break;
    }

    totalLength = nextLength;
    textNode = walker.nextNode() as Text | null;
  }

  if (!startNode || !endNode || startOffset >= endOffset) {
    return null;
  }

  const range = document.createRange();
  range.setStart(startNode, startNodeOffset);
  range.setEnd(endNode, endNodeOffset);
  return range;
}

function clearFallbackHighlights() {
  document.querySelectorAll<HTMLElement>("[data-saved-note-highlight]").forEach((highlight) => {
    const parent = highlight.parentNode;

    if (!parent) {
      return;
    }

    while (highlight.firstChild) {
      parent.insertBefore(highlight.firstChild, highlight);
    }

    parent.removeChild(highlight);
    parent.normalize();
  });
}

function addFallbackHighlight(container: HTMLElement, note: SavedNote) {
  if (note.startOffset === undefined || note.endOffset === undefined || note.startOffset >= note.endOffset) {
    return;
  }

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let textNode = walker.nextNode() as Text | null;

  while (textNode) {
    textNodes.push(textNode);
    textNode = walker.nextNode() as Text | null;
  }

  let totalLength = 0;

  textNodes.forEach((node) => {
    const nextLength = totalLength + node.data.length;
    const start = Math.max(note.startOffset ?? 0, totalLength);
    const end = Math.min(note.endOffset ?? 0, nextLength);

    if (start < end && node.parentNode) {
      const from = start - totalLength;
      const to = end - totalLength;
      const fragment = document.createDocumentFragment();

      if (from > 0) {
        fragment.appendChild(document.createTextNode(node.data.slice(0, from)));
      }

      const highlight = document.createElement("mark");
      highlight.className = "saved-note-highlight";
      highlight.dataset.savedNoteHighlight = note.id;
      highlight.textContent = node.data.slice(from, to);
      fragment.appendChild(highlight);

      if (to < node.data.length) {
        fragment.appendChild(document.createTextNode(node.data.slice(to)));
      }

      node.parentNode.replaceChild(fragment, node);
    }

    totalLength = nextLength;
  });
}

export function LessonNotes({ lessonSlug }: LessonNotesProps) {
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [pendingSelection, setPendingSelection] = useState<PendingSelection | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const storageKey = noteStorageKey(lessonSlug);

  useEffect(() => {
    const style = document.createElement("style");
    style.dataset.lessonNotesHighlight = "true";
    style.textContent = "::highlight(agentic-ai-lab-notes) { background: rgba(249, 211, 93, 0.52); color: inherit; }";
    document.head.appendChild(style);

    return () => style.remove();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("lesson-notes-open", isNotesOpen);

    return () => document.body.classList.remove("lesson-notes-open");
  }, [isNotesOpen]);

  useEffect(() => {
    const savedNotes = window.localStorage.getItem(storageKey);

    if (!savedNotes) {
      return;
    }

    try {
      const parsedNotes = JSON.parse(savedNotes);

      if (Array.isArray(parsedNotes)) {
        setNotes(parsedNotes);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    const HighlightConstructor = (window as typeof window & {
      Highlight?: new (...ranges: Range[]) => unknown;
    }).Highlight;
    const highlights = (CSS as typeof CSS & {
      highlights?: { delete(name: string): void; set(name: string, highlight: unknown): void };
    }).highlights;

    if (!HighlightConstructor || !highlights) {
      clearFallbackHighlights();

      notes.forEach((note) => {
        const anchor = document.querySelector<HTMLElement>(`[data-note-anchor="${note.anchorId}"]`);

        if (anchor) {
          addFallbackHighlight(anchor, note);
        }
      });

      return () => clearFallbackHighlights();
    }

    clearFallbackHighlights();
    const ranges = notes.flatMap((note) => {
      if (note.startOffset === undefined || note.endOffset === undefined) {
        return [];
      }

      const anchor = document.querySelector<HTMLElement>(`[data-note-anchor="${note.anchorId}"]`);
      const range = anchor ? getRangeForOffsets(anchor, note.startOffset, note.endOffset) : null;
      return range ? [range] : [];
    });

    highlights.set("agentic-ai-lab-notes", new HighlightConstructor(...ranges));
    return () => {
      highlights.delete("agentic-ai-lab-notes");
    };
  }, [notes]);

  useEffect(() => {
    const handleSelection = () => {
      if (isComposerOpen || isNotesOpen) {
        return;
      }

      const selection = window.getSelection();
      const selectedText = selection?.toString().replace(/\s+/g, " ").trim();
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
      const lessonContent = document.querySelector<HTMLElement>(`[data-lesson-slug="${lessonSlug}"]`);
      const selectionStart = getSelectionElement(range?.startContainer ?? null);
      const selectionEnd = getSelectionElement(range?.endContainer ?? null);

      if (!selectedText || !range || !lessonContent || !selectionStart || !selectionEnd || !lessonContent.contains(selectionStart) || !lessonContent.contains(selectionEnd)) {
        setPendingSelection(null);
        return;
      }

      const anchor = selectionStart.closest<HTMLElement>("[data-note-anchor]");
      const endAnchor = selectionEnd.closest<HTMLElement>("[data-note-anchor]");
      const selectionRect = range.getBoundingClientRect();

      if (!anchor || anchor !== endAnchor || !selectionRect.width) {
        setPendingSelection(null);
        return;
      }

      setPendingSelection({
        anchorId: anchor.dataset.noteAnchor ?? "",
        endOffset: getTextOffset(anchor, range.endContainer, range.endOffset),
        left: Math.min(Math.max(selectionRect.left, 12), window.innerWidth - 152),
        selectedText,
        startOffset: getTextOffset(anchor, range.startContainer, range.startOffset),
        top: Math.max(selectionRect.top - 48, 12)
      });
    };

    document.addEventListener("selectionchange", handleSelection);
    return () => document.removeEventListener("selectionchange", handleSelection);
  }, [isComposerOpen, isNotesOpen, lessonSlug]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setIsComposerOpen(false);
      setIsNotesOpen(false);
      setPendingSelection(null);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const persistNotes = (nextNotes: SavedNote[]) => {
    setNotes(nextNotes);
    window.localStorage.setItem(storageKey, JSON.stringify(nextNotes));
  };

  const saveNote = () => {
    if (!pendingSelection) {
      return;
    }

    const savedNote: SavedNote = {
      anchorId: pendingSelection.anchorId,
      endOffset: pendingSelection.endOffset,
      id: window.crypto.randomUUID(),
      note: noteText.trim(),
      startOffset: pendingSelection.startOffset,
      selectedText: pendingSelection.selectedText
    };

    persistNotes([savedNote, ...notes]);
    window.getSelection()?.removeAllRanges();
    setNoteText("");
    setPendingSelection(null);
    setIsComposerOpen(false);
  };

  const deleteNote = (noteId: string) => {
    persistNotes(notes.filter((note) => note.id !== noteId));
  };

  const clearNotes = () => {
    if (!window.confirm("Clear all notes saved for this lesson? This cannot be undone.")) {
      return;
    }

    persistNotes([]);
  };

  const jumpToNote = (note: SavedNote) => {
    const target = document.querySelector<HTMLElement>(`[data-note-anchor="${note.anchorId}"]`);

    setIsNotesOpen(false);

    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("note-anchor-target");
    window.setTimeout(() => target.classList.remove("note-anchor-target"), 1800);
  };

  return (
    <div className="lesson-notes">
      <button
        aria-expanded={isNotesOpen}
        aria-haspopup="dialog"
        className="lesson-notes-trigger"
        onClick={() => setIsNotesOpen(true)}
        type="button"
      >
        <span aria-hidden="true" className="lesson-notes-icon">✎</span>
        <span className="lesson-notes-label">Notes</span>
        {notes.length > 0 ? <span className="lesson-notes-count">{notes.length}</span> : null}
      </button>

      {pendingSelection && !isComposerOpen ? (
        <button
          className="selection-note-button"
          onClick={() => setIsComposerOpen(true)}
          onMouseDown={(event) => event.preventDefault()}
          style={{ left: pendingSelection.left, top: pendingSelection.top }}
          type="button"
        >
          Add note
        </button>
      ) : null}

      {isComposerOpen && pendingSelection ? (
        <div className="note-composer" role="dialog" aria-label="Add note">
          <p>{pendingSelection.selectedText}</p>
          <label htmlFor="lesson-note">Your note</label>
          <textarea
            id="lesson-note"
            onChange={(event) => setNoteText(event.target.value)}
            placeholder="Add an optional thought or reminder"
            value={noteText}
          />
          <div>
            <button
              className="note-secondary-action"
              onClick={() => {
                setIsComposerOpen(false);
                setPendingSelection(null);
                window.getSelection()?.removeAllRanges();
              }}
              type="button"
            >
              Cancel
            </button>
            <button className="note-primary-action" onClick={saveNote} type="button">
              Save note
            </button>
          </div>
        </div>
      ) : null}

      {isNotesOpen ? (
        <div className="lesson-notes-overlay" role="dialog" aria-label="Notes for this lesson" aria-modal="true">
          <div className="lesson-notes-panel">
            <div className="lesson-notes-panel-header">
              <div>
                <p>Your notes</p>
                <h2>This lesson</h2>
              </div>
              <button aria-label="Close notes" onClick={() => setIsNotesOpen(false)} type="button">
                ×
              </button>
            </div>

            {notes.length ? (
              <div className="saved-notes-list">
                {notes.map((note) => (
                  <article className="saved-note" key={note.id}>
                    <button className="saved-note-jump" onClick={() => jumpToNote(note)} type="button">
                      <span>{note.selectedText}</span>
                      {note.note ? <strong>{note.note}</strong> : null}
                    </button>
                    <button aria-label="Delete note" className="saved-note-delete" onClick={() => deleteNote(note.id)} type="button">
                      Delete
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <p className="notes-empty-state">Highlight a passage and select Add note to save it here.</p>
            )}

            {notes.length ? (
              <button className="clear-notes-button" onClick={clearNotes} type="button">
                Clear notes for this lesson
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
