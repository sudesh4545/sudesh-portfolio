import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv, type Plugin } from 'vite';

/**
 * Substitutes `%SITE_URL%` in index.html with `VITE_SITE_URL` from the
 * environment, so the canonical link and the Open Graph URLs point at the real
 * deployed domain. Falls back to a relative-safe default when the variable is
 * unset, which keeps the tags valid instead of leaking a raw placeholder.
 */
function siteUrlPlugin(siteUrl: string): Plugin {
  const normalised = siteUrl.replace(/\/+$/, '');

  return {
    name: 'portfolio-site-url',
    transformIndexHtml(html) {
      return html.replaceAll('%SITE_URL%', normalised);
    },
  };
}

/**
 * Reads `PORT` from the environment without pulling in Node type definitions,
 * so tooling that assigns a free port (dev-server launchers, CI) is honoured
 * while a plain `npm run dev` still lands on the familiar 5173.
 */
function resolvePort(): number {
  const runtime = globalThis as {
    process?: { env?: Record<string, string | undefined> };
  };
  const fromEnv = Number(runtime.process?.env?.PORT);

  return Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : 5173;
}

export default defineConfig(({ mode }) => {
  // Only VITE_-prefixed values are read here; nothing secret reaches the bundle.
  // '.' is the project root, which is where Vite is invoked from — using it
  // instead of `process.cwd()` keeps this config free of Node type dependencies.
  const env = loadEnv(mode, '.', 'VITE_');
  const siteUrl = env.VITE_SITE_URL?.trim() || 'https://your-domain.com';
  const base = env.VITE_BASE_PATH?.trim() || '/';

  return {
    base,
    plugins: [react(), tailwindcss(), siteUrlPlugin(siteUrl)],
    server: {
      port: resolvePort(),
      host: true,
    },
    build: {
      target: 'es2022',
      cssMinify: true,
    },
  };
});
