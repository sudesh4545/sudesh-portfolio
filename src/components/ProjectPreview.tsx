import type { ReactElement, ReactNode } from 'react';
import { cn } from '../lib/cn';
import type { PreviewKey } from '../types';

/* ---------------------------------------------------------------------------
 * Built-in project previews. Each is a hand-built UI mock — no screenshots
 * required — so the cards look finished before you add real images.
 * They are purely decorative: `aria-hidden` on the wrapper keeps the fake
 * interface text out of the accessibility tree.
 * ------------------------------------------------------------------------- */

function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className={cn('absolute inset-0 flex flex-col', className)}>
      {children}
    </div>
  );
}

/** Window chrome: three dots + a caption. */
function TitleBar({ label, dotClass }: { label: string; dotClass: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
      <span className="flex gap-1">
        <span className="size-1.5 rounded-full bg-white/25" />
        <span className="size-1.5 rounded-full bg-white/15" />
        <span className={cn('size-1.5 rounded-full', dotClass)} />
      </span>
      <span className="font-display text-[0.5rem] font-semibold tracking-[0.18em] text-faint uppercase">
        {label}
      </span>
    </div>
  );
}

function ChatPreview() {
  const messages = [
    { side: 'in', w: 'w-[58%]' },
    { side: 'out', w: 'w-[46%]' },
    { side: 'in', w: 'w-[40%]' },
    { side: 'out', w: 'w-[62%]' },
  ] as const;

  return (
    <Shell>
      <TitleBar label="secure chat" dotClass="bg-brand-cyan/70" />

      <div className="flex min-h-0 flex-1">
        {/* Conversation rail */}
        <div className="hidden w-[26%] flex-col gap-1.5 border-r border-white/[0.06] p-2 xs:flex">
          {[0, 1, 2, 3].map((row) => (
            <div
              key={row}
              className={cn(
                'flex items-center gap-1.5 rounded-md p-1',
                row === 0 && 'bg-brand-cyan/10 ring-1 ring-brand-cyan/25',
              )}
            >
              <span className="size-3.5 shrink-0 rounded-full bg-gradient-to-br from-brand-cyan/60 to-brand-purple/60" />
              <span className="h-1 flex-1 rounded-full bg-white/15" />
            </div>
          ))}
        </div>

        {/* Thread */}
        <div className="flex min-w-0 flex-1 flex-col justify-end gap-1.5 p-2.5">
          {messages.map((message, index) => (
            <div key={index} className={cn('flex', message.side === 'out' && 'justify-end')}>
              <span
                className={cn(
                  'flex h-4 flex-col justify-center gap-1 rounded-lg px-1.5',
                  message.w,
                  message.side === 'out'
                    ? 'bg-gradient-to-r from-brand-cyan/35 to-brand-purple/30'
                    : 'bg-white/[0.07]',
                )}
              >
                <span className="h-[2px] w-full rounded-full bg-white/25" />
                <span className="h-[2px] w-2/3 rounded-full bg-white/15" />
              </span>
            </div>
          ))}

          {/* Typing indicator */}
          <div className="mt-0.5 flex items-center gap-1">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="anim-blink size-1 rounded-full bg-brand-cyan/80"
                style={{ animationDelay: `${dot * 0.22}s` }}
              />
            ))}
          </div>

          {/* Composer */}
          <div className="mt-1 flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-1">
            <span className="h-1 flex-1 rounded-full bg-white/12" />
            <span className="size-3 rounded-full bg-brand-cyan/70" />
          </div>
        </div>
      </div>
    </Shell>
  );
}

