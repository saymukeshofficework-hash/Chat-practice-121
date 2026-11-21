import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = 'dist';
const files = (await readdir(root, { recursive: true, withFileTypes: true }))
  .filter((item) => item.isFile() && item.name !== 'study-sw.js')
  .map((item) => path.relative(root, path.join(item.parentPath, item.name)).split(path.sep).join('/')).sort();
const assets = files.filter((file) => file.startsWith('_astro/') || file === 'mark.svg' || file === 'study.webmanifest');
const pages = [];
for (const file of files.filter((name) => name.endsWith('/index.html') || name === 'index.html')) {
  const html = await readFile(path.join(root, file), 'utf8');
  if (/<body data-page="(?:home|class|subject|chapter|resource|paper|offline)"/.test(html)) pages.push('/' + file.slice(0, -'index.html'.length));
}
const base = ['/', '/offline/', ...assets.map((file) => '/' + file)];
if (pages.includes('/hi/offline/')) base.push('/hi/', '/hi/offline/');
const hash = createHash('sha256');
for (const file of files) {
  hash.update(file);
  hash.update(await readFile(path.join(root, file)));
}
const worker = await readFile('scripts/service-worker.js', 'utf8');
await writeFile(path.join(root, 'study-sw.js'), `const CACHE = ${JSON.stringify('shiksha-study-' + hash.digest('hex').slice(0, 16))};
const BASE = ${JSON.stringify(base)};
const PAGES = new Set(${JSON.stringify(pages)});
${worker}`);
