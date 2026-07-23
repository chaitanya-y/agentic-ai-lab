import Link from "next/link";
import { profileUrl, repoUrl } from "../../lib/agents";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" href="/">
          Agentic AI Lab
        </Link>
        <p>A focused, hands-on path from software engineering to agentic engineering.</p>
      </div>
      <div className="footer-links">
        <Link href="/catalog">Lesson catalog</Link>
        <Link href="/roadmap">Roadmap</Link>
        <Link href="/glossary">Glossary</Link>
        <Link href="/blog">Project objectives</Link>
        <Link href="/contribute">Contribute</Link>
        <a href={repoUrl} rel="noreferrer" target="_blank">
          Star on GitHub ↗
        </a>
        <a href={profileUrl} rel="noreferrer" target="_blank">
          Follow Chaitanya ↗
        </a>
      </div>
      <p className="footer-note">An open learning resource for software engineers transitioning into agentic engineering.</p>
    </footer>
  );
}
