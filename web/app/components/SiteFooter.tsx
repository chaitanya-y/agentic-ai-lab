import Link from "next/link";
import { linkedinUrl, repoUrl } from "../../lib/agents";

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
        <Link href="/roadmap">Roadmap</Link>
        <Link href="/blog">Why this lab</Link>
        <a href={repoUrl} rel="noreferrer" target="_blank">
          Star on GitHub ↗
        </a>
        <a href={linkedinUrl} rel="noreferrer" target="_blank">
          Connect on LinkedIn ↗
        </a>
      </div>
      <p className="footer-note">An open learning resource for software engineers transitioning into agentic engineering.</p>
    </footer>
  );
}
