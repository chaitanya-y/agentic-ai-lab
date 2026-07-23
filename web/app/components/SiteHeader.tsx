import Link from "next/link";
import { repoUrl } from "../../lib/agents";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Agentic AI Lab home">
        Agentic AI Lab
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/#contents">Contents</Link>
        <Link href="/catalog">Catalog</Link>
        <Link href="/roadmap">Roadmap</Link>
        <Link href="/glossary">Glossary</Link>
        <Link href="/blog">About</Link>
        <a className="header-github" href={repoUrl} rel="noreferrer" target="_blank">
          GitHub ↗
        </a>
      </nav>
    </header>
  );
}
