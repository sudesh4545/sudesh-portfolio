import type { ComponentType } from 'react';
import type { TechKey } from '../types';

export interface TechIconProps {
  size?: number;
  className?: string;
}

/**
 * Hand-drawn technology marks in their real brand colours.
 * Kept as inline SVG (no icon-font, no network request) and simplified to stay
 * legible at 24–32px, which is the only size the skill tiles use.
 */

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 32 32',
  'aria-hidden': true as const,
};

const label = {
  fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif",
  fontWeight: 700,
  textAnchor: 'middle' as const,
};

function Cpp({ size = 28, className }: TechIconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <path d="M16 2.6 28 9.3v13.4L16 29.4 4 22.7V9.3z" fill="#00599C" />
      <path d="M16 2.6 28 9.3v13.4L16 29.4 4 22.7V9.3z" fill="none" stroke="#5ba6dc" strokeOpacity=".5" />
      <text {...label} x="13.2" y="20.4" fontSize="11" fill="#ffffff">
        C
      </text>
      <g stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round">
        <path d="M19.4 16h3M20.9 14.5v3M24.4 16h3M25.9 14.5v3" />
      </g>
    </svg>
  );
}

function Java({ size = 28, className }: TechIconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      {/* steam */}
      <g fill="none" stroke="#EA2D2E" strokeWidth="1.6" strokeLinecap="round">
        <path d="M14 10.5c-2.4-1.8.6-3 -.2-5" />
        <path d="M18 10.6c-2.4-1.8.6-3.1-.2-5.1" />
      </g>
      {/* cup */}
      <path d="M9.5 13h12v5.5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5z" fill="#5382A1" />
      <path d="M21.8 14.2h1.4a2.9 2.9 0 0 1 0 5.8h-.9" fill="none" stroke="#5382A1" strokeWidth="1.7" />
      {/* saucer */}
      <path d="M8 26.2c3 1.4 12.4 1.4 15.6 0" fill="none" stroke="#EA2D2E" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Python({ size = 28, className }: TechIconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <path
        d="M15.9 3c-2.9 0-5.2.6-5.2 3.1v3.2h6.6v1.5H8.1C5.5 10.8 3.4 12.9 3.4 15.5s2.1 4.8 4.7 4.8h1.6v-3.4c0-2.4 2-4.4 4.4-4.4h4.7c1.9 0 3.4-1.5 3.4-3.4V6.1C22.2 3.6 18.8 3 15.9 3z"
        fill="#3776AB"
      />
      <circle cx="13.1" cy="6.5" r="1.15" fill="#ffffff" />
      <path
        d="M16.1 29c2.9 0 5.2-.6 5.2-3.1v-3.2h-6.6v-1.5h9.2c2.6 0 4.7-2.1 4.7-4.7s-2.1-4.8-4.7-4.8h-1.6v3.4c0 2.4-2 4.4-4.4 4.4h-4.7c-1.9 0-3.4 1.5-3.4 3.4v3c0 2.5 3.4 3.1 6.3 3.1z"
        fill="#FFD343"
      />
      <circle cx="18.9" cy="25.5" r="1.15" fill="#ffffff" />
    </svg>
  );
}

function JavaScript({ size = 28, className }: TechIconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <rect x="2.5" y="2.5" width="27" height="27" rx="6" fill="#F7DF1E" />
      <text {...label} x="16.5" y="22.5" fontSize="13" fill="#0B1013">
        JS
      </text>
    </svg>
  );
}

function React_({ size = 28, className }: TechIconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <g fill="none" stroke="#61DAFB" strokeWidth="1.5">
        <ellipse cx="16" cy="16" rx="12.5" ry="4.8" />
        <ellipse cx="16" cy="16" rx="12.5" ry="4.8" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="12.5" ry="4.8" transform="rotate(120 16 16)" />
      </g>
      <circle cx="16" cy="16" r="2.6" fill="#61DAFB" />
    </svg>
  );
}

