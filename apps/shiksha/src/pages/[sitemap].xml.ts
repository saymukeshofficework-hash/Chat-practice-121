import { getPages } from '../lib/routes';
import { grades } from '../lib/catalog';

export const prerender = true;
export function getStaticPaths() {
  return ['sitemap', 'sitemap-home', ...grades.map((grade) => `sitemap-class-${grade}`)].map((sitemap) => ({ params: { sitemap } }));
}

const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const namespace = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
const prolog = '<?xml version="1.0" encoding="UTF-8"?>';

export async function GET({ params, site }: { params: { sitemap: string }; site: URL }) {
  const { pages } = await getPages();
  const indexed = pages.filter((page) => page.index);
  const urls = (paths: string[]) => paths.map((path) => `<url><loc>${escape(new URL(path, site).href)}</loc></url>`).join('');
  const forGrade = (grade: number) => indexed.filter(({ path }) => new RegExp(`^/(?:hi/)?class-${grade}/`).test(path));
  const hasContent = grades.filter((grade) => forGrade(grade).length > 0);
  const home = indexed.filter(({ type }) => type === 'home' || type === 'profile').map(({ path }) => path);
  let xml = '';

  if (params.sitemap === 'sitemap' && (hasContent.length || home.length)) {
    const maps = [...(home.length ? ['/sitemap-home.xml'] : []), ...hasContent.map((grade) => `/sitemap-class-${grade}.xml`)];
    xml = `<sitemapindex ${namespace}>${maps.map((path) => `<sitemap><loc>${escape(new URL(path, site).href)}</loc></sitemap>`).join('')}</sitemapindex>`;
  } else {
    const grade = Number(params.sitemap.replace('sitemap-class-', ''));
    const paths = params.sitemap === 'sitemap-home' ? home : forGrade(grade).map(({ path }) => path);
    xml = `<urlset ${namespace}>${urls(paths)}</urlset>`;
  }

  return new Response(prolog + xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
