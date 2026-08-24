import { About } from './components/About';
import { Achievements } from './components/Achievements';
import { BackgroundEffects } from './components/BackgroundEffects';
import { CodingActivity } from './components/CodingActivity';
import { Contact } from './components/Contact';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Expertise } from './components/Expertise';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { ToastProvider } from './components/Toast';
import { sectionOrder } from './data/portfolio';
import { useActiveSection } from './hooks/useActiveSection';
import { useScrollPerformance } from './hooks/useScrollPerformance';
import { useTheme } from './hooks/useTheme';

/**
 * Page order is fixed by design: hero → about → skills → expertise → projects
 * → achievements → activity → contact. Each section is isolated so a failure in
 * one never takes the rest of the page down with it.
 */
const SECTIONS = [
  { label: 'Introduction', Component: Hero },
  { label: 'About', Component: About },
  { label: 'Skills', Component: Skills },
  { label: 'Core IT Expertise', Component: Expertise },
  { label: 'Projects', Component: Projects },
  { label: 'Achievements', Component: Achievements },
  { label: 'Coding Activity', Component: CodingActivity },
  { label: 'Contact', Component: Contact },
] as const;

export default function App() {
  const active = useActiveSection(sectionOrder);
  useScrollPerformance();
  const { theme, setTheme } = useTheme();

  return (
    <ToastProvider>
      {/* Keyboard users land here first */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-lg focus:bg-brand-cyan focus:px-4 focus:py-2 focus:font-display focus:text-[0.7rem] focus:font-bold focus:tracking-[0.16em] focus:text-ink focus:uppercase"
      >
        Skip to content
      </a>

      <BackgroundEffects />
      <Navbar active={active} theme={theme} onThemeChange={setTheme} />

      <main id="main">
        {SECTIONS.map(({ label, Component: SectionComponent }) => (
          <ErrorBoundary key={label} label={label}>
            <SectionComponent />
          </ErrorBoundary>
        ))}
      </main>

      <ErrorBoundary label="Footer">
        <Footer />
      </ErrorBoundary>
    </ToastProvider>
  );
}
