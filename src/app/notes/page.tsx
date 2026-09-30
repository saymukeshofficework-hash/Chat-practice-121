import Link from "next/link";
import { FilterChips } from "@/components/exam/FilterChips";
import { NotesCard } from "@/components/notes/NotesCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { EmptyState, PageHeader } from "@/components/ui/Primitives";
import { dict, tr } from "@/i18n/dictionary";
import { getLang } from "@/i18n/server";
import { getCategories, getNotes } from "@/lib/repo";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "MP Exam Notes ₹199 — MPPSC, MPESB, Police, TET, Group Exams",
  description:
    "Exam-oriented PDF notes at ₹199 for Madhya Pradesh exams — MPPSC, MPESB, MP TET, Police, Group exams, Nayab Tahsildar and MP GK. Hindi medium.",
  path: "/notes",
});

type SP = Promise<{ category?: string }>;

export default async function NotesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const lang = await getLang();
  const [notes, categories] = await Promise.all([getNotes(), getCategories()]);
  const list = sp.category ? notes.filter((n) => n.category === sp.category) : notes;
  const n = dict.notes;
  const allComingSoon = notes.every((x) => x.status !== "AVAILABLE");

  return (
    <>
      <PageHeader title={tr(n.title, lang)} subtitle={tr(n.subtitle, lang)}>
        <Breadcrumbs items={[{ label: tr(dict.nav.home, lang), href: "/" }, { label: tr(dict.nav.notes, lang), href: "/notes" }]} />
      </PageHeader>

      <div className="container-page py-8">
        <div className="card p-4 sm:p-5">
          <FilterChips
            label={tr(dict.calendar.category, lang)}
            param="category"
            basePath="/notes"
            params={sp}
            current={sp.category}
            allLabel={tr(n.allCategories, lang)}
            options={categories.map((c) => ({ value: c.slug, label: tr(c.name, lang) }))}
          />
        </div>

        {allComingSoon && (
          <div className="mt-6">
            <ComingSoon lang={lang} compact message={tr(dict.comingSoon.notes, lang)} notifySubject="Notes launch" />
          </div>
        )}

        <div className="mt-6">
          {list.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((note) => (
                <NotesCard key={note.id} note={note} lang={lang} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={tr(n.noNotes, lang)}
              hint={tr(n.noNotesHint, lang)}
              action={
                <Link href="/notes" className="btn-outline">
                  {tr(n.allCategories, lang)}
                </Link>
              }
            />
          )}
        </div>
      </div>
    </>
  );
}
