# Futuristic Portfolio

An ultra-premium, dark-mode portfolio for a B.Tech Information Technology student.
Obsidian black canvas, controlled cyan/violet neon, glassmorphism, and a
holographic neural-network hero.

Built with **React 19 · TypeScript · Vite 8 · Tailwind CSS v4 · Framer Motion**.

---

## Quick start

```bash
npm install
```

```bash
npm run dev
```

Open <http://localhost:5173>.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload on port 5173 |
| `npm run build` | Type-checks, then builds to `dist/` |
| `npm run preview` | Serves the built `dist/` locally |
| `npm run typecheck` | `tsc --noEmit` only |

---

## Replace the placeholders

The site ships with visible `[YOUR ...]` markers and sample statistics **on
purpose** — nothing invents facts about you. Work through this list before you
publish.

### 1. Your details — [`src/data/portfolio.ts`](src/data/portfolio.ts)

Everything a visitor reads lives in this one file. No component hardcodes
content, so you never have to touch the UI.

| Line | Field | Replace with |
| --- | --- | --- |
| 42 | `personal.name` | Your full name — the logo monogram is derived from it |
| 44 | `personal.roles` | The three roles rotated under your name |
| 45–46 | `personal.tagline`, `bio` | Your own words |
| 50 | `personal.university` | Your college / university |
| 51 | `personal.location` | Your city or country |
| 52 | `personal.email` | Your real email address |
| 57 | `personal.resumeUrl` | See [Resume](#2-resume) below |
| 60 | `personal.profileImage` | See [Profile photo](#3-profile-photo) below |
| 104–105 | `socials` → GitHub `url`, `handle` | Your GitHub profile URL and username |
| 111–112 | `socials` → LinkedIn `url`, `handle` | Your LinkedIn profile URL and username |
| 161–171 | `skills` | Your technologies and honest percentages |
| 190–263 | `projects` | Your projects, plus `demoUrl` / `githubUrl` (lines 211–212, 235–236, 259–260) |
| 274 | `stats` | Your real numbers — then set `placeholder: false` |
| 317 | `badges` | Your real achievements |
| 356–405 | `platforms` | Coding-platform handles (360, 376, 392) and URLs (361, 377, 393) |
| 407 | `githubActivity` | Your contribution totals |

There is no separate `initials` field: the navbar logo, the footer mark, and the
About monogram all call `initialsOf(personal.name)`
([`src/lib/initials.ts`](src/lib/initials.ts)). One field to edit, and the mark
can never show somebody else's letters.

Any link left as `null` renders as a **dashed, non-navigating button**. It stays
keyboard-focusable and, when activated, shows a toast naming the exact field to
fill in — so the site never points at a URL that isn't yours, and never ships a
button that silently does nothing.

### 2. Resume

Drop your PDF into `public/resume/` and point `resumeUrl` at it:

```ts
resumeUrl: '/resume/my-resume.pdf',
```

A clearly-marked `placeholder-resume.pdf` is included so the button works out of
the box. Set `resumeUrl: null` to disable the button instead.

### 3. Profile photo

Put an image in `public/` and reference it:

```ts
profileImage: '/profile.jpg',
```

Left as `null`, the About section renders an animated monogram built from your
name's initials — no broken-image icon, no stock photo of a stranger.

### 4. Sample data flags

Twelve entries are marked `placeholder: true` (lines 283, 293, 303, 313, 324,
332, 340, 348, 371, 387, 403, 417). Each one renders a small **SAMPLE** chip in
the UI, and its section carries a short note explaining that the numbers are
illustrative. Replace the value, then flip the flag:

```ts
{
  id: 'st-1',
  value: 420,               // ← your real number
  suffix: '+',
  label: 'Solved Problems',
  caption: 'Across coding platforms',
  icon: 'target',
  accent: 'cyan',
  placeholder: false,       // ← flip once the number is yours
},
```

Leaving a flag as `true` is safe — it is honest, just not impressive. Setting it
to `false` while keeping the sample number is the one thing to avoid.

### 5. SEO — [`index.html`](index.html)

The name is already set to **Sudesh Mehar** throughout. If you fork this for
someone else, replace that name and `[YOUR UNIVERSITY]` in the `<title>`, the
description, keywords, Open Graph tags, Twitter tags, the JSON-LD block, and the
`<noscript>` fallback.

The JSON-LD deliberately has **no `sameAs` array** — publishing placeholder
profile URLs would tell search engines about accounts that aren't yours. A
comment right below the block shows how to add your real ones.

Swap `public/og-image.svg` for a 1200×630 PNG for the widest crawler support.
`public/favicon.svg` carries a neutral `</>` glyph rather than initials, so the
tab icon needs no edit when the name changes.

---

## Contact form

The form validates, sanitises, and traps bots on the client. It does **not**
pretend to send anything until you connect a backend.

Copy the example env file and set one variable:

```bash
cp .env.example .env
```

```env
VITE_CONTACT_ENDPOINT=https://formspree.io/f/xxxxxxx
```

It POSTs JSON (`name`, `email`, `subject`, `message`) to that URL, so anything
that accepts a JSON body works: Formspree, EmailJS, a Resend proxy, or your own
`/api/contact` route.

**With the variable unset**, the form still validates every field, then shows a
toast saying the backend isn't connected and hands off to the visitor's email
client with the message pre-filled. It never displays a false success message.

### A note on secrets

> Only `VITE_`-prefixed variables reach the browser, and **everything that
> reaches the browser is public**. Anyone can read it in the built JavaScript.

So:

- Never put a private API key, token, or password in `.env` or in
  `src/data/portfolio.ts`.
- Use provider endpoints that are designed to be public (a Formspree form URL,
  an EmailJS public key) or route through a server you control.
- If you later want live GitHub stats, fetch them from a small server-side
  route and read that route from the client. A personal access token in
  frontend code is a leaked token.
- `.env` is already in `.gitignore`; `.env.example` is committed on purpose.

`VITE_SITE_URL` is substituted into `index.html` as `%SITE_URL%` at build time
(see [`vite.config.ts`](vite.config.ts)) and drives the canonical link, the
Open Graph URL, and the schema.org profile URL. Set it to your deployed domain
with no trailing slash.

---

## Project structure

```
src/
├── components/          # 28 focused components — no monolith
│   ├── Navbar.tsx           Hero.tsx        About.tsx
│   ├── Skills.tsx           SkillCard.tsx   Expertise.tsx
│   ├── Projects.tsx         ProjectCard.tsx ProjectModal.tsx
│   ├── ProjectPreview.tsx   Achievements.tsx StatCard.tsx
│   ├── CodingActivity.tsx   Contact.tsx     Footer.tsx
│   ├── GlassCard.tsx        NeonButton.tsx  Section.tsx
│   ├── SectionHeading.tsx   Reveal.tsx      Toast.tsx
│   ├── HoloBrain.tsx        BackgroundEffects.tsx
│   ├── CursorGlow.tsx       ScrollProgress.tsx
│   ├── Icon.tsx             TechIcon.tsx    ErrorBoundary.tsx
├── hooks/
│   ├── useActiveSection.ts  # scroll-spy for the navbar
│   ├── useCountUp.ts        # animated counters
│   ├── useFocusTrap.ts      # shared by the drawer and the modal
│   ├── useLockBodyScroll.ts
│   └── useMediaQuery.ts
├── lib/                 # accents, cn(), seeded random, smooth scroll
├── data/portfolio.ts    # ← ALL content lives here
├── types.ts
├── index.css            # Tailwind v4 theme + component layer
├── App.tsx
└── main.tsx
```

Sections render in a fixed order: **Hero → About → Skills → Core IT Expertise →
Projects → Achievements → Coding Activity → Contact → Footer.** Each is wrapped
in an `ErrorBoundary`, so a failure in one section can't blank the page.

### Design tokens

Defined once in `src/index.css` under `@theme`, then used as normal Tailwind
utilities (`bg-ink`, `text-brand-cyan`, `text-muted`, `font-display`).

| Token | Value |
| --- | --- |
| `--color-ink` | `#02050a` obsidian background |
| `--color-surface` | `#07101a` |
| `--color-surface-2` | `#0b1724` |
| `--color-brand-cyan` | `#00f0ff` |
| `--color-brand-blue` | `#2a6bff` |
| `--color-brand-purple` | `#8a2be2` |
| `--color-brand-magenta` | `#d946ef` |
| `--color-paper` | `#f8fafc` primary text |
| `--color-muted` | `#94a3b8` secondary text |
| `--color-faint` | `#64748b` tertiary text |

Change these values and the whole site re-themes.

---

## Accessibility

- One `<h1>`, then a clean `h2`/`h3` hierarchy; all eight sections labelled.
- Skip-to-content link as the first focusable element.
- The mobile drawer and the project modal are real dialogs: `aria-modal`,
  focus trapped, Escape closes, body scroll locked, and focus returns to the
  element that opened them.
- Form fields have real `<label>`s, `aria-invalid`, and errors wired up through
  `aria-describedby` and announced with `role="alert"`.
- Skill bars expose `role="meter"` with `aria-valuenow`.
- Every decorative visual is hidden from assistive tech.
- `prefers-reduced-motion` is respected in CSS **and** in JavaScript — the
  canvas particle field, the neural mesh, counters, and reveals all stand down.

## Responsive

Layouts are rebuilt per breakpoint rather than scaled down. Verified with no
horizontal overflow at **320, 375, 768, 1280, 1440, and 1920 px**:

- Skills: 1 → 2 → 3 columns
- Core IT Expertise: 2 → 3 → 6 hexagons across
- Projects: 1 → 2 → 3 equal-height cards
- Navigation: full rail on desktop, focus-trapped drawer below `lg`
- The contribution heatmap scrolls inside its own card, never the page

## Performance

- Canvas particle count scales with viewport area, pauses when the tab is
  hidden, and cleans up its listeners and animation frames on unmount.
- The scroll-spy throttles reads by timestamp instead of `requestAnimationFrame`,
  so a throttled frame loop can't leave the navbar stuck on a stale section.
- Reveal animations run once via `useInView`.
- Production build: ~90 kB CSS and ~448 kB JS (≈14 kB and ≈138 kB gzipped).

---

## Deploy

`npm run build` emits a static `dist/` — any static host works.

**Vercel / Netlify:** build command `npm run build`, output directory `dist`.
Add `VITE_CONTACT_ENDPOINT` and `VITE_SITE_URL` as environment variables in the
dashboard.

**GitHub Pages:** if you serve from a subpath, set `base` in `vite.config.ts`:

```ts
base: '/your-repo-name/',
```

---

## Licence

Yours to use for your own portfolio.
