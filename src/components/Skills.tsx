import { skills, skillsCopy } from '../data/portfolio';
import { Section } from './Section';
import { SectionHeading } from './SectionHeading';
import { SkillCard } from './SkillCard';

export function Skills() {
  return (
    <Section id="skills" labelledBy="skills-heading">
      {/* Faint grid so the section reads as a technical panel */}
      <div
        aria-hidden="true"
        className="cyber-grid pointer-events-none absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_72%)]"
      />

      <div className="relative">
        <SectionHeading
          id="skills-heading"
          eyebrow="Technical Skills"
          title={skillsCopy.heading}
          subtitle={skillsCopy.subheading}
        />

        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          {skills.map((skill, index) => (
            <li key={skill.name}>
              <SkillCard skill={skill} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
