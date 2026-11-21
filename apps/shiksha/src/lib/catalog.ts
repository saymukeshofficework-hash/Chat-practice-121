import { getCollection, type CollectionEntry } from 'astro:content';
import { z } from 'astro/zod';
import { ACADEMIC_SESSION, ENABLE_HINDI, ENABLE_INDEXING, REPORT_EMAIL, SCHOOL_CURRICULUM_URL, TEST_ENGINE, TETTESTHUB_TEST_URL, TETTESTHUB_SIGNUP_URL, TETTESTHUB_SERIES_URL } from 'astro:env/server';

export type Locale = 'en' | 'hi';
type Lesson = CollectionEntry<'lessons'>;
export type ResourceKind = 'chapter' | 'exercise' | 'notes' | 'mcq' | 'important-questions' | 'sample-papers' | 'pyq';
export type Resource = { entry: Lesson; slug: string; path: string; kind: ResourceKind; locale: Locale };

const optionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  prompt: z.string().min(1),
  choices: z.array(z.string().min(1)).min(2),
  correct: z.number().int().nonnegative(),
  explanation: z.string().min(1),
}).refine(({ choices, correct }) => correct < choices.length && new Set(choices).size === choices.length);
const questionSchema = z.object({
  practice: z.array(optionSchema).min(5),
  timed: z.array(optionSchema).min(1),
  minutes: z.number().int().positive(),
}).refine(({ practice, timed }) => new Set([...practice, ...timed].map(({ id }) => id)).size === practice.length + timed.length);

export type Question = z.infer<typeof optionSchema>;
type QuestionSet = z.infer<typeof questionSchema>;
export type Chapter = {
  slug: string;
  path: string;
  number: number;
  testId: string;
  engineTestId: string;
  locale: Locale;
  grade: number;
  subject: string;
  overview: Resource;
  resources: Resource[];
  questions: QuestionSet;
};

export const grades = [6, 7, 8, 9, 10, 11, 12];
export const locales: Locale[] = ENABLE_HINDI ? ['en', 'hi'] : ['en'];
export const settings = {
  indexing: ENABLE_INDEXING,
  session: ACADEMIC_SESSION,
  curriculum: SCHOOL_CURRICULUM_URL || 'https://cbseacademic.nic.in/curriculum.html',
  reportEmail: REPORT_EMAIL,
  signup: TETTESTHUB_SIGNUP_URL ? httpsUrl(TETTESTHUB_SIGNUP_URL) : undefined,
  series: TETTESTHUB_SERIES_URL ? httpsUrl(TETTESTHUB_SERIES_URL) : undefined,
};
const profileFiles = import.meta.glob('../../../../content/people/*.json', { eager: true, import: 'default' });
const profileSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  credentials: z.array(z.string().min(1)).min(1),
  biography: z.string().min(1),
});
export type Profile = z.infer<typeof profileSchema> & { slug: string };
const questionFiles = import.meta.glob('../../../../content/**/questions*.json', { eager: true, import: 'default' });
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function httpsUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Integration URLs must use HTTPS without embedded credentials.');
  return url.href;
}

export function localPath(locale: Locale, path: string) {
  return locale === 'hi' ? `/hi${path}` : path;
}

export function classPath(grade: number, locale: Locale) {
  return localPath(locale, `/class-${grade}/`);
}

export function subjectName(subject: string, locale: Locale = 'en') {
  const labels: Record<string, string> = { maths: 'गणित', science: 'विज्ञान', physics: 'भौतिकी', chemistry: 'रसायन विज्ञान', biology: 'जीवविज्ञान' };
  return locale === 'hi' && labels[subject] ? labels[subject] : subject.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}

export function gradeName(grade: number, locale: Locale) {
  return locale === 'hi' ? `कक्षा ${grade}` : `Class ${grade}`;
}

export function testPath(chapter: Chapter) {
  return localPath(chapter.locale, `/test/${chapter.testId}/`);
}

export function enginePath(chapter: Chapter) {
  if (TEST_ENGINE !== 'tettesthub' || !TETTESTHUB_TEST_URL) return undefined;
  if (!TETTESTHUB_TEST_URL.includes('{id}')) throw new Error('TETTESTHUB_TEST_URL must contain {id}.');
  return httpsUrl(TETTESTHUB_TEST_URL.replaceAll('{id}', encodeURIComponent(chapter.engineTestId)));
}

