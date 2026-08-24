/**
 * ============================================================================
 *  PORTFOLIO CONTENT — EDIT THIS FILE ONLY
 * ============================================================================
 *  Everything the visitor reads lives here. No UI component hardcodes content,
 *  so you can rebrand the whole site from this one file.
 *
 *  PLACEHOLDERS to replace before publishing:
 *    [YOUR UNIVERSITY]  [YOUR EMAIL]
 *    [YOUR GITHUB]  [YOUR LINKEDIN]  [YOUR RESUME]  [YOUR PROFILE IMAGE]
 *
 *  Anything marked `placeholder: true` is SAMPLE DATA. The UI labels it as such
 *  so the site never claims achievements you have not earned. Set the real
 *  numbers and flip the flag to `false`.
 *
 *  Links use `null` when unset — buttons then render disabled instead of
 *  pointing at a fake URL.
 * ============================================================================
 */

import type {
  AboutHighlight,
  Badge,
  CodingPlatform,
  ContactChannel,
  ExpertiseItem,
  GitHubActivity,
  HeroCard,
  NavLink,
  PersonalInfo,
  Project,
  Skill,
  SocialLink,
  Stat,
} from '../types';
import liveStats from './live-stats.json';

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

/* -------------------------------------------------------------------------- */
/*  1. PERSONAL                                                               */
/* -------------------------------------------------------------------------- */

export const personal: PersonalInfo = {
  name: 'Sudesh Mehar',
  greeting: "Hello, I'm",
  roles: ['B.Tech IT Student', 'Full Stack Web Developer', 'Aspiring Software Engineer'],
  tagline: 'Learning by building — from modern web experiences to strong software-engineering fundamentals.',
  bio: 'Third-year Information Technology student at MAIT, New Delhi, focused on full-stack web development and software engineering. I build practical products with JavaScript and TypeScript, am strengthening React, Node.js and Next.js, and currently practise data structures and algorithms in C++.',
  degree: 'B.Tech in Information Technology',
  degreeShort: 'B.Tech',
  field: 'Information Technology',
  university: 'Maharaja Agrasen Institute of Technology (GGSIPU)',
  location: 'New Delhi, India',
  email: 'sudeshmehar3@gmail.com',
  phone: '+91 80002 96940',
  availability: 'Open to internships & collaboration',

  // Drop your PDF in `public/resume/` and point here. `null` disables the
  // button (with an explanatory tooltip) instead of opening a broken tab.
  resumeUrl: null,

  // Add e.g. `/profile.jpg` to `public/`. `null` → premium silhouette avatar.
  profileImage: `${publicAsset('sudesh-mehar.png')}?v=original-20260824`,
};

/* -------------------------------------------------------------------------- */
/*  2. NAVIGATION                                                             */
/* -------------------------------------------------------------------------- */

/** Shown in the navbar + mobile menu. */
export const navLinks: NavLink[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

/** Every section in DOM order — used by the scroll-spy. */
export const sectionOrder = [
  'home',
  'about',
  'skills',
  'expertise',
  'projects',
  'achievements',
  'activity',
  'contact',
] as const;

export const footerLinks: NavLink[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

/* -------------------------------------------------------------------------- */
/*  3. SOCIAL                                                                 */
/* -------------------------------------------------------------------------- */

export const socials: SocialLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/sudesh4545',
    handle: '@sudesh4545',
    icon: 'github',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/sudeshmehar3/',
    handle: '@sudeshmehar3',
    icon: 'linkedin',
  },
  {
    id: 'email',
    label: 'Email',
    url: `mailto:${personal.email}`,
    handle: personal.email,
    icon: 'mail',
  },
  {
    id: 'discord',
    label: 'Discord',
    url: 'https://discord.gg/yrXW43yXZ',
    handle: 'FitWithSudesh Community',
    icon: 'messages',
  },
];

/* -------------------------------------------------------------------------- */
/*  4. HERO — four floating cards around the holographic brain                */
/* -------------------------------------------------------------------------- */

export const heroCards: HeroCard[] = [
  { id: 'hc-1', index: '01', lines: ['Software', 'Development'], icon: 'code', accent: 'cyan' },
  { id: 'hc-2', index: '02', lines: ['Problem', 'Solving'], icon: 'puzzle', accent: 'purple' },
  { id: 'hc-3', index: '03', lines: ['Full Stack', 'Development'], icon: 'layers', accent: 'magenta' },
  { id: 'hc-4', index: '04', lines: ['Data Structures', '& Algorithms'], icon: 'binary', accent: 'blue' },
];

