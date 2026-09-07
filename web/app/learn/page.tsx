import type { Metadata } from "next";
import { LearningHome, type ReleasedLearningPhase } from "../components/LearningHome";
import { RoadmapAccessGate } from "../components/RoadmapAccessGate";
import { curriculum } from "../../lib/curriculum";
import { isPhaseAvailable } from "../../lib/siteStatus";

export const metadata: Metadata = {
  title: "Learn",
  description: "Read the released Agentic AI Lab lessons."
};

export default function LearnPage() {
  const phases: ReleasedLearningPhase[] = curriculum.filter((phase) => isPhaseAvailable(phase.id)).map((phase) => ({
    id: phase.id,
    number: phase.number,
    title: phase.title,
    time: phase.time,
    lessons: phase.lessons.map(({ slug, time, title }) => ({ slug, time, title }))
  }));

  return (
    <RoadmapAccessGate>
      <LearningHome phases={phases} />
    </RoadmapAccessGate>
  );
}
