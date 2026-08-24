import { expertise, expertiseCopy } from '../data/portfolio';
import { accent as accentMap, accentHex, withAlpha } from '../lib/accents';
import { cn } from '../lib/cn';
import type { ExpertiseItem } from '../types';
import { Icon } from './Icon';
import { Reveal } from './Reveal';
import { Section } from './Section';
import { SectionHeading } from './SectionHeading';

function ExpertiseNode({ item, index }: { item: ExpertiseItem; index: number }) {
  const tone = accentMap[item.accent];
  const hex = accentHex[item.accent];

  return (
    <Reveal delay={index * 0.07} className="h-full">
      <div className="group flex h-full flex-col items-center text-center">
        {/* Hexagonal node */}
        <span className="relative inline-flex size-[4.25rem] shrink-0 items-center justify-center transition-transform duration-300 group-hover:-translate-y-1 sm:size-[4.75rem]">
          {/* Gradient hex "border" */}
          <span
            aria-hidden="true"
            className="absolute inset-0 opacity-60 transition-opacity duration-300 group-hover:opacity-100 [clip-path:var(--hex)]"
            style={{ background: `linear-gradient(150deg, ${hex}, ${withAlpha(hex, 0.15)})` }}
          />
          {/* Dark glass core */}
          <span
            aria-hidden="true"
            className="absolute inset-[1.5px] bg-[#050b13] [clip-path:var(--hex)]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-[1.5px] bg-gradient-to-br from-white/[0.07] via-transparent to-transparent [clip-path:var(--hex)]"
          />
          {/* Hover bloom */}
          <span
            aria-hidden="true"
            className="absolute inset-2 rounded-full opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-70"
            style={{ background: withAlpha(hex, 0.55) }}
          />

          <Icon
            name={item.icon}
            className={cn('relative size-6 transition-transform duration-300 group-hover:scale-110', tone.text)}
          />
        </span>

        <h3 className="mt-4 font-display text-[0.7rem] leading-[1.45] font-semibold tracking-[0.14em] text-paper/90 uppercase transition-colors duration-300 group-hover:text-paper sm:text-[0.74rem]">
          {item.lines[0]}
          <br />
          {item.lines[1]}
        </h3>

        <span
          aria-hidden="true"
          className={cn(
            'mt-3 block h-px w-0 transition-all duration-500 group-hover:w-10',
            item.accent === 'cyan'
              ? 'bg-brand-cyan'
              : item.accent === 'purple'
                ? 'bg-brand-purple'
                : item.accent === 'magenta'
                  ? 'bg-brand-magenta'
                  : 'bg-brand-blue',
          )}
        />
      </div>
    </Reveal>
  );
}

export function Expertise() {
  return (
    <Section id="expertise" labelledBy="expertise-heading" className="pt-4 sm:pt-6 lg:pt-8">
      <SectionHeading
        id="expertise-heading"
        eyebrow="Core Foundations"
        title={expertiseCopy.heading}
        subtitle={expertiseCopy.subheading}
      />

      <div className="relative mt-14 lg:mt-16">
        {/* Dashed connecting rail — desktop only, aligned to the node centres */}
        <span
          aria-hidden="true"
          className="absolute top-[2.375rem] right-[7%] left-[7%] hidden h-px lg:block"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(0,240,255,0.38) 0 6px, transparent 6px 16px)',
          }}
        />
        <span
          aria-hidden="true"
          className="absolute top-[2.375rem] right-[7%] left-[7%] hidden h-px bg-gradient-to-r from-transparent via-brand-purple/30 to-transparent blur-[2px] lg:block"
        />

        <ul className="relative grid grid-cols-2 gap-x-4 gap-y-10 xs:gap-x-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-2">
          {expertise.map((item, index) => (
            <li key={item.id} className="flex justify-center">
              <ExpertiseNode item={item} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
