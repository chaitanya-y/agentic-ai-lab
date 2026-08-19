"use client";

import { useMemo, useState } from "react";
import { glossary, glossaryCategories } from "../../lib/glossary";

export function GlossaryExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof glossaryCategories)[number]>("All");

  const terms = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return glossary
      .filter((item) => category === "All" || item.category === category)
      .filter(
        (item) =>
          !normalized ||
          item.term.toLowerCase().includes(normalized) ||
          item.definition.toLowerCase().includes(normalized) ||
          item.example.toLowerCase().includes(normalized)
      )
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [category, query]);

  return (
    <section className="glossary-shell">
      <div className="glossary-controls">
        <label className="search-field">
          <span>Find a term</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search definitions and examples"
            type="search"
            value={query}
          />
        </label>
        <div className="filter-buttons" aria-label="Glossary categories">
          {glossaryCategories.map((item) => (
            <button
              className={category === item ? "active" : ""}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="glossary-list">
        {terms.map((item) => (
          <article key={item.term}>
            <div>
              <span>{item.category}</span>
              <h2>{item.term}</h2>
            </div>
            <div>
              <p>{item.definition}</p>
              <p className="term-example">
                <strong>Example:</strong> {item.example}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
