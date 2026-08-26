import { useReducedMotion } from 'framer-motion';
import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { cn } from '../lib/cn';
import '../styles/neural-brain.css';

interface NeuralBrainProps {
  className?: string;
  /** Path to the transparent brain artwork, relative to `public/`. */
  src?: string;
  /**
   * Accessible description. The brain is decorative next to the hero copy, so
   * this is exposed as a label on the figure rather than as image alt text.
   */
  label?: string;
}

const PARTICLE_COLORS = ['#45e6ff', '#68baff', '#a47aff', '#3de3dc'] as const;
const DEFAULT_BRAIN_SRC = `${import.meta.env.BASE_URL}neural-brain-v2.png`;
const PARTICLE_COUNT = 8;
const CIRCUIT_RAYS = Array.from({ length: 14 }, (_, index) => ({
  key: index,
  style: {
    '--nb-ray-angle': `${index * (360 / 14) + (index % 2) * 5}deg`,
    '--nb-ray-delay': `${-index * 0.34}s`,
    '--nb-ray-length': `${43 + (index % 4) * 5}%`,
  } as CSSProperties,
}));
const DATA_STREAMS = [17, 31, 45, 59, 73, 86].map((left, index) => ({
  key: left,
  style: {
    '--nb-stream-x': `${left}%`,
    '--nb-stream-delay': `${-index * 0.7}s`,
  } as CSSProperties,
}));

/**
 * Deterministic particle placement — a seeded pattern rather than
 * `Math.random()`, so the layout is identical on every render and never
 * shifts between reloads.
 */
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
  const seed = index + 1;
  return {
    key: index,
    style: {
      '--nb-particle-x': `${10 + ((seed * 37) % 80)}%`,
      '--nb-particle-y': `${12 + ((seed * 53) % 72)}%`,
      '--nb-particle-size': `${2 + (seed % 3)}px`,
      '--nb-particle-color': PARTICLE_COLORS[index % PARTICLE_COLORS.length],
      '--nb-particle-duration': `${2.5 + (seed % 5) * 0.55}s`,
      '--nb-particle-delay': `${-1 * (seed % 8) * 0.35}s`,
    } as CSSProperties,
  };
});

/**
 * The hero's holographic brain: a transparent PNG lit by layered cyan/violet
 * glow, holographic rings, a perspective crosshair and a floating platform.
 *
 * The `</>`, API, DATA and DEV badges and the 01–04 capability cards are NOT
 * rendered here — the Hero owns those, driven by `src/data/portfolio.ts`.
 */
export function NeuralBrain({
  className,
  src = DEFAULT_BRAIN_SRC,
  label = 'Holographic neural-network brain representing software engineering skills',
}: NeuralBrainProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();
  const [failed, setFailed] = useState(false);

  /** Subtle parallax tilt. Skipped for touch input and reduced motion. */
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const stage = stageRef.current;
    if (!stage || prefersReduced || event.pointerType !== 'mouse') return;

    const box = stage.getBoundingClientRect();
    const relativeX = (event.clientX - box.left) / box.width - 0.5;
    const relativeY = (event.clientY - box.top) / box.height - 0.5;

    stage.dataset.pointerActive = 'true';
    stage.style.setProperty('--nb-tilt-x', `${relativeY * -6}deg`);
    stage.style.setProperty('--nb-tilt-y', `${relativeX * 8}deg`);
  }

  function handlePointerLeave() {
    const stage = stageRef.current;
    if (!stage) return;

    stage.dataset.pointerActive = 'false';
    stage.style.removeProperty('--nb-tilt-x');
    stage.style.removeProperty('--nb-tilt-y');
  }

  return (
    <figure
      role="img"
      aria-label={label}
      className={cn('nb-stage relative m-0', className)}
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div aria-hidden="true" className="nb-circuit-field">
        {CIRCUIT_RAYS.map((ray) => (
          <i key={ray.key} className="nb-ray" style={ray.style} />
        ))}
        {DATA_STREAMS.map((stream) => (
          <i key={stream.key} className="nb-data-stream" style={stream.style} />
        ))}
      </div>

      {!prefersReduced && (
        <>
          <div aria-hidden="true" className="nb-particles">
            {PARTICLES.map((particle) => (
              <i key={particle.key} className="nb-particle" style={particle.style} />
            ))}
          </div>
          <div aria-hidden="true" className="nb-scan" />
        </>
      )}

      <img
        className="nb-brain"
        src={src}
        alt=""
        // The hero column stays near 400 CSS px; 640px is crisp on common
        // displays without making the largest-paint asset unnecessarily heavy.
        width={800}
        height={533}
        // The hero image is the page's largest paint — load it eagerly.
        loading="eager"
        fetchPriority="high"
        decoding="async"
        draggable={false}
        data-failed={failed ? 'true' : undefined}
        onError={() => setFailed(true)}
      />

      <div aria-hidden="true" className="nb-base" />
    </figure>
  );
}
