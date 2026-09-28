import BackLink from '../components/common/BackLink';
import ProjectCard from '../components/common/ProjectCard';
import { projects } from '../data/projects';

export default function ProjectsPage() {
  return (
    <>
      <BackLink />
      <h1 className="inner-heading">ДЕЛАЮ.<br /><mark>ПРИДУМЫВАЮ.</mark><br />ПРОДОЛЖАЮ.</h1>
      <div className="project-stack">
        {projects.map(project => <ProjectCard key={project.id} {...project} />)}
      </div>
    </>
  );
}
