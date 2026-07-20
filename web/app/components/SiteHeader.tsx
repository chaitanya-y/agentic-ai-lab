import { repoUrl } from "../../lib/agents";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/">
        Agentic AI Lab
      </a>
      <nav aria-label="Primary navigation">
        <a href="/#roadmap">Roadmap</a>
        <a href="/#agents">Agents</a>
        <a href="/#systems">Systems</a>
        <a href="/blog">Blog</a>
        <a href={repoUrl} rel="noreferrer" target="_blank">
          GitHub
        </a>
      </nav>
    </header>
  );
}
