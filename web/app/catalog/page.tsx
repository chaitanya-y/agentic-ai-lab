import { LessonCatalog } from "../components/LessonCatalog";
import { allLessons, curriculum, totalHours } from "../../lib/curriculum";

export const metadata = {
  title: "Lesson Catalog",
  description: "Search and filter every Agentic AI Lab lesson by phase, format, concept, and estimated time."
};

export default function CatalogPage() {
  return (
    <main className="inner-page">
      <section className="page-hero">
        <p className="eyebrow">Searchable curriculum</p>
        <h1>Browse lessons by skill, phase, and format.</h1>
        <p>
          Browse {allLessons.length} lessons across {curriculum.length} phases. The full guided path is about {totalHours}{" "}
          hours; experienced engineers can filter directly to a missing concept or implementation pattern.
        </p>
        <div className="page-meta">
          <span>{allLessons.length} lessons</span>
          <span>Approximately {totalHours} guided hours</span>
          <span>Concepts + builds + capstone</span>
        </div>
      </section>
      <LessonCatalog />
    </main>
  );
}
