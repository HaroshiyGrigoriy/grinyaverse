export default function ProjectCard({ label, title, description }) {
  return (
    <article className="project-card">
      <span className="project-index">{label}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
}
