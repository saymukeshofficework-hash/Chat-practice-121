import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const files = (await readdir(dist, { recursive: true, withFileTypes: true }))
  .filter((file) => file.isFile() && file.name.endsWith('.html'));
const origin = new URL('https://shiksha.invalid');
const pagefind = JSON.parse(await readFile(path.join(dist, 'pagefind/pagefind-entry.json'), 'utf8'));
assert.ok(pagefind.languages.en.page_count > 0, 'English Pagefind index');
const worker = await readFile(path.join(dist, 'study-sw.js'), 'utf8');
assert.match(worker, /const PAGES = new Set\(/);
assert.doesNotMatch(worker, /"\/(?:hi\/)?test\//, 'Tests must stay out of the offline cache');

function findFile(url) {
  return path.join(dist, url.pathname, url.pathname.endsWith('/') ? 'index.html' : '');
}

for (const file of files) {
  const name = path.join(file.parentPath, file.name);
  const html = await readFile(name, 'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, name);
  assert.match(html, /rel="canonical" href="https?:\/\//, name);
  const canonical = new URL(html.match(/rel="canonical" href="([^"]+)"/)[1]);
  for (const tag of html.matchAll(/<script type="application\/ld\+json">([^]*?)<\/script>/g)) JSON.parse(tag[1]);
  if (/\/(?:test|search)\/|^\/offline\//.test(canonical.pathname) || /class="tag sample-tag">(?:Sample|नमूना)</.test(html)) {
    assert.match(html, /name="robots" content="noindex, follow"/, name);
  }
  for (const match of html.matchAll(/\s(?:href|src)="(\/(?!\/)[^"]*)"/g)) {
    const target = new URL(match[1], origin);
    await access(findFile(target)).catch(() => { throw new Error(`${name} links to missing file ${target.pathname}`); });
  }
}

if (pagefind.languages.hi) {
  const hindi = await readFile(path.join(dist, 'hi/index.html'), 'utf8');
  assert.match(hindi, /<html lang="hi"/);
  assert.match(hindi, /lang="en" href="\/"/);
}
const math = await readFile(path.join(dist, 'class-10/maths/polynomials/exercise-2-1/index.html'), 'utf8');
assert.match(math, /class="katex"/);
assert.match(math, /<h3 id="question-1">/);
assert.match(math, /href="\/test\/c10-poly-01\//);
assert.match(math, /5-question quick check/);
const diagram = await readFile(path.join(dist, 'class-10/science/light/notes/index.html'), 'utf8');
assert.match(diagram, /<svg viewBox="0 0 440 220" role="img"/);
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
assert.match(sitemap, /<(?:sitemapindex|urlset) /);
console.log(`Verified ${files.length} HTML pages, internal links, metadata, quiz entry points, assets and search index.`);
