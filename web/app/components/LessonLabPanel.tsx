type LessonLabPanelProps = {
  description: string;
  path: string;
  title: string;
  url: string;
};

export function LessonLabPanel({ description, path, title, url }: LessonLabPanelProps) {
  return (
    <aside className="lesson-lab-panel" aria-label="Runnable lesson lab">
      <div>
        <span>Runnable lab</span>
        <h2>{title}</h2>
        <p>{description}</p>
        <code>{path}</code>
      </div>
      <a href={url} rel="noreferrer" target="_blank">
        View the complete lab ↗
      </a>
    </aside>
  );
}
