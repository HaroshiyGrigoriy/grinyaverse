export default function ProjectCard({
  label,
  title,
  description,
  note,
  url,
  linkLabel,
}) {
  return (
    <article className="project-card">
      <span className="eyebrow">{label}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      <span className="project-note">{note}</span>
      {url && (
        <a className="text-link" href={url} target="_blank" rel="noreferrer">
          {linkLabel}
        </a>
      )}
    </article>
  );
}
