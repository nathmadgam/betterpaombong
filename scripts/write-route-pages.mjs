/**
 * Gives every page of the site its own HTML file in dist/, so that a static
 * host answers each page with a normal 200 status.
 *
 * This is a single-page app: the build writes one dist/index.html. A static
 * host with no rewrite rules (GitHub Pages) only finds a file for the home
 * page. Every other address falls through to 404.html, which draws the right
 * page but answers "404 Not Found", and search engines skip pages that answer
 * 404.
 *
 * GitHub Pages serves /services/education from dist/services/education.html,
 * so this script writes a copy of dist/index.html at that path for every page.
 * The list of pages comes from the same files the app reads:
 *
 *   src/data/services.yaml, src/data/government.yaml    the categories
 *   content/<section>/<category>/index.yaml             the pages in a category
 *   content/<section>/<category>/<slug>.md              a page
 *   content/<section>/<category>/<slug>/index.yaml      a page that is a listing
 *   content/pages/<slug>.md                             a standalone page, /<slug>
 *
 * Pages the app builds itself, such as /sitemap, are listed in APP_ROUTES.
 *
 * An address the site links to but has nothing to show for (a category with no
 * pages, a listed page with no content file) gets no HTML file. It keeps
 * answering 404, which is the honest answer, and is reported at the end.
 *
 * Usage, after `vite build`:
 *   node scripts/write-route-pages.mjs
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import * as yaml from 'js-yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

// The sections of the site: the URL prefix and the file listing its categories
const SECTIONS = [
  { path: 'services', categoriesFile: 'src/data/services.yaml' },
  { path: 'government', categoriesFile: 'src/data/government.yaml' },
];

// Pages with their own component in src/App.tsx
const APP_ROUTES = ['/sitemap'];

// Standalone pages: content/pages/about.md is served at /about
const PAGES_DIR = 'content/pages';

// Slugs become file names, so anything unusual is left out rather than written
const SAFE_SLUG = /^[a-z0-9][a-z0-9-]*$/;

const exists = (...parts) => existsSync(join(ROOT, ...parts));
const readYaml = file => yaml.load(readFileSync(join(ROOT, file), 'utf8'));

/** Sorts every address the content files link to into pages and dead ends. */
function collectRoutes() {
  const routes = [...APP_ROUTES];
  const empty = [];

  if (exists(PAGES_DIR)) {
    for (const file of readdirSync(join(ROOT, PAGES_DIR)).sort()) {
      const slug = file.replace(/\.md$/, '');
      if (file.endsWith('.md') && SAFE_SLUG.test(slug)) routes.push(`/${slug}`);
    }
  }

  for (const section of SECTIONS) {
    routes.push(`/${section.path}`);

    const categories = readYaml(section.categoriesFile)?.categories ?? [];
    for (const { slug } of categories) {
      const categoryRoute = `/${section.path}/${slug}`;
      const categoryDir = `content/${section.path}/${slug}`;
      const hasIndex =
        SAFE_SLUG.test(slug) && exists(categoryDir, 'index.yaml');
      const pages = hasIndex
        ? (readYaml(`${categoryDir}/index.yaml`)?.pages ?? [])
        : [];

      if (pages.length === 0) {
        empty.push(categoryRoute);
        continue;
      }
      routes.push(categoryRoute);

      for (const page of pages) {
        const hasContent =
          SAFE_SLUG.test(page.slug) &&
          (exists(categoryDir, `${page.slug}.md`) ||
            exists(categoryDir, page.slug, 'index.yaml'));
        (hasContent ? routes : empty).push(`${categoryRoute}/${page.slug}`);
      }
    }
  }

  return { routes, empty };
}

const indexFile = join(DIST, 'index.html');
if (!existsSync(indexFile)) {
  console.error('dist/index.html is missing. Run the build first.');
  process.exit(1);
}
const html = readFileSync(indexFile);

const { routes, empty } = collectRoutes();
let written = 0;

for (const route of routes) {
  const file = join(DIST, `${route}.html`);
  // Leave a real file of the same name alone, such as one from public/
  if (existsSync(file) && !readFileSync(file).equals(html)) {
    console.warn(`Skipped ${route}: dist${route}.html already exists`);
    continue;
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  written++;
}

console.log(`Wrote ${written} route pages to dist/`);
if (empty.length > 0) {
  console.log(
    `${empty.length} linked addresses have no content yet and still answer 404:`
  );
  for (const route of empty) console.log(`  ${route}`);
}
