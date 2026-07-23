"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { allLessons, curriculum } from "../../lib/curriculum";

export function LessonCatalog() {
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState("all");
  const [format, setFormat] = useState("all");

  const visibleLessons = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return allLessons.filter((item) => {
      const matchesQuery =
        !normalized ||
        [item.title, item.summary, item.explanation, item.phaseTitle, ...item.concepts]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      const matchesPhase = phase === "all" || item.phaseId === phase;
      const matchesFormat = format === "all" || item.format === format;
      return matchesQuery && matchesPhase && matchesFormat;
    });
  }, [format, phase, query]);

  return (
    <section className="catalog-shell">
      <div className="catalog-controls">
        <label className="search-field">
          <span>Search the curriculum</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “memory”, “MCP”, or “evaluation”"
            type="search"
            value={query}
          />
        </label>
        <label>
          <span>Phase</span>
          <select onChange={(event) => setPhase(event.target.value)} value={phase}>
            <option value="all">All phases</option>
            {curriculum.map((item) => (
              <option key={item.id} value={item.id}>
                {item.number} · {item.shortTitle}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Lesson type</span>
          <select onChange={(event) => setFormat(event.target.value)} value={format}>
            <option value="all">All types</option>
            <option value="Concept">Concept</option>
            <option value="Build">Build</option>
            <option value="Concept + Build">Concept + Build</option>
            <option value="Capstone">Capstone</option>
          </select>
        </label>
      </div>

      <div className="catalog-result-line">
        <strong>{visibleLessons.length}</strong> lessons found
      </div>

      {visibleLessons.length ? (
        <div className="catalog-grid">
          {visibleLessons.map((item) => (
            <article className="catalog-card" key={item.slug}>
              <div className="catalog-card-top">
                <span>
                  Phase {item.phaseNumber} · {item.format}
                </span>
                <span>{item.time}</span>
              </div>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              <div className="tag-list">
                {item.concepts.slice(0, 4).map((concept) => (
                  <span key={concept}>{concept}</span>
                ))}
              </div>
              <Link href={`/learn/${item.slug}`}>Read lesson →</Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <strong>No lessons match those filters.</strong>
          <p>Try a broader search or choose all phases.</p>
        </div>
      )}
    </section>
  );
}
