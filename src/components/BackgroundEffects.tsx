/**
 * The global background: radial glows, drifting aurora, a masked cyber-grid and
 * a canvas particle network with thin connection lines.
 *
 * Deliberately low contrast so text always stays readable, and cheap to run:
 * one canvas, ~25–60 particles scaled to viewport area, transform-only CSS
 * animations, paused when the tab is hidden, and fully static when the visitor
 * prefers reduced motion.
 */
export function BackgroundEffects() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink"
    >
      {/* Deep base wash */}
      <div className="theme-background-base absolute inset-0" />

      <div className="theme-aurora theme-aurora-cyan absolute -top-40 -left-44 size-[32rem] rounded-full bg-brand-cyan/6 blur-[90px]" />
      <div className="theme-aurora theme-aurora-pink absolute top-[28%] -right-48 size-[34rem] rounded-full bg-brand-magenta/7 blur-[100px]" />

      {/* Aurora blobs — big soft washes. Radii kept moderate: over near-black
          a 100px blur reads the same as 150px but paints a far smaller layer. */}
      {/* Cyber grid, faded out towards the edges */}
      <div
        className="cyber-grid absolute inset-0 opacity-40"
        style={{
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, #000 20%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, #000 20%, transparent 85%)',
        }}
      />

      {/* Faint circuit traces */}
      <svg className="circuit-drift absolute inset-0 size-full opacity-[0.2]" preserveAspectRatio="none" viewBox="0 0 1440 900">
        <g fill="none" stroke="url(#trace)" strokeWidth="1">
          <path d="M-20 140h300l60 60h240l50-50h420l70 70h340" />
          <path d="M-20 470h180l70-70h260l60 60h180l80 80h280l60-60h300" />
          <path d="M-20 760h240l80-80h300l60 60h220l70-70h420" />
          <path d="M180 -20v120l60 60v180" />
          <path d="M980 -20v90l-70 70v220" />
          <path d="M1240 920V760l60-60V420" />
        </g>
        <defs>
          <linearGradient id="trace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--trace-start)" stopOpacity="0.95" />
            <stop offset="52%" stopColor="var(--trace-mid)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--trace-end)" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>

      {/* Grain + vignette keep large dark areas from banding. Plain overlay —
          no blend mode, which would force a full-screen composite every frame. */}
      <div className="noise absolute inset-0 opacity-[0.035]" />
      <div className="theme-vignette absolute inset-0" />
    </div>
  );
}
