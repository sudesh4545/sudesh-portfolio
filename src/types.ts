/**
 * Shared types for the portfolio.
 * All content lives in `src/data/portfolio.ts` and is typed against these.
 */

/** Every scrollable section on the page. Used for nav links + scroll spy. */
export type SectionId =
  | 'home'
  | 'about'
  | 'skills'
  | 'expertise'
  | 'projects'
  | 'achievements'
  | 'activity'
  | 'contact';

/** The four accents of the design system. Components map these to real colours. */
export type Accent = 'cyan' | 'purple' | 'magenta' | 'blue';

/** Keys of the Lucide icons registered in `src/components/Icon.tsx`. */
export type IconKey =
  | 'activity'
  | 'award'
  | 'binary'
  | 'boxes'
  | 'braces'
  | 'code'
  | 'compass'
  | 'cpu'
  | 'database'
  | 'flame'
  | 'folderGit'
  | 'github'
  | 'gitBranch'
  | 'gitPullRequest'
  | 'globe'
  | 'graduationCap'
  | 'layers'
  | 'linkedin'
  | 'mail'
  | 'mapPin'
  | 'messages'
  | 'network'
  | 'puzzle'
  | 'server'
  | 'shieldCheck'
  | 'sparkles'
  | 'star'
  | 'target'
  | 'terminal'
  | 'trophy'
  | 'workflow'
  | 'zap';

/** Keys of the hand-drawn technology marks in `src/components/TechIcon.tsx`. */
export type TechKey =
  | 'cpp'
  | 'java'
  | 'python'
  | 'javascript'
  | 'react'
  | 'node'
  | 'sql'
  | 'git'
  | 'docker';

/** Which built-in UI mock a project card renders as its preview. */
export type PreviewKey = 'chat' | 'distributed' | 'shop';

export interface NavLink {
  id: SectionId;
  label: string;
}

export interface SocialLink {
  id: 'github' | 'linkedin' | 'email' | 'discord';
  label: string;
  /** `null` = not configured yet. The UI degrades gracefully instead of linking nowhere. */
  url: string | null;
  handle: string;
  icon: IconKey;
}

export interface PersonalInfo {
  name: string;
  greeting: string;
  roles: string[];
  tagline: string;
  bio: string;
  degree: string;
  degreeShort: string;
  field: string;
  university: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  /** Path to a PDF inside `public/`. `null` disables the button gracefully. */
  resumeUrl: string | null;
  /** Path to an image inside `public/`. `null` renders the silhouette avatar. */
  profileImage: string | null;
}

export interface HeroCard {
  id: string;
  index: string;
  lines: [string, string];
  icon: IconKey;
  accent: Accent;
}

export interface AboutHighlight {
  id: string;
  label: string;
  /** One or two lines of value text. */
  lines: string[];
  icon: IconKey;
  accent: Accent;
}

export interface Skill {
  name: string;
  category: string;
  /** 0–100. Drives the animated progress bar. */
  level: number;
  tech: TechKey;
  accent: Accent;
}

export interface ExpertiseItem {
  id: string;
  lines: [string, string];
  icon: IconKey;
  accent: Accent;
}

export interface Project {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  /** Longer copy shown in the detail modal. Falls back to `description`. */
  longDescription?: string;
  /** Built-in component preview used when no `image` is supplied. */
  preview: PreviewKey;
  /** Local image path (e.g. `/projects/chat.png`). Lazy-loaded when present. */
  image: string | null;
  technologies: string[];
  features: string[];
  /** `null` = no live demo yet; the button is disabled instead of faked. */
  demoUrl: string | null;
  /** `null` = repo not published yet; the button is disabled instead of faked. */
  githubUrl: string | null;
  accent: Accent;
}

export interface Stat {
  id: string;
  /** Numeric target for the count-up animation. `null` = show `display` as-is. */
  value: number | null;
  display?: string;
  prefix?: string;
  suffix?: string;
  label: string;
  caption: string;
  icon: IconKey;
  accent: Accent;
  /** Marks sample data so the UI can label it honestly. */
  placeholder: boolean;
}

export interface PlatformStat {
  label: string;
  value: string;
}

export interface CodingPlatform {
  id: string;
  name: string;
  handle: string;
  url: string | null;
  icon: IconKey;
  accent: Accent;
  rank: string;
  stats: PlatformStat[];
  /** 0–100 values driving the mini chart. */
  trend: number[];
  placeholder: boolean;
}

export interface GitHubActivity {
  /** Seed for the deterministic sample heatmap. */
  seed: number;
  weeks: number;
  totals: { id: string; label: string; value: number; suffix?: string; icon: IconKey; accent: Accent }[];
  placeholder: boolean;
}

export interface Badge {
  id: string;
  lines: [string, string];
  caption: string;
  /** Verified certificate, project, or achievement destination. */
  url: string;
  icon: IconKey;
  accent: Accent;
  placeholder: boolean;
}

export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href: string | null;
  icon: IconKey;
  accent: Accent;
}
