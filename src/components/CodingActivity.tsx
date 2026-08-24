import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ExternalLink, Info } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { activityCopy, githubActivity, platforms } from '../data/portfolio';
import liveStats from '../data/live-stats.json';
import { useCountUp } from '../hooks/useCountUp';
import { accent as accentMap, accentHex, withAlpha } from '../lib/accents';
import { cn } from '../lib/cn';
import type { CodingPlatform } from '../types';
import { GlassCard } from './GlassCard';
import { Icon } from './Icon';
import { NeonButton } from './NeonButton';
import { Reveal } from './Reveal';
import { Section } from './Section';
import { SectionHeading } from './SectionHeading';
import { useToast } from './Toast';

/* -------------------------------------------------------------------------- */
/*  Sparkline                                                                 */
/* -------------------------------------------------------------------------- */

function Sparkline({ values, hex, id }: { values: number[]; hex: string; id: string }) {
  const width = 100;
  const height = 30;

  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * width;
    const y = height - (Math.min(Math.max(value, 0), 100) / 100) * (height - 4) - 2;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const line = `M${points.join(' L')}`;
  const area = `${line} L${width},${height} L0,${height} Z`;
  const last = points[points.length - 1]?.split(',') ?? ['0', '0'];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className="h-8 w-full"
    >
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={hex} stopOpacity="0.35" />
          <stop offset="100%" stopColor={hex} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${id})`} />
      <path d={line} fill="none" stroke={hex} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="2" fill="#ffffff" />
      <circle cx={last[0]} cy={last[1]} r="4" fill={hex} fillOpacity="0.3" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Platform card                                                             */
/* -------------------------------------------------------------------------- */

function PlatformCard({
  platform,
  index,
  onUnavailable,
}: {
  platform: CodingPlatform;
  index: number;
  onUnavailable: (hint: string) => void;
}) {
  const tone = accentMap[platform.accent];
  const hex = accentHex[platform.accent];

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <GlassCard interactive accent={platform.accent} className="h-full">
        <div className="flex h-full flex-col p-5">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                'inline-flex size-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110',
                tone.chip,
              )}
            >
              <Icon name={platform.icon} className="size-5" />
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="truncate font-display text-[0.95rem] font-semibold text-paper">{platform.name}</h3>
              <p className="truncate text-[0.7rem] text-faint">{platform.handle}</p>
            </div>

            {platform.placeholder && (
              <span
                title="Sample value — replace it in src/data/portfolio.ts"
                className="shrink-0 rounded-full border border-dashed border-white/15 px-2 py-0.5 font-display text-[0.48rem] font-semibold tracking-[0.2em] text-faint uppercase"
              >
                Sample
              </span>
            )}
          </div>

          <p
            className={cn(
              'mt-4 inline-flex w-fit items-center rounded-lg border px-2.5 py-1 font-display text-[0.62rem] font-semibold tracking-[0.12em] uppercase',
              tone.chip,
            )}
          >
            {platform.rank}
          </p>

          <div className="mt-4">
            <Sparkline values={platform.trend} hex={hex} id={platform.id} />
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-4">
            {platform.stats.map((stat) => (
              <div key={stat.label} className="min-w-0 text-center">
                <dt className="truncate font-display text-[0.52rem] font-semibold tracking-[0.18em] text-faint uppercase">
                  {stat.label}
                </dt>
                <dd className="mt-1 truncate font-display text-[0.9rem] font-bold text-paper">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5">
            <NeonButton
              size="sm"
              variant="outline"
              fullWidth
              href={platform.url}
              unavailable={!platform.url}
              unavailableHint={`Add your ${platform.name} profile URL in src/data/portfolio.ts`}
              onUnavailable={onUnavailable}
              ariaLabel={`Open ${platform.name} profile`}
              iconRight={<ExternalLink aria-hidden="true" className="size-3.5" />}
            >
              Visit profile
            </NeonButton>
          </div>
        </div>
      </GlassCard>
    </Reveal>
  );
}

/* -------------------------------------------------------------------------- */
/*  Contribution heatmap                                                      */
/* -------------------------------------------------------------------------- */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const LEVEL_ALPHA = [0.05, 0.28, 0.48, 0.7, 0.95];

interface Cell {
  key: string;
  level: number;
  label: string;
  count: number;
  filled: boolean;
}

function useHeatmap(weeks: number, liveDays: Array<{ date: string; count: number; level: number }>) {
  return useMemo(() => {
    const liveByDate = new Map(liveDays.map((day) => [day.date, day]));
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Column 0 starts on the Sunday of the week that is `weeks - 1` weeks back.
    const start = new Date(end);
    start.setDate(end.getDate() - (weeks - 1) * 7 - end.getDay());

    const columns: Cell[][] = [];
    const monthLabels: Array<{ column: number; label: string }> = [];
    let lastMonth = -1;
    let total = 0;

    for (let week = 0; week < weeks; week++) {
      const column: Cell[] = [];

      for (let day = 0; day < 7; day++) {
        const date = new Date(start);
        date.setDate(start.getDate() + week * 7 + day);

        const filled = date <= end;
        const dateKey = date.toISOString().slice(0, 10);
        const liveDay = liveByDate.get(dateKey);
        const level = liveDay?.level ?? 0;
        const count = liveDay?.count ?? 0;
        if (filled) total += count;

        if (day === 0) {
          const month = date.getMonth();
          if (month !== lastMonth) {
            monthLabels.push({ column: week, label: MONTHS[month] });
            lastMonth = month;
          }
        }

        column.push({
          key: dateKey,
          level,
          count,
          filled,
          label: filled
            ? `${count} contribution${count === 1 ? '' : 's'} on ${date.toDateString()}`
            : 'Upcoming day',
        });
      }

      columns.push(column);
    }

    return { columns, monthLabels, total };
  }, [liveDays, weeks]);
}

type HeatmapData = ReturnType<typeof useHeatmap>;

function Heatmap({ data }: { data: HeatmapData }) {
  const { columns, monthLabels, total } = data;
  const cyan = accentHex.cyan;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-[0.95rem] font-semibold tracking-[0.06em] text-paper uppercase sm:text-[1.05rem]">
            {activityCopy.heatmapTitle}
          </h3>
          <p className="mt-1 text-[0.75rem] text-faint">
            {total.toLocaleString()} contributions across {githubActivity.weeks} weeks
          </p>
        </div>

        {githubActivity.placeholder && (
          <span
            title="Deterministic sample pattern — connect a real source to show live data"
            className="rounded-full border border-dashed border-white/15 px-2.5 py-0.5 font-display text-[0.5rem] font-semibold tracking-[0.2em] text-faint uppercase"
          >
            Sample data
          </span>
        )}
      </div>

      {/* Scrollable grid — never forces the page to scroll sideways */}
      <div className="scrollbar-none mt-5 -mx-1 overflow-x-auto px-1 pb-1">
        <div className="inline-flex min-w-full flex-col gap-1.5">
          {/* Month ruler */}
          <div className="ml-[1.75rem] flex gap-[3px]">
            {columns.map((_, columnIndex) => {
              const label = monthLabels.find((month) => month.column === columnIndex);
              return (
                <span
                  key={`month-${columnIndex}`}
                  className="relative w-[11px] shrink-0 font-display text-[0.5rem] font-semibold tracking-[0.1em] text-faint uppercase"
                >
                  {label && <span className="absolute -top-0.5 left-0 whitespace-nowrap">{label.label}</span>}
                </span>
              );
            })}
          </div>

          <div className="flex gap-[3px]">
            {/* Weekday ruler */}
            <div className="mr-1 flex w-[1.5rem] shrink-0 flex-col gap-[3px]">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <span
                  key={`${day}-${index}`}
                  className="h-[11px] font-display text-[0.5rem] leading-[11px] text-faint"
                >
                  {index % 2 === 1 ? day : ''}
                </span>
              ))}
            </div>

            {/* Weeks */}
            {columns.map((column, columnIndex) => (
              <div key={`week-${columnIndex}`} className="flex shrink-0 flex-col gap-[3px]">
                {column.map((cell) => (
                  <span
                    key={cell.key}
                    title={cell.label}
                    className={cn(
                      'size-[11px] rounded-[2px] transition-transform duration-200 hover:scale-[1.35]',
                      !cell.filled && 'opacity-25',
                    )}
                    style={{
                      backgroundColor: withAlpha(cyan, LEVEL_ALPHA[cell.level]),
                      boxShadow: cell.level >= 3 ? `0 0 8px ${withAlpha(cyan, 0.45)}` : undefined,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <span className="font-display text-[0.55rem] tracking-[0.14em] text-faint uppercase">Less</span>
        {LEVEL_ALPHA.map((alpha, index) => (
          <span
            key={index}
            className="size-[10px] rounded-[2px]"
            style={{ backgroundColor: withAlpha(cyan, alpha) }}
          />
        ))}
        <span className="font-display text-[0.55rem] tracking-[0.14em] text-faint uppercase">More</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Totals                                                                    */
/* -------------------------------------------------------------------------- */

function TotalTile({
  total,
  index,
  valueOverride,
}: {
  total: (typeof githubActivity.totals)[number];
  index: number;
  /** Used for the "Contributions" tile so it always matches the heatmap sum. */
  valueOverride?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReduced = useReducedMotion();
  const value = useCountUp(valueOverride ?? total.value, inView, 1600);
  const tone = accentMap[total.accent];

  return (
    <motion.div
      ref={ref}
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="glass-well flex items-center gap-3 rounded-xl p-3.5"
    >
      <span className={cn('inline-flex size-9 shrink-0 items-center justify-center rounded-lg border', tone.chip)}>
        <Icon name={total.icon} className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-[1.05rem] leading-none font-bold text-paper tabular-nums">
          {value.toLocaleString()}
          {total.suffix ?? ''}
        </p>
        <p className="mt-1 truncate font-display text-[0.55rem] font-semibold tracking-[0.18em] text-faint uppercase">
          {total.label}
        </p>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export function CodingActivity() {
  const { push } = useToast();
  const heatmap = useHeatmap(githubActivity.weeks, liveStats.github.contributions);
  const notifyUnavailable = (hint: string) =>
    push({ title: 'Profile not linked', description: hint, variant: 'info' });

  return (
    <Section id="activity" labelledBy="activity-heading">
      <SectionHeading
        id="activity-heading"
        eyebrow="Consistency"
        title={activityCopy.heading}
        subtitle={activityCopy.subheading}
      />

      {/* Platforms */}
      <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {platforms.map((platform, index) => (
          <li key={platform.id} className="h-full">
            <PlatformCard platform={platform} index={index} onUnavailable={notifyUnavailable} />
          </li>
        ))}
      </ul>

      <p className="mt-3 text-right text-[0.62rem] leading-relaxed text-faint">
        Auto-synced from public profiles • Last checked {new Date(liveStats.updatedAt).toLocaleString('en-IN')} • HackerRank percentile is a rounded whole-percent estimate.
      </p>

      {/* Heatmap + totals */}
      <Reveal delay={0.1} className="mt-6">
        <GlassCard variant="panel" radiusClass="rounded-3xl">
          <div className="p-5 sm:p-7">
            {githubActivity.weeks > 0 ? (
              <Heatmap data={heatmap} />
            ) : (
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="font-display text-[0.95rem] font-semibold tracking-[0.06em] text-paper uppercase sm:text-[1.05rem]">
                    {activityCopy.heatmapTitle}
                  </h3>
                  <p className="mt-1 max-w-2xl text-[0.75rem] leading-relaxed text-faint">
                    Public profile totals verified from GitHub. Visit the profile for the live contribution graph and latest repositories.
                  </p>
                </div>
                <a
                  href="https://github.com/sudesh4545"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-[0.62rem] font-semibold tracking-[0.14em] text-brand-cyan uppercase hover:text-paper"
                >
                  View live GitHub ↗
                </a>
              </div>
            )}

            <ul className="mt-7 grid grid-cols-1 gap-3 xs:grid-cols-2 lg:grid-cols-4">
              {githubActivity.totals.map((total, index) => (
                <li key={total.id}>
                  <TotalTile
                    total={total}
                    index={index}
                    // Keep the tile and the grid above telling the same story.
                    valueOverride={undefined}
                  />
                </li>
              ))}
            </ul>

            {githubActivity.placeholder && (
              <p className="mt-6 flex items-start gap-2 rounded-xl border border-dashed border-white/12 bg-white/[0.02] p-3.5 text-[0.72rem] leading-relaxed text-faint">
                <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-brand-cyan/70" />
                <span>
                  This heatmap is a deterministic sample generated from{' '}
                  <code className="text-brand-cyan/80">githubActivity.seed</code>. To show real numbers, edit{' '}
                  <code className="text-brand-cyan/80">src/data/portfolio.ts</code>, or fetch them from a small
                  server-side route — never call an API with a token from the browser, since anything shipped to
                  the client is public.
                </span>
              </p>
            )}
          </div>
        </GlassCard>
      </Reveal>
    </Section>
  );
}