/* -------------------------------------------------------------------------- */
/*  5. ABOUT                                                                  */
/* -------------------------------------------------------------------------- */

export const about = {
  heading: 'The Engineer Within',
  subheading:
    'Passionate about building useful digital products through technology, problem solving and continuous learning.',
};

export const aboutHighlights: AboutHighlight[] = [
  {
    id: 'ah-1',
    label: 'Education',
    lines: ['B.Tech', 'Information Technology'],
    icon: 'graduationCap',
    accent: 'cyan',
  },
  { id: 'ah-2', label: 'Focus', lines: ['Software', 'Engineering'], icon: 'cpu', accent: 'purple' },
  { id: 'ah-3', label: 'Interest', lines: ['Full Stack • AI', 'Web • Systems'], icon: 'compass', accent: 'magenta' },
];

/* -------------------------------------------------------------------------- */
/*  6. SKILLS — the percentages are yours to set                              */
/* -------------------------------------------------------------------------- */

export const skills: Skill[] = [
  { name: 'HTML & CSS', category: 'Web Foundations', level: 85, tech: 'javascript', accent: 'cyan' },
  { name: 'JavaScript', category: 'Web Development', level: 78, tech: 'javascript', accent: 'purple' },
  { name: 'TypeScript', category: 'Typed JavaScript', level: 68, tech: 'javascript', accent: 'blue' },
  { name: 'C++', category: 'Programming & DSA', level: 60, tech: 'cpp', accent: 'blue' },
  { name: 'React', category: 'Currently Learning', level: 55, tech: 'react', accent: 'cyan' },
  { name: 'Node.js', category: 'Currently Learning', level: 48, tech: 'node', accent: 'purple' },
  { name: 'Next.js', category: 'Currently Learning', level: 40, tech: 'react', accent: 'magenta' },
  { name: 'Git & GitHub', category: 'Version Control', level: 70, tech: 'git', accent: 'magenta' },
  { name: 'Python & Java', category: 'Familiar', level: 32, tech: 'python', accent: 'cyan' },
];

/* -------------------------------------------------------------------------- */
/*  7. CORE IT EXPERTISE                                                      */
/* -------------------------------------------------------------------------- */

export const expertise: ExpertiseItem[] = [
  { id: 'ex-1', lines: ['Data Structures', '& Algorithms'], icon: 'binary', accent: 'cyan' },
  { id: 'ex-2', lines: ['Database', 'Management'], icon: 'database', accent: 'blue' },
  { id: 'ex-3', lines: ['Operating', 'Systems'], icon: 'cpu', accent: 'purple' },
  { id: 'ex-4', lines: ['Object Oriented', 'Programming'], icon: 'boxes', accent: 'magenta' },
  { id: 'ex-5', lines: ['Web', 'Development'], icon: 'globe', accent: 'cyan' },
  { id: 'ex-6', lines: ['Software', 'Engineering'], icon: 'workflow', accent: 'purple' },
];

/* -------------------------------------------------------------------------- */
/*  8. PROJECTS                                                               */
/* -------------------------------------------------------------------------- */

