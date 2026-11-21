import { settings } from '../lib/catalog';

export function GET({ site }: { site: URL }) {
  // Allow crawlers to reach the pages and read their explicit noindex tags.
  const sitemap = settings.indexing ? `Sitemap: ${new URL('/sitemap.xml', site).href}\n` : '';
  return new Response(`User-agent: *\nAllow: /\n${sitemap}`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