function resourceKind(folder: string, slug: string): ResourceKind {
  if (folder === 'sample-papers') {
    if (/^\d{4}-set-[1-9]\d*$/.test(slug)) return 'sample-papers';
    throw new Error(`Invalid sample paper filename: ${slug}`);
  }
  if (folder === 'pyq') {
    if (/^\d{4}$/.test(slug)) return 'pyq';
    throw new Error(`Invalid PYQ filename: ${slug}`);
  }
  if (/^exercise-\d+(?:-\d+)*$/.test(slug)) return 'exercise';
  if (slug === 'index') return 'chapter';
  if (slug === 'notes' || slug === 'mcq' || slug === 'important-questions') return slug;
  throw new Error(`Unsupported content path: ${folder}/${slug}`);
}

async function loadCatalog() {
  const profiles = Object.entries(profileFiles).map(([file, data]): Profile => {
    const slug = file.split('/').at(-1)?.replace(/\.json$/, '') ?? '';
    if (!slugPattern.test(slug)) throw new Error(`Invalid profile slug: ${file}`);
    return { ...profileSchema.parse(data), slug };
  });
  const groups = new Map<string, Resource[]>();
  const papers: { resource: Resource; grade: number; subject: string }[] = [];
  const testIds = new Set<string>();
  const chapters: Chapter[] = [];

  for (const entry of await getCollection('lessons')) {
    const parts = entry.id.split('/');
    const [classSlug = '', subject = '', folder = '', file = ''] = parts;
    const grade = Number(classSlug.replace(/^class-/, ''));
    if (parts.length !== 4 || classSlug !== `class-${grade}` || !grades.includes(grade) || !slugPattern.test(subject) || !slugPattern.test(folder) || !slugPattern.test(file)) {
      throw new Error(`Invalid content path: ${entry.id}`);
    }
    const locale: Locale = file.endsWith('-hi') ? 'hi' : 'en';
    if (!locales.includes(locale)) continue;
    const review = entry.data.review;
    for (const [slug, name] of [[review?.writerProfile, review?.writer], [review?.reviewerProfile, review?.reviewer]]) {
      if (slug && !profiles.some((profile) => profile.slug === slug && profile.name === name)) {
        throw new Error(`Review profile must exist and match the credited name: ${entry.id} · ${slug}`);
      }
    }
    const slug = locale === 'hi' ? file.slice(0, -3) : file;
    const kind = resourceKind(folder, slug);
    const base = `${classPath(grade, locale)}${subject}/${folder}/`;
    const resource = { entry, slug, kind, locale, path: kind === 'chapter' ? base : `${base}${slug}/` };
    if (kind === 'sample-papers' || kind === 'pyq') {
      papers.push({ resource, grade, subject });
    } else {
      const resources = groups.get(base) ?? [];
      resources.push(resource);
      groups.set(base, resources);
    }
  }

  for (const [path, entries] of groups) {
    const overview = entries.find(({ kind }) => kind === 'chapter');
    if (!overview?.entry.data.chapterNumber || !overview.entry.data.testId) throw new Error(`Missing chapter overview, number or test ID for ${path}`);
    const [classSlug, subject, slug] = overview.entry.id.split('/');
    const grade = Number(classSlug.slice(6));
    const { locale } = overview;
    const { chapterNumber, testId, engineTestId = testId } = overview.entry.data;
    if (testIds.has(`${locale}/${testId}`)) throw new Error(`Duplicate test ID: ${testId}`);
    testIds.add(`${locale}/${testId}`);
    const questionFile = `../../../../content/${classSlug}/${subject}/${slug}/questions${locale === 'hi' ? '-hi' : ''}.json`;
    const questions = questionSchema.parse(questionFiles[questionFile]);
    const resources = entries.filter(({ kind }) => kind !== 'chapter').sort((a, b) => a.slug.localeCompare(b.slug, 'en', { numeric: true }));
    if (resources.some(({ kind, entry }) => kind === 'mcq' && entry.data.status === 'reviewed') && questions.practice.length < 15) {
      throw new Error(`Reviewed MCQ pages require at least 15 questions: ${path}`);
    }
    chapters.push({ slug, path, grade, subject, number: chapterNumber, testId, engineTestId, locale, overview, resources, questions });
  }

  chapters.sort((a, b) => a.grade - b.grade || a.subject.localeCompare(b.subject) || a.number - b.number);
  papers.sort((a, b) => b.resource.slug.localeCompare(a.resource.slug, 'en', { numeric: true }));
  return { chapters, papers, profiles };
}

export type Catalog = Awaited<ReturnType<typeof loadCatalog>>;

export function subjectsFor(catalog: Catalog, grade: number, locale: Locale) {
  return [...new Set([
    ...catalog.chapters.filter((item) => item.grade === grade && item.locale === locale).map(({ subject }) => subject),
    ...catalog.papers.filter((item) => item.grade === grade && item.resource.locale === locale).map(({ subject }) => subject),
  ])];
}

export const getCatalog = loadCatalog;

export function indexed(resource: Resource) {
  return settings.indexing && resource.entry.data.status === 'reviewed';
}
