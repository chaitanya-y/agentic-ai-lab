import Link from "next/link";
import { repoUrl } from "../../lib/agents";
import { LearningNavLink } from "./GuidedLinks";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Agentic AI Lab home">
        Agentic AI Lab
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/roadmap">Roadmap</Link>
        <LearningNavLink />
        <Link href="/blog">Why this lab</Link>
        <a className="header-github" href={repoUrl} rel="noreferrer" target="_blank">
          GitHub ↗
        </a>
      </nav>
    </header>
  );
}