function Node({ size = 28, className }: TechIconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <path d="M16 2.6 28 9.3v13.4L16 29.4 4 22.7V9.3z" fill="#3C873A" fillOpacity=".22" />
      <path d="M16 2.6 28 9.3v13.4L16 29.4 4 22.7V9.3z" fill="none" stroke="#68A063" strokeWidth="1.6" />
      <text {...label} x="16" y="21" fontSize="11.5" fill="#8CC84B">
        JS
      </text>
    </svg>
  );
}

function Sql({ size = 28, className }: TechIconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <ellipse cx="16" cy="8" rx="10" ry="4" fill="#22D3EE" fillOpacity=".85" />
      <path d="M6 8v7c0 2.2 4.5 4 10 4s10-1.8 10-4V8" fill="#0E7490" fillOpacity=".55" />
      <path d="M6 15v7c0 2.2 4.5 4 10 4s10-1.8 10-4v-7" fill="#155E75" fillOpacity=".55" />
      <g fill="none" stroke="#67E8F9" strokeWidth="1.5">
        <ellipse cx="16" cy="8" rx="10" ry="4" />
        <path d="M6 8v14c0 2.2 4.5 4 10 4s10-1.8 10-4V8" />
        <path d="M6 15c0 2.2 4.5 4 10 4s10-1.8 10-4" />
      </g>
    </svg>
  );
}

function Git({ size = 28, className }: TechIconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <rect x="16" y="1.6" width="20.4" height="20.4" rx="3" transform="rotate(45 16 1.6)" fill="#F05032" fillOpacity=".18" />
      <rect
        x="16"
        y="1.6"
        width="20.4"
        height="20.4"
        rx="3"
        transform="rotate(45 16 1.6)"
        fill="none"
        stroke="#F05032"
        strokeWidth="1.6"
      />
      <g stroke="#F05032" strokeWidth="1.8" strokeLinecap="round" fill="none">
        <path d="M12.4 19.6V12" />
        <path d="M12.4 15.4c0-2 1.4-2.6 3.2-2.6h2" />
      </g>
      <g fill="#F05032">
        <circle cx="12.4" cy="20.6" r="2.1" />
        <circle cx="12.4" cy="11.2" r="2.1" />
        <circle cx="18.6" cy="12.8" r="2.1" />
      </g>
    </svg>
  );
}

function Docker({ size = 28, className }: TechIconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <g fill="#2496ED">
        <rect x="7" y="13.4" width="3.6" height="3.4" rx=".5" />
        <rect x="11.4" y="13.4" width="3.6" height="3.4" rx=".5" />
        <rect x="15.8" y="13.4" width="3.6" height="3.4" rx=".5" />
        <rect x="11.4" y="9.4" width="3.6" height="3.4" rx=".5" fillOpacity=".75" />
        <rect x="15.8" y="9.4" width="3.6" height="3.4" rx=".5" fillOpacity=".75" />
        <rect x="15.8" y="5.4" width="3.6" height="3.4" rx=".5" fillOpacity=".5" />
      </g>
      <path
        d="M2.6 18.4h24.1c.2 2-.6 3.9-2.2 5.3-1.9 1.7-4.8 2.6-8.6 2.6-4.6 0-8.2-1.3-10.5-3.8a10 10 0 0 1-2.8-4.1z"
        fill="#2496ED"
      />
      <path
        d="M26.2 16.1c.9-.7 1.9-.9 3-.7-.2-1-.8-1.9-1.8-2.6 -1 .9-1.4 2.1-1.2 3.3z"
        fill="#2496ED"
        fillOpacity=".8"
      />
    </svg>
  );
}

export const techIcons: Record<TechKey, ComponentType<TechIconProps>> = {
  cpp: Cpp,
  java: Java,
  python: Python,
  javascript: JavaScript,
  react: React_,
  node: Node,
  sql: Sql,
  git: Git,
  docker: Docker,
};

export function TechIcon({ name, ...rest }: { name: TechKey } & TechIconProps) {
  const Component = techIcons[name];
  return <Component {...rest} />;
}
