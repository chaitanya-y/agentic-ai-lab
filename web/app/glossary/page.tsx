import { GlossaryExplorer } from "../components/GlossaryExplorer";
import { glossary } from "../../lib/glossary";

export const metadata = {
  title: "Plain-Language Glossary",
  description: "Simple definitions and practical examples for the vocabulary used in agentic engineering."
};

export default function GlossaryPage() {
  return (
    <main className="inner-page">
      <section className="page-hero">
        <p className="eyebrow">Plain-language reference</p>
        <h1>Definitions for core agentic engineering terminology.</h1>
        <p>
          {glossary.length} short definitions covering LLM foundations, retrieval, agents, orchestration, and production
          operations. Read the whole list in about 25–35 minutes or search as you learn.
        </p>
        <div className="page-meta">
          <span>{glossary.length} terms</span>
          <span>25–35 minute read</span>
          <span>Practical examples included</span>
        </div>
      </section>
      <GlossaryExplorer />
    </main>
  );
}
