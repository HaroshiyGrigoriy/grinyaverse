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
          работа и планы
        </h1>
        <p className="handwritten">Из интереса - в дело.</p>
      </header>
      <div className="project-stack">
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
      <section className="chapter" id="work">
        <span className="eyebrow">РАБОТА / WILLIAM &amp; KATE</span>
        <h2>Гости, разговоры и хороший вечер</h2>
        <p className="lead">Я работаю официантом в William &amp; Kate. Встречаю гостей так, как встречал бы друзей у себя дома.</p>
        <p>Мне интересно узнавать людей, запоминать то, что им нравится, и делать каждую следующую встречу чуть теплее. Из этой работы появляются идеи для моих проектов, в том числе для обучения команды и внимательной работы с гостями.</p>
      </section>
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
