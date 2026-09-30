import Link from "next/link";
import { CategoryCard } from "@/components/exam/CategoryCard";
import { ExamGrid } from "@/components/exam/ExamCard";
import { FilterChips } from "@/components/exam/FilterChips";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState, PageHeader, SectionHeader } from "@/components/ui/Primitives";
import { DateStatusLegend } from "@/components/ui/StatusBadge";
import { dict, tr } from "@/i18n/dictionary";
import { getLang } from "@/i18n/server";
import { examPhase } from "@/lib/dates";
import { getCategories, getExams } from "@/lib/repo";
import { pageMeta } from "@/lib/seo";
import type { Organization } from "@/types";

export const metadata = pageMeta({
  title: "MP Upcoming Exams 2026 — MPESB, MPPSC Exam Dates & Status",
  description:
    "All upcoming Madhya Pradesh government exams in 2026: MPESB and MPPSC application dates, exam dates, status and official links — Police, TET, Group 2, Group 3, Nayab Tahsildar and more.",
  path: "/exams",
});

type SP = Promise<{ category?: string; org?: string; status?: string }>;

const statusGroups = {
  open: ["APPLICATION_OPEN", "APPLICATION_UPCOMING"],
  upcoming: ["APPLICATION_CLOSED", "EXAM_UPCOMING"],
  completed: ["EXAM_COMPLETED", "AWAITING_UPDATE"],
} as const;

export default async function ExamsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const lang = await getLang();
  const now = new Date();
  const [all, categories] = await Promise.all([getExams(now), getCategories()]);

  const filtered = all.filter((e) => {
    if (sp.category && e.category !== sp.category) return false;
    if (sp.org && e.organization !== (sp.org as Organization)) return false;
    if (sp.status && sp.status in statusGroups) {
      const allowed = statusGroups[sp.status as keyof typeof statusGroups] as readonly string[];
      if (!allowed.includes(examPhase(e, now))) return false;
    }
    return true;
  });

  const c = dict.calendar;
  const statusLabels = {
    open: { hi: "आवेदन जारी / शीघ्र", en: "Applications open / soon" },
    upcoming: { hi: "परीक्षा आगामी", en: "Exam upcoming" },
    completed: { hi: "सम्पन्न", en: "Completed" },
  };

  return (
    <>
      <PageHeader title={tr(dict.exam.allExams, lang)} subtitle={tr(dict.exam.allExamsSub, lang)}>
        <Breadcrumbs items={[{ label: tr(dict.nav.home, lang), href: "/" }, { label: tr(dict.nav.exams, lang), href: "/exams" }]} />
      </PageHeader>

      <div className="container-page py-8">
        <div className="card space-y-3 p-4 sm:p-5">
          <FilterChips
            label={tr(c.category, lang)}
            param="category"
            basePath="/exams"
            params={sp}
            current={sp.category}
            allLabel={tr(c.all, lang)}
            options={categories.map((cat) => ({ value: cat.slug, label: tr(cat.name, lang) }))}
          />
          <FilterChips
            label={tr(c.organization, lang)}
            param="org"
            basePath="/exams"
            params={sp}
            current={sp.org}
            allLabel={tr(c.all, lang)}
            options={[
              { value: "MPESB", label: "MPESB" },
              { value: "MPPSC", label: "MPPSC" },
            ]}
          />
          <FilterChips
            label={tr(c.status, lang)}
            param="status"
            basePath="/exams"
            params={sp}
            current={sp.status}
            allLabel={tr(c.all, lang)}
            options={Object.entries(statusLabels).map(([v, l]) => ({ value: v, label: tr(l, lang) }))}
          />
        </div>

        <div className="my-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-500">
            {filtered.length} / {all.length}
          </p>
          <DateStatusLegend lang={lang} />
        </div>

        {filtered.length ? (
          <ExamGrid exams={filtered} lang={lang} now={now} />
        ) : (
          <EmptyState
            title={tr(dict.exam.noExams, lang)}
            hint={tr(dict.exam.noExamsHint, lang)}
            action={
              <Link href="/exams" className="btn-outline">
                {tr(c.reset, lang)}
              </Link>
            }
          />
        )}

        <p className="mt-6 text-xs text-ink-500">{tr(dict.disclaimer.info, lang)}</p>

        <section id="categories" className="mt-14 scroll-mt-24" aria-labelledby="cats-h">
          <SectionHeader id="cats-h" title={tr(dict.sections.categories, lang)} subtitle={tr(dict.sections.categoriesSub, lang)} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} lang={lang} count={all.filter((e) => e.category === cat.slug).length} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