function DistributedPreview() {
  return (
    <Shell>
      <TitleBar label="cluster topology" dotClass="bg-brand-purple/80" />

      <div className="relative min-h-0 flex-1">
        <svg viewBox="0 0 300 150" className="size-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="dfs-link" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8A2BE2" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* Master → chunk links */}
          <g stroke="url(#dfs-link)" strokeWidth="1.1" fill="none">
            <path d="M150 46V70H62v18" />
            <path d="M150 46V70h0v18" />
            <path d="M150 46V70h88v18" />
          </g>

          {/* Replication ring between chunk servers */}
          <path
            d="M62 122h176"
            stroke="#00F0FF"
            strokeOpacity="0.3"
            strokeWidth="1"
            strokeDasharray="4 6"
            fill="none"
          />

          {/* Master */}
          <g>
            <rect
              x="112"
              y="22"
              width="76"
              height="24"
              rx="6"
              fill="rgba(138,43,226,0.16)"
              stroke="#8A2BE2"
              strokeOpacity="0.6"
            />
            <text
              x="150"
              y="37"
              textAnchor="middle"
              fill="#d8b4fe"
              fontSize="8"
              fontFamily="var(--font-display)"
              letterSpacing="1.4"
            >
              MASTER
            </text>
          </g>

          {/* Chunk servers */}
          {[62, 150, 238].map((cx, index) => (
            <g key={cx}>
              <rect
                x={cx - 30}
                y="88"
                width="60"
                height="34"
                rx="6"
                fill="rgba(0,240,255,0.1)"
                stroke="#00F0FF"
                strokeOpacity="0.45"
              />
              <text
                x={cx}
                y="102"
                textAnchor="middle"
                fill="#7DF9FF"
                fontSize="7"
                fontFamily="var(--font-display)"
                letterSpacing="1"
              >
                CHUNK {index + 1}
              </text>
              {/* Replica blocks */}
              <g fill="#00F0FF" fillOpacity={index === 1 ? 0.75 : 0.5}>
                <rect x={cx - 20} y="108" width="10" height="6" rx="1.5" />
                <rect x={cx - 6} y="108" width="10" height="6" rx="1.5" />
                <rect x={cx + 8} y="108" width="10" height="6" rx="1.5" />
              </g>
              {/* Heartbeat */}
              <circle cx={cx + 24} cy="93" r="2" fill="#34d399" className="anim-blink" />
            </g>
          ))}
        </svg>
      </div>
    </Shell>
  );
}

function ShopPreview() {
  return (
    <Shell>
      <TitleBar label="storefront" dotClass="bg-brand-magenta/80" />

      <div className="flex min-h-0 flex-1 flex-col gap-2 p-2.5">
        {/* Search + cart */}
        <div className="flex items-center gap-1.5">
          <span className="flex h-4 flex-1 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2">
            <span className="size-1.5 rounded-full border border-white/25" />
            <span className="h-1 w-1/3 rounded-full bg-white/12" />
          </span>
          <span className="relative inline-flex size-4 items-center justify-center rounded-md bg-brand-magenta/20 ring-1 ring-brand-magenta/40">
            <span className="size-1.5 rounded-[2px] bg-[#e879f9]" />
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-[#e879f9] text-[0.35rem] leading-none" />
          </span>
        </div>

        {/* Product grid */}
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((tile) => (
            <div
              key={tile}
              className={cn(
                'flex flex-col gap-1 rounded-md border border-white/[0.07] bg-white/[0.025] p-1',
                tile === 1 && 'border-brand-magenta/35 bg-brand-magenta/10',
              )}
            >
              <span
                className={cn(
                  'flex-1 rounded-[3px] bg-gradient-to-br',
                  tile % 3 === 0
                    ? 'from-brand-cyan/25 to-brand-blue/15'
                    : tile % 3 === 1
                      ? 'from-brand-magenta/25 to-brand-purple/15'
                      : 'from-brand-purple/25 to-brand-cyan/12',
                )}
              />
              <span className="h-1 w-3/4 rounded-full bg-white/18" />
              <span className="h-1 w-1/3 rounded-full bg-brand-cyan/45" />
            </div>
          ))}
        </div>

        {/* Checkout bar */}
        <div className="flex items-center justify-between rounded-md border border-white/[0.07] bg-white/[0.02] px-2 py-1">
          <span className="h-1 w-10 rounded-full bg-white/15" />
          <span className="rounded-full bg-gradient-to-r from-brand-magenta/70 to-brand-purple/70 px-3 py-[3px] font-display text-[0.42rem] font-bold tracking-[0.16em] text-white uppercase">
            Checkout
          </span>
        </div>
      </div>
    </Shell>
  );
}

const previews: Record<PreviewKey, () => ReactElement> = {
  chat: ChatPreview,
  distributed: DistributedPreview,
  shop: ShopPreview,
};

export function ProjectPreview({ kind }: { kind: PreviewKey }) {
  const Preview = previews[kind];
  return <Preview />;
}
