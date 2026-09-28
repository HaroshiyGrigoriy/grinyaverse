import BackLink from "../components/common/BackLink";
import ProjectCard from "../components/common/ProjectCard";
import { projects } from "../data/projects";
export default function ProjectsPage() {
  return (
    <>
      <BackLink />
      <header className="page-heading">
        <span className="eyebrow">02 / В РАБОТЕ</span>
        <h1>
          Проекты,
          <br />
          работа & планы
        </h1>
        <p className="handwritten">Из интереса - в дело.</p>
      </header>
      <div className="project-stack">
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
      <section className="chapter">
        <h2>И ещё немного творчества</h2>
        <p className="lead">
          Видео, музыка, парфюмерные впечатления. Мне нравится пробовать,
          собирать новое и делиться тем, что получилось.
        </p>
      </section>
    </>
  );
}
