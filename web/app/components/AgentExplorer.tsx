"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { agents, categories, type AgentCategory } from "../../lib/agents";

export function AgentExplorer() {
  const [activeCategory, setActiveCategory] = useState<"All" | AgentCategory>("All");
  const visibleAgents = useMemo(() => {
    if (activeCategory === "All") {
      return agents;
    }
    return agents.filter((agent) => agent.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="explorer" id="agents">
      <div className="section-heading">
        <span className="eyebrow">Runnable repository labs</span>
        <h2>Runnable implementations of the curriculum&apos;s core concepts.</h2>
        <p>
          Each implementation page complements the curriculum with source code, architecture notes, and execution
          instructions. Most labs require 60–90 minutes to review, configure, and run.
        </p>
      </div>

      <div className="tabs" role="tablist" aria-label="Agent categories">
        {categories.map((category) => (
          <button
            className={category === activeCategory ? "tab active" : "tab"}
            key={category}
            onClick={() => setActiveCategory(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      <div className="agent-grid">
        {visibleAgents.map((agent) => (
          <article className="agent-card" key={agent.slug}>
            <div className="card-topline">
              <span>{agent.category}</span>
              <span className="status">{agent.status}</span>
            </div>
            <h3>{agent.name}</h3>
            <p>{agent.summary}</p>
            <p className="agent-time">Estimated lab time · 60–90 minutes</p>
            <div className="concept-list">
              {agent.concepts.slice(0, 3).map((concept) => (
                <span key={concept}>{concept}</span>
              ))}
            </div>
            <div className="card-actions">
              <Link href={`/agents/${agent.slug}`}>Open agent page</Link>
              <a href={agent.githubUrl} rel="noreferrer" target="_blank">
                GitHub source
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
