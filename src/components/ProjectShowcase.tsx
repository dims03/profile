import projects from '../data/projects.json';

type Project = {
  title: string;
  description: string;
  image: string;
  featuredOrder?: number;
  category?: string;
  role?: string;
  stack?: string[];
  highlights?: string[];
};

const images = import.meta.glob<string>('../assets/projects/*.webp', {
  eager: true, query: '?url', import: 'default',
});
const allProjects: Project[] = projects;
const featured = allProjects.filter((project) => project.featuredOrder !== undefined)
  .sort((a, b) => a.featuredOrder! - b.featuredOrder!);
const moreProjects = allProjects.filter((project) => project.featuredOrder === undefined).reverse();
const imageUrl = (project: Project) => images[`../assets/projects/${project.image}`];

export default function ProjectShowcase() {
  return (
    <article className="work-content">
      <div className="work-heading"><h2 id="panel-title">Project.</h2><span>{allProjects.length} projects</span></div>
      <p className="panel-intro">A closer look at the systems I build, from people and operations to sales and inventory.</p>
      <section aria-label="Featured projects">
        {featured.map((project, index) => (
          <article className="featured-project" key={project.title}>
            <p className="eyebrow">{String(index + 1).padStart(2, '0')} / {project.category}</p>
            <h3>{project.title}</h3>
            <div className="featured-layout">
              <img src={imageUrl(project)} alt={`${project.title} application screenshot`} width={960} height={640} loading="lazy" />
              <div className="featured-copy">
                <p>{project.description}</p>
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
            <details className="project" key={project.title}>
              <summary><span className="project-number">{String(index + featured.length + 1).padStart(2, '0')}</span><h4>{project.title}</h4><span className="project-symbol" aria-hidden="true">+</span></summary>
              <div className="project-detail"><img src={imageUrl(project)} alt={`${project.title} project screenshot`} loading="lazy" /><p>{project.description}</p></div>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}
