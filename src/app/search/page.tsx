import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/exam/CategoryCard";
import { ExamCard } from "@/components/exam/ExamCard";
import { SearchBox } from "@/components/home/SearchBox";
import { NotesCard } from "@/components/notes/NotesCard";
import { EmptyState, PageHeader } from "@/components/ui/Primitives";
import { dict, tr } from "@/i18n/dictionary";
import { getLang } from "@/i18n/server";
import { search } from "@/lib/repo";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
  alternates: { canonical: "/search" },
};

type SP = Promise<{ q?: string }>;

export default async function SearchPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").slice(0, 100).trim();
  const lang = await getLang();
  const hits = q ? await search(q) : [];
  const exams = hits.filter((h) => h.kind === "exam");
  const notes = hits.filter((h) => h.kind === "note");
  const cats = hits.filter((h) => h.kind === "category");

  return (
    <>
      <PageHeader title={tr(dict.nav.search, lang)} />
      <div className="container-page py-8">
        <div className="max-w-3xl">
          <SearchBox lang={lang} defaultValue={q} autoFocus={!q} />
        </div>

        {!q ? (
          <p className="mt-8 text-ink-500">{tr(dict.search.empty, lang)}</p>
        ) : hits.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title={`${tr(dict.search.noResults, lang)}: “${q}”`}
              hint={tr(dict.search.noResultsHint, lang)}
              action={
                <Link href="/exams" className="btn-outline">
                  {tr(dict.exam.allExams, lang)}
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            <p className="text-sm text-ink-500" role="status">
              {tr(dict.search.resultsFor, lang)} “{q}” — {hits.length}
            </p>
            {cats.length > 0 && (
              <section aria-label={tr(dict.nav.categories, lang)}>
                <h2 className="mb-3 text-lg font-bold text-brand-900">{tr(dict.nav.categories, lang)}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {cats.map((h) => h.kind === "category" && <CategoryCard key={h.category.slug} category={h.category} lang={lang} />)}
                </div>
              </section>
            )}
            {exams.length > 0 && (
              <section aria-label={tr(dict.nav.exams, lang)}>
                <h2 className="mb-3 text-lg font-bold text-brand-900">{tr(dict.nav.exams, lang)}</h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {exams.map((h) => h.kind === "exam" && <ExamCard key={h.exam.id} exam={h.exam} lang={lang} />)}
                </div>
              </section>
            )}
            {notes.length > 0 && (
              <section aria-label={tr(dict.nav.notes, lang)}>
                <h2 className="mb-3 text-lg font-bold text-brand-900">{tr(dict.nav.notes, lang)}</h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {notes.map((h) => h.kind === "note" && <NotesCard key={h.note.id} note={h.note} lang={lang} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </>
  );
}
