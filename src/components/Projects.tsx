import { useCallback, useState } from 'react';
import { projectCollections, projects, projectsCopy } from '../data/portfolio';
import type { Project, ProjectCollection } from '../types';
import { ProjectCard } from './ProjectCard';
import { ProjectCollectionCard } from './ProjectCollectionCard';
import { ProjectCollectionModal } from './ProjectCollectionModal';
import { ProjectModal } from './ProjectModal';
import { Reveal } from './Reveal';
import { Section } from './Section';
import { SectionHeading } from './SectionHeading';
import { useToast } from './Toast';

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const [activeCollection, setActiveCollection] = useState<ProjectCollection | null>(null);
  const { push } = useToast();

  const notifyUnavailable = useCallback(
    (hint: string) => push({ title: 'Link not configured', description: hint, variant: 'info' }),
    [push],
  );

  const close = useCallback(() => setActive(null), []);
  const closeCollection = useCallback(() => setActiveCollection(null), []);

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

      <div className="mt-20 border-t border-white/[0.07] pt-14 lg:mt-24 lg:pt-16">
        <div className="max-w-2xl">
          <p className="eyebrow">More experiments</p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-paper sm:text-3xl">Explore more of my work</h3>
          <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">
            Two growing collections for focused builds and compact applications. Open a collection to browse every slot.
          </p>
        </div>

        <ul className="mt-9 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          {projectCollections.map((collection, index) => (
            <li key={collection.id} className="h-full">
              <Reveal delay={index * 0.1} className="h-full">
                <ProjectCollectionCard collection={collection} onOpen={setActiveCollection} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <ProjectModal project={active} onClose={close} onUnavailable={notifyUnavailable} />
      <ProjectCollectionModal collection={activeCollection} onClose={closeCollection} />
    </Section>
  );
}
