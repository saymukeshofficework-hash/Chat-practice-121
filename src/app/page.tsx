import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ExamGrid } from "@/components/exam/ExamCard";
import { NotificationItem } from "@/components/exam/NotificationItem";
import { SearchBox } from "@/components/home/SearchBox";
import { CourseCatalog } from "@/components/home/CourseCatalog";
import { FaqList } from "@/components/ui/FaqList";
import { DateStatusLegend } from "@/components/ui/StatusBadge";
import { dict, tr } from "@/i18n/dictionary";
import { getLang } from "@/i18n/server";
import { getCategories, getExams, getFaqs, getNotifications, getPopularExams, getUpcomingExams } from "@/lib/repo";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({ title: site.seo.title, description: site.seo.description, path: "/" });

export default async function HomePage() {
  const lang = await getLang();
  const now = new Date();
  const [upcoming, popular, categories, notifications, faqs, all] = await Promise.all([
    getUpcomingExams(6, now),
    getPopularExams(),
    getCategories(),
    getNotifications(5),
    getFaqs(),
    getExams(now),
  ]);
  const countBy = (slug: string) => all.filter((e) => e.category === slug).length;
  const s = dict.sections;

  return (
    <>
      {/* Intro */}
      <section className="pt-10 pb-2 sm:pt-14">
        <div className="container-page">
          <p className="text-sm font-semibold text-brand-700">{tr(dict.hero.tracking, lang)}</p>
          <h1 className="mt-2 max-w-3xl text-3xl leading-tight font-extrabold tracking-tight text-ink-900 sm:text-4xl">{tr(dict.hero.title, lang)}</h1>
          <p className="mt-3 max-w-2xl text-ink-500 sm:text-lg">{tr(dict.hero.subtitle, lang)}</p>
          <div className="mt-6 max-w-2xl">
            <SearchBox lang={lang} />
          </div>
        </div>
      </section>

      {/* Courses & test series */}
      <section className="pt-10 pb-12" aria-labelledby="courses-h">
        <div className="container-page">
          <h2 id="courses-h" className="mb-4 text-2xl font-extrabold tracking-tight text-ink-900">
            {lang === "hi" ? "कोर्स और टेस्ट सीरीज़" : "Courses & test series"}
          </h2>
          <CourseCatalog lang={lang} />
        </div>
      </section>

      {/* Upcoming exams */}
      <section className="py-12" aria-labelledby="upcoming-h">
        <div className="container-page">
          <MinimalHeader id="upcoming-h" title={tr(s.upcoming, lang)} sub={tr(s.upcomingSub, lang)} href="/exams" label={tr(s.viewAll, lang)} />
          <div className="mb-5">
            <DateStatusLegend lang={lang} />
          </div>
          <ExamGrid exams={upcoming} lang={lang} now={now} />
          <p className="mt-5 text-xs text-ink-500">{tr(dict.disclaimer.info, lang)}</p>
        </div>
      </section>

      {/* Categories + popular exams as simple chips */}
      <section className="py-12" aria-labelledby="cat-h">
        <div className="container-page">
          <MinimalHeader id="cat-h" title={tr(s.categories, lang)} sub={tr(s.categoriesSub, lang)} />
          <ul className="flex flex-wrap gap-2.5">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/exams?category=${c.slug}`} className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-surface px-4 py-2 text-[15px] text-ink-900 hover:border-ink-300">
                  {tr(c.name, lang)}
                  <span className="rounded-full bg-canvas px-2 text-xs text-ink-500">{countBy(c.slug)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 mb-3 text-sm font-semibold text-ink-500">{tr(s.popular, lang)}</p>
          <ul className="flex flex-wrap gap-2">
            {popular.map((e) => (
              <li key={e.id}>
                <Link href={`/exams/${e.slug}`} className="inline-flex rounded-md border border-ink-200 bg-canvas px-3 py-1 text-sm text-ink-700 hover:border-ink-300 hover:text-ink-900">
                  {e.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Latest notifications */}
      <section className="py-12" aria-labelledby="notif-h">
        <div className="container-page">
          <MinimalHeader id="notif-h" title={tr(s.notifications, lang)} href="/notifications" label={tr(s.viewAll, lang)} />
          <ul className="overflow-hidden rounded-2xl border border-ink-200 bg-surface">
            {notifications.map((n) => (
              <NotificationItem key={n.id} n={n} lang={lang} />
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12" aria-labelledby="faq-h">
        <div className="container-page max-w-3xl">
          <MinimalHeader id="faq-h" title={tr(s.faq, lang)} href="/faq" label={tr(s.viewAll, lang)} />
          <FaqList faqs={faqs.slice(0, 6)} lang={lang} />
          <p className="mt-8 text-sm text-ink-500">{tr(dict.disclaimer.affiliation, lang)}</p>
        </div>
      </section>
    </>
  );
}

function MinimalHeader({ id, title, sub, href, label }: { id?: string; title: string; sub?: string; href?: string; label?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 id={id} className="text-2xl font-extrabold tracking-tight text-ink-900">{title}</h2>
        {sub ? <p className="mt-1 text-ink-500">{sub}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
          {label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
