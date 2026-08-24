import type { ComponentType, ReactNode } from 'react';
import {
  Activity,
  Award,
  Binary,
  Boxes,
  Braces,
  Code,
  Compass,
  Cpu,
  Database,
  Flame,
  FolderGit2,
  GitBranch,
  GitPullRequest,
  Globe,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  MessagesSquare,
  Network,
  Puzzle,
  Server,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Terminal,
  Trophy,
  Workflow,
  Zap,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { IconKey } from '../types';

export type IconComponent = ComponentType<LucideProps>;

/**
 * Shared shell so the two hand-drawn brand marks below are pixel-consistent
 * with the lucide set (24px grid, 2px round strokes, currentColor).
 * lucide v1 removed brand icons, so GitHub + LinkedIn are drawn here.
 */
function StrokeMark({
  size = 24,
  strokeWidth = 2,
  absoluteStrokeWidth,
  children,
  ...rest
}: LucideProps & { children: ReactNode }) {
  const width = absoluteStrokeWidth ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

function GithubMark(props: LucideProps) {
  return (
    <StrokeMark {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 4.44-2.24 4.44-5.48a4.25 4.25 0 0 0-1.18-2.94 3.95 3.95 0 0 0-.09-3.05s-1.25-.37-4.1 1.55a9.6 9.6 0 0 0-5.06 0C6.22 2.7 4.97 3.07 4.97 3.07a3.95 3.95 0 0 0-.09 3.05A4.25 4.25 0 0 0 3.7 9.06c0 3.22 1.3 5.11 4.44 5.46a3.37 3.37 0 0 0-.94 2.58V21" />
    </StrokeMark>
  );
}

function LinkedinMark(props: LucideProps) {
  return (
    <StrokeMark {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" rx="1" />
      <circle cx="4" cy="4" r="2" />
    </StrokeMark>
  );
}

/** Every icon the content layer is allowed to reference, keyed by `IconKey`. */
export const icons: Record<IconKey, IconComponent> = {
  activity: Activity,
  award: Award,
  binary: Binary,
  boxes: Boxes,
  braces: Braces,
  code: Code,
  compass: Compass,
  cpu: Cpu,
  database: Database,
  flame: Flame,
  folderGit: FolderGit2,
  github: GithubMark,
  gitBranch: GitBranch,
  gitPullRequest: GitPullRequest,
  globe: Globe,
  graduationCap: GraduationCap,
  layers: Layers,
  linkedin: LinkedinMark,
  mail: Mail,
  mapPin: MapPin,
  messages: MessagesSquare,
  network: Network,
  puzzle: Puzzle,
  server: Server,
  shieldCheck: ShieldCheck,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  terminal: Terminal,
  trophy: Trophy,
  workflow: Workflow,
  zap: Zap,
};

/** Renders an icon by data-file key. Decorative by default. */
export function Icon({ name, ...rest }: { name: IconKey } & LucideProps) {
  const Component = icons[name];
  return <Component aria-hidden="true" {...rest} />;
}