export const projects: Project[] = [
  {
    id: 'fitwithsudesh',
    index: '01',
    title: 'FitWithSudesh',
    subtitle: 'MERN • Fitness Platform',
    description:
      'A full-stack fitness workspace combining workout planning, hydration, nutrition, progress tracking and an AI-powered coaching experience.',
    longDescription:
      'FitWithSudesh helps users plan workouts, calculate BMI and calories, track water and nutrition, monitor progress and receive practical AI-assisted fitness guidance. The responsive React frontend uses Redux Toolkit and Recharts, while the Express and MongoDB backend handles authentication, validation and persistent user data.',
    preview: 'shop',
    image: publicAsset('projects/fitwithsudesh.png'),
    technologies: ['React', 'Redux Toolkit', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    features: [
      'Workout Planning',
      'BMI & Calorie Calculators',
      'Hydration & Nutrition Tracking',
      'AI Fitness Coach',
      'Progress Analytics',
      'Secure Authentication',
    ],
    demoUrl: 'https://frontend-five-gules-24.vercel.app',
    githubUrl: 'https://github.com/sudesh4545/fitwithsudesh',
    accent: 'cyan',
  },
  {
    id: 'coming-soon-two',
    index: '02',
    title: 'Next Project',
    subtitle: 'In Development',
    description:
      'A new project is currently being planned and built. Details, source code and a live preview will be published here soon.',
    longDescription:
      'This slot is reserved for the next complete build. It will be updated with an honest technical overview, feature list, repository and live demo when the project is ready.',
    preview: 'distributed',
    image: null,
    technologies: ['Coming Soon'],
    features: [
      'Planning in progress',
      'Technology stack to be announced',
      'Repository coming soon',
    ],
    demoUrl: null,
    githubUrl: null,
    accent: 'purple',
  },
  {
    id: 'coming-soon-three',
    index: '03',
    title: 'Future Build',
    subtitle: 'Coming Soon',
    description:
      'Another practical software project is on the roadmap and will appear here after development and testing.',
    longDescription:
      'This card intentionally avoids placeholder claims. The final name, stack, features, source code and deployment will be added after the project is complete.',
    preview: 'shop',
    image: null,
    technologies: ['Coming Soon'],
    features: [
      'Idea exploration',
      'Development planned',
      'Details coming soon',
    ],
    demoUrl: null,
    githubUrl: null,
    accent: 'magenta',
  },
];

export const projectsCopy = {
  heading: 'Impactful Creations',
  subheading: 'Selected projects built through code, experimentation and problem solving.',
};

/* -------------------------------------------------------------------------- */
/*  9. ACHIEVEMENTS — SAMPLE VALUES, replace with your real numbers           */
/* -------------------------------------------------------------------------- */

export const stats: Stat[] = [
  {
    id: 'st-1',
    value: liveStats.leetcode.solved,
    label: 'LeetCode Problems',
    caption: 'Practice journey started',
    icon: 'target',
    accent: 'cyan',
    placeholder: false,
  },
  {
    id: 'st-2',
    value: null,
    display: `Top ${liveStats.hackerrank.topPercent}%`,
    label: 'HackerRank Standing',
    caption: `${liveStats.hackerrank.stars}★ Problem Solving`,
    icon: 'star',
    accent: 'purple',
    placeholder: false,
  },
  {
    id: 'st-3',
    value: 1,
    label: 'Completed Project',
    caption: 'FitWithSudesh',
    icon: 'trophy',
    accent: 'magenta',
    placeholder: false,
  },
  {
    id: 'st-4',
    value: liveStats.github.repositories,
    label: 'Public Repositories',
    caption: 'On GitHub',
    icon: 'boxes',
    accent: 'blue',
    placeholder: false,
  },
];

const certificateAccents = ['cyan', 'purple', 'magenta'] as const;
const certificateIcons = ['flame', 'award', 'zap'] as const;

const certificateBadges: Badge[] = liveStats.hackerrank.certificates.map((certificate, index) => {
  const basicMatch = certificate.name.match(/^(.*?)\s*(\(Basic\))$/i);
  const words = certificate.name.split(/\s+/);
  const lines: [string, string] = basicMatch
    ? [basicMatch[1].trim(), basicMatch[2]]
    : [words.slice(0, -1).join(' ') || words[0], words.length > 1 ? words.at(-1) ?? '' : 'Certificate'];
  return {
    id: `hr-${certificate.id}`,
    lines,
    caption: 'HackerRank verified',
    url: certificate.url,
    icon: certificateIcons[index % certificateIcons.length],
    accent: certificateAccents[index % certificateAccents.length],
    placeholder: false,
  };
});

export const badges: Badge[] = [
  ...certificateBadges,
  {
    id: 'bd-4',
    lines: ['Full Stack', 'Project'],
    caption: 'FitWithSudesh shipped',
    url: 'https://frontend-five-gules-24.vercel.app',
    icon: 'shieldCheck',
    accent: 'blue',
    placeholder: false,
  },
];

/* -------------------------------------------------------------------------- */
/*  10. CODING ACTIVITY — SAMPLE VALUES                                       */
/* -------------------------------------------------------------------------- */

export const platforms: CodingPlatform[] = [
  {
    id: 'leetcode',
    name: 'LeetCode',
    handle: '@Sudesh4545',
    url: 'https://leetcode.com/u/Sudesh4545/',
    icon: 'terminal',
    accent: 'cyan',
    rank: liveStats.leetcode.ranking ? `Global rank #${liveStats.leetcode.ranking.toLocaleString()}` : 'DSA journey started',
    stats: [
      { label: 'Solved', value: String(liveStats.leetcode.solved) },
      { label: 'Acceptance', value: `${liveStats.leetcode.acceptance}%` },
      { label: 'Submissions', value: String(liveStats.leetcode.submissions) },
    ],
    trend: [0, 0, 0, 0, 0, 0, 0, 0, 35, 35, 65, 100],
    placeholder: false,
  },
  {
    id: 'hackerrank',
    name: 'HackerRank',
    handle: '@sudeshmehar3',
    url: 'https://www.hackerrank.com/profile/sudeshmehar3',
    icon: 'braces',
    accent: 'purple',
    rank: `Top ${liveStats.hackerrank.topPercent}% • ${liveStats.hackerrank.stars}★ Problem Solving`,
    stats: [
      { label: 'Solved', value: String(liveStats.hackerrank.solved) },
      { label: 'Stars', value: `${liveStats.hackerrank.stars}★` },
      { label: 'Global Rank', value: `#${liveStats.hackerrank.rank.toLocaleString()}` },
    ],
    trend: [20, 24, 30, 38, 45, 52, 58, 67, 74, 82, 90, 100],
    placeholder: false,
  },
  {
    id: 'github',
    name: 'GitHub',
    handle: '@sudesh4545',
    url: 'https://github.com/sudesh4545',
    icon: 'github',
    accent: 'magenta',
    rank: 'Building in public',
    stats: [
      { label: 'Repos', value: String(liveStats.github.repositories) },
      { label: 'Stars', value: String(liveStats.github.stars) },
      { label: 'Followers', value: String(liveStats.github.followers) },
    ],
    trend: [10, 12, 18, 25, 30, 36, 45, 52, 60, 70, 84, 100],
    placeholder: false,
  },
];

export const githubActivity: GitHubActivity = {
  seed: 20260823, // change to reshuffle the sample heatmap
  weeks: 53,
  totals: [
    { id: 'ga-1', label: 'Repositories', value: liveStats.github.repositories, icon: 'folderGit', accent: 'cyan' },
    { id: 'ga-2', label: 'Profile Stars', value: liveStats.github.stars, icon: 'star', accent: 'purple' },
    { id: 'ga-3', label: 'Followers', value: liveStats.github.followers, icon: 'activity', accent: 'magenta' },
    { id: 'ga-4', label: 'Completed Projects', value: 1, icon: 'boxes', accent: 'blue' },
  ],
  placeholder: false,
};

export const activityCopy = {
  heading: 'Coding Activity',
  subheading: 'Consistency compounds — practice, contributions and the habit of shipping.',
  heatmapTitle: 'Verified GitHub Snapshot',
};

export const achievementsCopy = {
  heading: 'Accomplishments & Rankings',
  subheading: 'Progress measured in problems solved, projects shipped and skills sharpened.',
};

export const skillsCopy = {
  heading: 'My Digital Skillset',
  subheading: 'Technologies I use to transform ideas into functional digital experiences.',
};

export const expertiseCopy = {
  heading: 'Core IT Expertise',
  subheading: 'The computer-science fundamentals behind everything I build.',
};

/* -------------------------------------------------------------------------- */
/*  11. CONTACT                                                               */
/* -------------------------------------------------------------------------- */

export const contactCopy = {
  heading: "Let's Connect",
  subheading: 'Have an internship, collaboration or project in mind? Reach out directly by email or phone.',
};

export const contactChannels: ContactChannel[] = [
  {
    id: 'cc-email',
    label: 'Email',
    value: personal.email,
    href: `mailto:${personal.email}`,
    icon: 'mail',
    accent: 'cyan',
  },
  {
    id: 'cc-phone',
    label: 'Phone',
    value: personal.phone,
    href: 'tel:+918000296940',
    icon: 'messages',
    accent: 'blue',
  },
  { id: 'cc-location', label: 'Location', value: personal.location, href: null, icon: 'mapPin', accent: 'purple' },
];

/**
 * Where the contact form POSTs. Set VITE_CONTACT_ENDPOINT in `.env`
 * (Formspree URL, your own /api/contact route, an EmailJS proxy…).
 * Empty → the form validates, then honestly reports it is not connected and
 * offers a mailto fallback. It never fakes a success message.
 */
export const contactEndpoint: string = import.meta.env.VITE_CONTACT_ENDPOINT ?? '';

/* -------------------------------------------------------------------------- */
/*  12. FOOTER                                                               */
/* -------------------------------------------------------------------------- */

export const footer = {
  tagline: 'B.Tech IT Student • Full Stack Developer • Builder',
  copyright: `© ${new Date().getFullYear()} ${personal.name}. Built with code, curiosity and creativity.`,
};
