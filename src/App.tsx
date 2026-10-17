import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { House, X } from 'lucide-react';
import resume from './assets/Dimas-Prayogi-Resume-ID.pdf?url';
import ProjectShowcase from './components/ProjectShowcase';
import ContactPanel from './components/ContactPanel';
import PortraitScanner from './components/PortraitScanner';
import projectData from './data/projects.json';
import techStack from './data/tech-stack.json';
import { workHistory } from './data/work-history';

type Panel = 'story' | 'tech' | 'history' | 'work' | 'contact' | null;
const contactEmail = 'dimasp95@icloud.com';
const linkedinUrl = 'https://www.linkedin.com/in/dimas-prayogi-4628111b2/';
const firstFeaturedProject = projectData.find((project) => project.featuredOrder === 1);
const navigation = [
  { label: 'Story', panel: 'story' },
  { label: 'Tech Stack', panel: 'tech' },
  { label: 'Experience', panel: 'history' },
  { label: 'Projects', panel: 'work' },
  { label: "Let's talk", panel: 'contact' },
] as const;
const desktopNavigation = navigation.filter(({ panel }) => panel !== 'work');
const panelLabels = { story: 'A bit about me', tech: 'Tech stack', history: 'Experience', work: 'Project', contact: 'Get in touch' };
const techImages = import.meta.glob<string>('./assets/tech/*.{png,svg}', {
  eager: true, query: '?url', import: 'default',
});
const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/den.dimss/' },
  { label: 'LinkedIn', href: linkedinUrl },
  { label: 'Strava', href: 'https://www.strava.com/athletes/59715584' },
];
const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelCloseRef = useRef<HTMLButtonElement>(null);
  const panelScrollRef = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const overlayOpen = menuOpen || panel !== null;

  useLayoutEffect(() => {
    if (!overlayOpen) return;
    const { scrollX, scrollY } = window;
    const body = document.body;
    const root = document.documentElement;
    const previousBodyOverflow = body.style.overflow;
    const previousRootOverflow = root.style.overflow;
    body.style.overflow = 'hidden';
    root.style.overflow = 'hidden';
    return () => {
      body.style.overflow = previousBodyOverflow;
      root.style.overflow = previousRootOverflow;
      window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
    };
  }, [overlayOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const firstLink = menuRef.current?.querySelector<HTMLElement>('a');
    firstLink?.focus({ preventScroll: true });
    function handleKeys(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuToggle.current?.focus({ preventScroll: true });
      }
      if (event.key !== 'Tab') return;
      const links = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a') ?? []);
      const controls = [menuToggle.current!, ...links];
      const current = controls.indexOf(document.activeElement as HTMLElement);
      event.preventDefault();
      controls[(current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length]?.focus();
    }
    function handleResize() {
      if (menuToggle.current && getComputedStyle(menuToggle.current).display === 'none') setMenuOpen(false);
    }
    document.addEventListener('keydown', handleKeys);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('keydown', handleKeys);
      window.removeEventListener('resize', handleResize);
    };
  }, [menuOpen]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (panel) {
      if (!dialog.open) dialog.showModal();
      // Reset after showModal's native focus handling, before the first paint.
      panelCloseRef.current?.focus({ preventScroll: true });
      dialog.scrollTop = 0;
      dialog.scrollLeft = 0;
      panelScrollRef.current?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } else if (dialog.open) {
      dialog.close();
    }
  }, [panel]);

  function openPanel(next: Exclude<Panel, null>) {
    lastTrigger.current = menuOpen ? menuToggle.current : document.activeElement as HTMLElement;
    setMenuOpen(false);
    setPanel(next);
  }

  function closePanel() {
    dialogRef.current?.close();
    setPanel(null);
    lastTrigger.current?.focus({ preventScroll: true });
  }

  function closeMenu() {
    setMenuOpen(false);
    menuToggle.current?.focus({ preventScroll: true });
  }

  function navLinks(mobile = false) {
    return (mobile ? navigation : desktopNavigation).map(({ label, panel: targetPanel }, index) => (
      <a
        key={label}
        href={`#${targetPanel}`}
        className={mobile ? 'drawer-link' : 'anim-fade-up transition-opacity duration-300 hover:!opacity-60'}
        style={mobile ? { transitionDelay: menuOpen ? `${300 + index * 80}ms` : '0ms' } : delay(1000 + index * 80)}
        onClick={(event) => {
          event.preventDefault();
          openPanel(targetPanel);
        }}
      >{label}</a>
    ));
  }

  return (
    <>
      <main inert={menuOpen}>
        <section className="hero relative h-[100dvh] w-full overflow-hidden bg-[#141414] text-cream" aria-label="Dimas Prayogi portfolio">
          <div className="hero-background anim-fade-in absolute inset-0" aria-hidden="true">
            <div className="hero-contours" />
          </div>
          <div className="hero-shade absolute inset-0" aria-hidden="true" />

          <header className="hero-header absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8">
            <div className="hero-brand">
              <a href="./" className="anim-fade-up font-display text-lg font-medium tracking-tight" style={delay(800)} aria-label="Dimas Prayogi — home">{'</dims>'}</a>
              <a className="workspace-link anim-fade-up" style={delay(950)} href="https://dims-virtualhome.vercel.app/" aria-label="Enter my virtual workspace">
                <House className="workspace-icon" size={16} strokeWidth={1.5} aria-hidden="true" />
                <span>Virtual Home</span>
              </a>
            </div>
            <div className="desktop-navigation hidden items-start gap-16 sm:flex lg:gap-24">
              <span className="anim-fade-up text-sm" style={delay(900)}>&copy; 2026</span>
              <nav className="flex flex-col gap-0.5 text-sm" aria-label="Site index">{navLinks()}</nav>
              <nav className="flex flex-col gap-0.5 text-sm" aria-label="Find me">
                {socials.map((social, index) => (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="anim-fade-up transition-opacity duration-300 hover:!opacity-60" style={delay(1150 + index * 80)}>{social.label}</a>
                ))}
              </nav>
            </div>
          </header>

          <h1 className="sr-only">Dimas Prayogi — Software Engineer</h1>
          <div className="hero-marquee anim-fade-up absolute inset-x-0 top-[16vh] z-10 overflow-hidden sm:top-[14vh]" style={delay(500)} aria-hidden="true">
            <div className="marquee flex w-max whitespace-nowrap text-[16vh] leading-none text-cream sm:text-[26vh]">
              <span className="pr-[6vw]">Dimas &mdash; Prayogi&nbsp;</span>
              <span className="pr-[6vw]">Dimas &mdash; Prayogi&nbsp;</span>
            </div>
          </div>

          <div className="mobile-identity anim-fade-up" style={delay(500)} aria-hidden="true">
            <p className="mobile-kicker"><span />Software Engineer</p>
            <p className="mobile-name"><span>Dimas</span><span>Prayogi</span></p>
          </div>

          <div className="mobile-focus anim-fade-up" style={delay(1050)}>
            <p className="eyebrow">Core stack</p>
            <p>Tailwindcss<br />Alpine.js<br />Laravel<br />Livewire</p>
          </div>

          <div className="cartoon-stage anim-rise-in" style={delay(300)}>
            <PortraitScanner />
          </div>
          <div className="mobile-shade pointer-events-none absolute inset-0 z-20 sm:hidden" aria-hidden="true" />

          <div className="hero-intro anim-fade-up" style={delay(1350)}>
            <p className="eyebrow">Software Engineer</p>
            <p className="hero-statement"><span className="desktop-statement">Building reliable web applications and internal tools.</span><span className="mobile-statement">Thoughtful code.<br />Useful applications.</span></p>
            <div className="hero-actions">
              <a href="#work" onClick={(event) => { event.preventDefault(); openPanel('work'); }}>View Projects <span aria-hidden="true">↗</span></a>
              <a href={resume} target="_blank" rel="noopener noreferrer">Resume <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <div className="hero-rule anim-line absolute inset-x-6 bottom-[5.5rem] z-10 h-0.5 bg-cream sm:inset-x-10 sm:bottom-28" style={delay(1200)} aria-hidden="true" />
          <footer className="hero-footer absolute inset-x-0 bottom-0 z-30 flex items-end justify-between px-6 pb-5 text-xs leading-relaxed sm:z-10 sm:px-10 sm:pb-8 sm:text-sm">
            <div className="mobile-footer">
              <a className="mobile-project-teaser" href="#work" onClick={(event) => { event.preventDefault(); openPanel('work'); }}>
                <span className="mobile-project-index" aria-hidden="true">01</span>
                <span className="mobile-project-copy"><span className="eyebrow">Last project</span><strong>{firstFeaturedProject?.title ?? 'Explore my work'}</strong><span className="mobile-project-category">{firstFeaturedProject?.category}</span></span>
                <span className="mobile-project-arrow" aria-hidden="true">↗</span>
              </a>
              <div className="mobile-footer-meta"><span>Samarinda, Indonesia</span><span>&copy; 2026</span></div>
            </div>
            <p className="anim-fade-up" style={delay(1400)}>
              Software Engineer<br />Runner &amp; Cyclist
            </p>
            <p className="anim-fade-up text-right" style={delay(1550)}>
              Based in<br />Samarinda, Indonesia
            </p>
          </footer>
        </section>
      </main>

      <div role={menuOpen ? 'dialog' : undefined} aria-modal={menuOpen ? true : undefined} aria-label={menuOpen ? 'Navigation' : undefined}>
      <button
        ref={menuToggle}
        className={`menu-toggle anim-fade-up fixed right-6 top-6 z-50 flex h-10 w-10 items-center justify-center text-cream sm:hidden ${menuOpen ? 'is-open' : ''}`}
        style={delay(900)}
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-drawer"
        onClick={() => menuOpen ? closeMenu() : setMenuOpen(true)}
      >
        <span className="hamburger" aria-hidden="true"><span /><span /><span /></span>
        <X size={26} strokeWidth={1.5} className="drawer-close" aria-hidden="true" />
      </button>

      <div
        id="mobile-drawer"
        ref={menuRef}
        className={`mobile-drawer fixed inset-0 z-40 sm:hidden ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="drawer-backdrop absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeMenu} aria-hidden="true" />
        <div className="drawer-panel absolute inset-y-0 right-0 w-[80%] max-w-sm overflow-y-auto bg-[#141414] px-8 py-10 text-cream">
          <p className="drawer-label mt-20 text-xs uppercase tracking-[0.2em] text-cream/50" style={{ transitionDelay: menuOpen ? '250ms' : '0ms' }}>Site Index</p>
          <nav className="mt-7 flex flex-col gap-4 text-4xl" aria-label="Mobile site index">{navLinks(true)}</nav>
          <p className="drawer-label mt-16 text-xs uppercase tracking-[0.2em] text-cream/50" style={{ transitionDelay: menuOpen ? '500ms' : '0ms' }}>Find Me</p>
          <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm" aria-label="Mobile social profiles">
            {socials.map((social, index) => (
              <a key={social.label} className="drawer-social" style={{ transitionDelay: menuOpen ? `${550 + index * 60}ms` : '0ms' }} href={social.href} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>{social.label}</a>
            ))}
          </nav>
        </div>
      </div>
      </div>

      <dialog ref={dialogRef} className="content-dialog" aria-labelledby="panel-title" onCancel={(event) => { event.preventDefault(); closePanel(); }} onClick={(event) => { if (event.target === event.currentTarget) closePanel(); }}>
        <div className="panel-topline"><span>Dims / {panel ? panelLabels[panel] : ''}</span><button ref={panelCloseRef} type="button" onClick={closePanel} className="panel-close" aria-label="Close panel"><span aria-hidden="true">×</span></button></div>
        <div key={panel ?? 'closed'} ref={panelScrollRef} className="content-panel" role="region" aria-label={panel ? `${panelLabels[panel]} content` : 'Panel content'} tabIndex={0}>
          {panel === 'story' ? (
            <article className="story-content">
              <p className="eyebrow">Samarinda, Indonesia</p>
              <h2 id="panel-title">Engineer by trade.<br />Curious by nature.</h2>
              <div className="story-body">
                <p>I'm Dimas Prayogi, a software engineer developing reliable internal systems, dashboards, and operational tools. My work brings together full-stack development, thoughtful interfaces, and practical problem solving.</p>
                <p>Beyond the screen, you'll find me running, cycling, taking photographs, or operating live stadium visuals with Borneo FC Samarinda. Constantly optimizing both my code and my human hardware through data and movement.</p>
                <a className="editorial-link" href={resume} target="_blank" rel="noopener noreferrer">View my resume <span aria-hidden="true">↗</span></a>
              </div>
            </article>
          ) : panel === 'tech' ? (
            <article className="work-content">
              <div className="work-heading"><h2 id="panel-title">Tech stack.</h2><span>{techStack.length} technologies &amp; tools</span></div>
              <p className="panel-intro">The technologies I use to build, ship, and keep things running.</p>
              <ul className="tech-list">
                {techStack.map((tech) => (
                  <li key={tech.name}><img className={tech.monochrome ? 'tech-icon-monochrome' : undefined} src={techImages[`./assets/tech/${tech.image}`]} alt="" width={36} height={36} loading="lazy" /><span>{tech.name}</span></li>
                ))}
              </ul>
            </article>
          ) : panel === 'history' ? (
            <article className="work-content">
              <div className="work-heading"><h2 id="panel-title">Experience.</h2><span>2014 — Present</span></div>
              <div className="history-list">
                {workHistory.map((job) => (
                  <section className="history-entry" key={job.company} aria-label={job.company}>
                    <div className="history-meta"><p>{job.period}</p><p>{job.arrangement}</p></div>
                    <div className="history-body">
                      <h3>{job.company}</h3>
                      {job.roles.map((role) => (
                        <div className="history-role" key={role.title}>
                          <h4>{role.title}</h4>
                          <p className="history-period">{role.period}</p>
                          <ul>{role.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
                          <p className="history-tools">{role.tools}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          ) : panel === 'work' ? (
            <ProjectShowcase />
          ) : panel === 'contact' ? (
            <ContactPanel email={contactEmail} linkedinUrl={linkedinUrl} />
          ) : null}
          <div className="panel-bottomline"><span>Dimas Prayogi</span><a href={`mailto:${contactEmail}`}>{contactEmail} ↗</a></div>
        </div>
      </dialog>
    </>
  );
}
