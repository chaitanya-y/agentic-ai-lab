import Link from "next/link";
import { curriculum } from "../lib/curriculum";
import { RoadmapLink, WhyLabLink } from "./components/GuidedLinks";

export default function Home() {
  return (
    <main>
      <section className="home-hero home-hero-simple">
        <div className="hero-intro">
          <h1>Agentic AI Engineering Lab for Software Engineers</h1>
          <p>
            A focused path for software engineers who want to build the skills needed for AI engineering roles in
            about two months. Work through short lessons, runnable examples, and one capstone project.
          </p>
          <div className="hero-actions">
            <RoadmapLink className="button button-dark">
              View the roadmap
            </RoadmapLink>
            <WhyLabLink className="button button-light">
              Why this lab
            </WhyLabLink>
          </div>
        </div>
      </section>

      <section className="home-roadmap" aria-labelledby="home-roadmap-title">
        <div className="home-roadmap-intro">
          <p className="eyebrow">Roadmap</p>
          <h2 id="home-roadmap-title">The learning path.</h2>
        </div>

        <div className="home-roadmap-list">
          {curriculum.map((phase) => (
            <Link className="home-roadmap-row" href="/roadmap" key={phase.id}>
              <span>{phase.number}</span>
              <div>
                <h3>{phase.title}</h3>
              </div>
              <small>{phase.time}</small>
            </Link>
          ))}
        </div>

        <RoadmapLink className="button button-dark home-roadmap-link">
          View the full roadmap →
        </RoadmapLink>
      </section>
    </main>
  );
}
