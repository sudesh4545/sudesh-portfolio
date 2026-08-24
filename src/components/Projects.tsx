import { useCallback, useState } from 'react';
import { projects, projectsCopy } from '../data/portfolio';
import type { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { Reveal } from './Reveal';
import { Section } from './Section';
import { SectionHeading } from './SectionHeading';
import { useToast } from './Toast';

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const { push } = useToast();

  const notifyUnavailable = useCallback(
    (hint: string) => push({ title: 'Link not configured', description: hint, variant: 'info' }),
    [push],
  );

  const close = useCallback(() => setActive(null), []);

  return (
    <Section id="projects" labelledBy="projects-heading">
      <SectionHeading
        id="projects-heading"
        eyebrow="Featured Work"
        title={projectsCopy.heading}
        subtitle={projectsCopy.subheading}
      />

      <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
        {projects.map((project, index) => (
          <li key={project.id} className="h-full">
            <Reveal delay={index * 0.09} className="h-full">
              <ProjectCard project={project} onOpen={setActive} onUnavailable={notifyUnavailable} />
            </Reveal>
          </li>
        ))}
      </ul>

      <ProjectModal project={active} onClose={close} onUnavailable={notifyUnavailable} />
    </Section>
  );
}
