import { classPath, getCatalog, gradeName, grades, indexed, locales, localPath, settings, subjectName, testPath, type Chapter, type Locale, type Profile, type Resource } from './catalog';

type Crumb = { label: string; path: string };
type Base = { path: string; locale: Locale; title: string; description: string; crumbs: Crumb[]; index: boolean; offline?: boolean };
export type Page = Base & (
  | { type: 'home' | 'search' | 'offline' }
  | { type: 'class'; grade: number }
  | { type: 'subject'; grade: number; subject: string }
  | { type: 'chapter' | 'resource'; grade: number; subject: string; chapter: Chapter; resource: Resource }
  | { type: 'paper'; grade: number; subject: string; resource: Resource }
  | { type: 'test'; chapter: Chapter }
  | { type: 'profile'; profile: Profile }
);

export async function getPages() {
  const catalog = await getCatalog();
  const pages: Page[] = [];

  for (const locale of locales) {
    const hi = locale === 'hi';
    const home: Crumb = { label: hi ? 'होम' : 'Home', path: localPath(locale, '/') };
    const chapters = catalog.chapters.filter((chapter) => chapter.locale === locale);
    const papers = catalog.papers.filter(({ resource }) => resource.locale === locale);
    pages.push(
      { type: 'home', path: home.path, locale, title: 'Shiksha.buzz', description: hi ? 'अध्याय पढ़ें और सवालों का अभ्यास करें।' : 'Free chapter explanations, worked examples and interactive Maths and Science practice.', crumbs: [home], index: chapters.some(({ overview }) => indexed(overview)), offline: true },
      { type: 'search', path: localPath(locale, '/search/'), locale, title: hi ? 'खोजें' : 'Search the library', description: hi ? 'अध्याय और अभ्यास खोजें।' : 'Find a chapter, explanation or practice set.', crumbs: [home], index: false },
      { type: 'offline', path: localPath(locale, '/offline/'), locale, title: hi ? 'आप ऑफ़लाइन हैं' : 'You’re offline', description: hi ? 'पहले खोले गए पाठ पढ़ सकते हैं।' : 'Open a previously visited study page.', crumbs: [home], index: false, offline: true },
    );
    for (const grade of grades) {
      const classCrumb = { label: gradeName(grade, locale), path: classPath(grade, locale) };
      const classChapters = chapters.filter((chapter) => chapter.grade === grade);
      const classPapers = papers.filter((paper) => paper.grade === grade);
      const classCrumbs = [home, classCrumb];
      pages.push({ type: 'class', grade, path: classCrumb.path, locale, title: classCrumb.label, description: hi ? `${classCrumb.label} के विषय और अभ्यास।` : `Browse ${classCrumb.label} subjects, chapter explanations and interactive practice.`, crumbs: classCrumbs, index: classChapters.some(({ overview }) => indexed(overview)) || classPapers.some(({ resource }) => indexed(resource)), offline: true });
      const subjects = [...new Set([...classChapters, ...classPapers].map(({ subject }) => subject))];
      for (const subject of subjects) {
        const label = subjectName(subject, locale);
        const subjectPath = `${classCrumb.path}${subject}/`;
        const subjectCrumbs = [...classCrumbs, { label, path: subjectPath }];
        const subjectChapters = classChapters.filter((chapter) => chapter.subject === subject);
        const subjectPapers = classPapers.filter((paper) => paper.subject === subject);
        const title = `${classCrumb.label} ${label}`;
        pages.push({ type: 'subject', grade, subject, path: subjectPath, locale, title, description: hi ? `${title} के अध्याय, नोट्स और अभ्यास।` : `Study ${title} chapter by chapter. Browse notes, worked examples and practice.`, crumbs: subjectCrumbs, index: subjectChapters.some(({ overview }) => indexed(overview)) || subjectPapers.some(({ resource }) => indexed(resource)), offline: true });

        for (const chapter of subjectChapters) {
          const chapterCrumbs = [...subjectCrumbs, { label: chapter.overview.entry.data.title, path: chapter.path }];
          for (const resource of [chapter.overview, ...chapter.resources]) {
            const overview = resource.kind === 'chapter';
            const { title, description } = resource.entry.data;
            pages.push({
              type: overview ? 'chapter' : 'resource', grade, subject, chapter, resource, path: resource.path, locale, title, description,
              crumbs: overview ? chapterCrumbs : [...chapterCrumbs, { label: title, path: resource.path }],
              index: indexed(resource), offline: true,
            });
          }
          const title = hi ? `${chapter.overview.entry.data.title} परीक्षा` : `${chapter.overview.entry.data.title} timed test`;
          pages.push({ type: 'test', chapter, path: testPath(chapter), locale, title, description: hi ? 'समयबद्ध नमूना परीक्षा।' : 'A timed sample chapter test with worked feedback after submission.', crumbs: [...chapterCrumbs, { label: title, path: testPath(chapter) }], index: false });
        }
        for (const { resource } of subjectPapers) {
          const { title, description } = resource.entry.data;
          pages.push({ type: 'paper', grade, subject, resource, path: resource.path, locale, title, description, crumbs: [...subjectCrumbs, { label: title, path: resource.path }], index: indexed(resource), offline: true });
        }
      }
    }
  }

  for (const profile of catalog.profiles) {
    const path = `/people/${profile.slug}/`;
    const title = profile.name;
    pages.push({ type: 'profile', profile, path, locale: 'en', title, description: profile.role, crumbs: [{ label: 'Home', path: '/' }, { label: title, path }], index: settings.indexing });
  }
  for (const page of pages) {
    if (page.crumbs.at(-1)?.path !== page.path) page.crumbs = [...page.crumbs, { label: page.title, path: page.path }];
  }
  return { pages, catalog };
}

export function twinFor(page: Page, pages: Page[]) {
  if (page.type === 'test' || page.type === 'offline') return undefined;
  const path = page.locale === 'hi' ? page.path.replace(/^\/hi/, '') : `/hi${page.path}`;
  return pages.find((candidate) => candidate.path === path);
}
