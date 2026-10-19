import { useId, useState } from 'react';
import { Globe } from 'lucide-react';
import projects from '../data/projects.json';

type Project = {
  title: string;
  description: string;
  image: string;
  imageWidth?: number;
  imageHeight?: number;
  url?: string;
  featuredOrder?: number;
  category?: string;
  role?: string;
  stack?: string[];
  highlights?: string[];
};

const images = import.meta.glob<string>('../assets/projects/*.{webp,png}', {
  eager: true, query: '?url', import: 'default',
});
const allProjects: Project[] = projects;
const featured = allProjects.filter((project) => project.featuredOrder !== undefined)
  .sort((a, b) => a.featuredOrder! - b.featuredOrder!);
const moreProjects = allProjects.filter((project) => project.featuredOrder === undefined).reverse();
const imageUrl = (project: Project) => images[`../assets/projects/${project.image}`];

function ProjectWebsiteLink({ project }: { project: Project }) {
  if (!project.url) return null;

  return (
    <a className="editorial-link" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title} website (opens in a new tab)`}>
      Visit website <Globe size={16} strokeWidth={1.5} aria-hidden="true" />
    </a>
  );
}

function ProjectAccordion({ project, number }: { project: Project; number: number }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();

  return (
    <section className={`project${expanded ? ' is-expanded' : ''}`}>
      <h4>
        <button className="project-toggle" id={`${id}-toggle`} type="button" aria-expanded={expanded} aria-controls={`${id}-detail`} onClick={() => setExpanded(value => !value)}>
          <span className="project-number">{String(number).padStart(2, '0')}</span>
          <span className="project-title">{project.title}</span>
          <span className="project-symbol" aria-hidden="true">+</span>
        </button>
      </h4>
      <div className="project-reveal" id={`${id}-detail`} aria-labelledby={`${id}-toggle`} inert={!expanded}>
        <div className="project-reveal-inner">
          <div className="project-detail">
            <img src={imageUrl(project)} alt={`${project.title} project screenshot`} width={project.imageWidth} height={project.imageHeight} loading="lazy" />
            <p>{project.description}</p>
            <ProjectWebsiteLink project={project} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProjectShowcase() {
  return (
    <article className="work-content">
      <div className="work-heading"><h2 id="panel-title">Project.</h2><span>{allProjects.length} projects</span></div>
      <p className="panel-intro">A closer look at the applications I build, from CV creation to people, operations, sales, and inventory.</p>
      <section aria-label="Featured projects">
        {featured.map((project, index) => (
          <article className="featured-project" key={project.title}>
            <p className="eyebrow">{String(index + 1).padStart(2, '0')} / {project.category}</p>
            <h3>{project.title}</h3>
            <div className="featured-layout">
              <img src={imageUrl(project)} alt={`${project.title} application screenshot`} width={960} height={640} loading="lazy" />
              <div className="featured-copy">
                <p>{project.description}</p>
                <ProjectWebsiteLink project={project} />
                <dl className="project-facts">
                  <div><dt>Role</dt><dd>{project.role}</dd></div>
                  <div><dt>Stack</dt><dd>{project.stack?.join(' · ')}</dd></div>
                </dl>
                <h4 className="eyebrow">What it does</h4>
                <ul>{project.highlights?.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </div>
          </article>
        ))}
      </section>
      <section className="more-projects" aria-labelledby="more-projects-title">
        <div className="more-projects-heading"><h3 id="more-projects-title">More projects.</h3><span>{moreProjects.length} projects</span></div>
        <div className="project-list">
          {moreProjects.map((project, index) => (
            <ProjectAccordion project={project} number={index + featured.length + 1} key={project.title} />
          ))}
        </div>
      </section>
    </article>
  );
}
