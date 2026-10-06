import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpenCheck, ClipboardCheck, ExternalLink, FileClock, Layers, Newspaper, NotebookPen, Timer } from "lucide-react";
import { CategoryCard } from "@/components/exam/CategoryCard";
import { ExamGrid } from "@/components/exam/ExamCard";
import { NotificationItem } from "@/components/exam/NotificationItem";
import { HeroIllustration } from "@/components/home/HeroIllustration";
import { SearchBox } from "@/components/home/SearchBox";
import { NotesCard } from "@/components/notes/NotesCard";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { FaqList } from "@/components/ui/FaqList";
import { SectionHeader } from "@/components/ui/Primitives";
import { DateStatusLegend } from "@/components/ui/StatusBadge";
import { dict, tr } from "@/i18n/dictionary";
import { getLang } from "@/i18n/server";
import { getCategories, getExams, getFaqs, getFeaturedNotes, getNotifications, getPopularExams, getUpcomingExams } from "@/lib/repo";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({ title: site.seo.title, description: site.seo.description, path: "/" });

export default async function HomePage() {
  const lang = await getLang();
  const now = new Date();
  const [upcoming, popular, categories, notes, notifications, faqs, all] = await Promise.all([
    getUpcomingExams(6, now),
    getPopularExams(),
    getCategories(),
    getFeaturedNotes(4),
    getNotifications(5),
    getFaqs(),
    getExams(now),
  ]);
  const countBy = (slug: string) => all.filter((e) => e.category === slug).length;
  const s = dict.sections;
  const whyIcons = [BadgeCheck, BookOpenCheck, ClipboardCheck, Layers];

  const caCategories = [
    { hi: "मध्यप्रदेश करेंट अफेयर्स", en: "MP Current Affairs" },
    { hi: "राष्ट्रीय", en: "India" },
    { hi: "अंतरराष्ट्रीय", en: "World" },
    { hi: "अर्थव्यवस्था", en: "Economy" },
    { hi: "राजव्यवस्था", en: "Polity" },
    { hi: "विज्ञान", en: "Science" },
    { hi: "खेल", en: "Sports" },
    { hi: "सरकारी योजनाएँ", en: "Govt Schemes" },
  ];

  return (
    <>
      {/* 1. Featured: MP High Court Assistant Grade-3 (notes + test series) */}
      <section className="bg-accent-500 text-white">
        <div className="container-page flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-white/85">
              {lang === "hi" ? "अभी उपलब्ध • MP हाई कोर्ट भर्ती 2026 (1174 पद)" : "Available now • MP High Court Recruitment 2026 (1174 posts)"}
            </p>
            <p className="mt-0.5 text-lg font-extrabold sm:text-xl">
              {lang === "hi" ? "सहायक ग्रेड-3: PDF नोट्स ₹299 · 20 मॉक टेस्ट ₹199 · कॉम्बो ₹449" : "Assistant Grade-3: PDF notes ₹299 · 20 mock tests ₹199 · Combo ₹449"}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href="/mp-high-court-assistant-grade-3-notes" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-bold text-brand-900 shadow hover:bg-accent-50">
              {lang === "hi" ? "नोट्स देखें" : "See notes"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/mp-high-court-assistant-grade-3-test-series" className="inline-flex items-center gap-1.5 rounded-lg bg-brand-900 px-4 py-2 text-sm font-bold text-white shadow hover:bg-brand-800">
              {lang === "hi" ? "टेस्ट सीरीज़ (टेस्ट 1 फ्री)" : "Test series (Test 1 free)"}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Hero */}
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "22px 22px" }}
          aria-hidden="true"
        />
        <div className="container-page relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.15fr_1fr] lg:py-20">
          <div>
            <p className="chip bg-white/10 text-accent-100 ring-1 ring-white/20">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {tr(dict.hero.tracking, lang)}
            </p>
            <h1 className="mt-4 text-3xl leading-tight font-extrabold sm:text-4xl lg:text-5xl">{tr(dict.hero.title, lang)}</h1>
            <p className="mt-4 text-base text-brand-100 sm:text-lg">{tr(dict.hero.subtitle, lang)}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/exams" className="btn-primary">
                {tr(dict.hero.ctaExams, lang)} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/notes" className="btn-ghost-light">
                {tr(dict.hero.ctaNotes, lang)}
              </Link>
              <Link href="/practice" className="btn-ghost-light">
                {tr(dict.hero.ctaPractice, lang)}
              </Link>
            </div>
          </div>
          <div className="hidden justify-center md:flex">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* 3. Search */}
      <section aria-label={tr(dict.search.label, lang)} className="relative z-10 -mt-7">
        <div className="container-page max-w-4xl">
          <SearchBox lang={lang} />
        </div>
      </section>

      {/* 4. Upcoming exams */}
      <section className="section" aria-labelledby="upcoming-h">
        <div className="container-page">
          <SectionHeader id="upcoming-h" title={tr(s.upcoming, lang)} subtitle={tr(s.upcomingSub, lang)} href="/exams" linkLabel={tr(s.viewAll, lang)} />
          <div className="mb-5">
            <DateStatusLegend lang={lang} />
          </div>
          <ExamGrid exams={upcoming} lang={lang} now={now} />
          <p className="mt-5 text-xs text-ink-500">{tr(dict.disclaimer.info, lang)}</p>
        </div>
      </section>

      {/* 5. Popular exams */}
      <section className="bg-surface py-10" aria-labelledby="popular-h">
        <div className="container-page">
          <h2 id="popular-h" className="text-xl font-bold text-brand-900">
            {tr(s.popular, lang)}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {popular.map((e) => (
              <li key={e.id}>
                <Link href={`/exams/${e.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-ink-200 bg-canvas px-4 text-sm font-semibold text-ink-700 hover:border-brand-500 hover:text-brand-700">
                  {e.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Categories */}
      <section className="section" aria-labelledby="cat-h">
        <div className="container-page">
          <SectionHeader id="cat-h" title={tr(s.categories, lang)} subtitle={tr(s.categoriesSub, lang)} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} lang={lang} count={countBy(c.slug)} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. ₹299 Notes */}
      <section className="section bg-surface" aria-labelledby="notes-h">
        <div className="container-page">
          <SectionHeader id="notes-h" title={tr(s.notes, lang)} subtitle={tr(s.notesSub, lang)} href="/notes" linkLabel={tr(s.viewAll, lang)} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {notes.map((n) => (
              <NotesCard key={n.id} note={n} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* 8 + 9. Test series & practice tests */}
      <section className="section" aria-label={`${tr(s.testSeries, lang)} / ${tr(s.practice, lang)}`}>
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <div>
            <SectionHeader title={tr(s.testSeries, lang)} href="/test-series" linkLabel={tr(s.viewAll, lang)} />
            <ComingSoon lang={lang} compact title={tr(s.testSeries, lang)} message={tr(dict.comingSoon.testSeries, lang)} notifySubject="Test series launch" />
            <FeatureRow
              items={[
                { Icon: NotebookPen, text: lang === "hi" ? "परीक्षा पैटर्न पर आधारित फुल-लेंथ टेस्ट" : "Full-length tests on the exam pattern" },
                { Icon: Timer, text: lang === "hi" ? "टाइमर, रैंक और विस्तृत विश्लेषण" : "Timer, rank and detailed analysis" },
              ]}
            />
          </div>
          <div>
            <SectionHeader title={tr(s.practice, lang)} href="/practice" linkLabel={tr(s.viewAll, lang)} />
            <ComingSoon lang={lang} compact title={tr(s.practice, lang)} message={tr(dict.comingSoon.practice, lang)} notifySubject="Practice tests launch" />
            <FeatureRow
              items={[
                { Icon: ClipboardCheck, text: lang === "hi" ? "विषयवार प्रश्न अभ्यास" : "Subject-wise question practice" },
                { Icon: BadgeCheck, text: lang === "hi" ? "सही/गलत उत्तर और सटीकता" : "Right/wrong answers and accuracy" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 10 + 11. Current affairs & previous papers */}
      <section className="section bg-surface" aria-label={`${tr(s.currentAffairs, lang)} / ${tr(s.previousPapers, lang)}`}>
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-50 text-accent-600">
                <Newspaper className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="text-xl font-bold text-brand-900">{tr(s.currentAffairs, lang)}</h2>
            </div>
            <p className="mt-3 text-ink-700">{tr(dict.comingSoon.currentAffairs, lang)}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {caCategories.map((c) => (
                <li key={c.en} className="chip bg-canvas text-ink-700 ring-1 ring-ink-200">
                  {c[lang]}
                </li>
              ))}
            </ul>
            <Link href="/current-affairs" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-800">
              {tr(s.viewAll, lang)} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <FileClock className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="text-xl font-bold text-brand-900">{tr(s.previousPapers, lang)}</h2>
            </div>
            <p className="mt-3 text-ink-700">{tr(dict.comingSoon.previousPapers, lang)}</p>
            <p className="mt-3 text-sm text-ink-500">
              {lang === "hi" ? "तब तक, MPESB की आधिकारिक वेबसाइट पर पुराने प्रश्नपत्र उपलब्ध हैं:" : "Until then, MPESB publishes old question papers on its official website:"}
            </p>
            <a
              href="https://esb.mp.gov.in/Old_Question_Papers/old_question_papers.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-800"
            >
              MPESB — Old Question Papers <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* 12. Why TETTESTHUB + trust */}
      <section className="section" aria-labelledby="why-h">
        <div className="container-page">
          <SectionHeader id="why-h" title={tr(s.why, lang)} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dict.why.map((w, i) => {
              const Icon = whyIcons[i];
              return (
                <div key={w.title.en} className="card p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-700 text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-ink-900">{tr(w.title, lang)}</h3>
                  <p className="mt-1 text-sm text-ink-500">{tr(w.body, lang)}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-[var(--radius-card)] border border-brand-100 bg-brand-50 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-brand-900">{tr(s.sources, lang)}</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {site.officialSources.map((src) => (
                <li key={src.url}>
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="card card-hover flex h-full items-center justify-between gap-3 p-4">
                    <span>
                      <span className="block font-bold text-ink-900">{src.name}</span>
                      <span className="block text-xs text-ink-500">{tr(src.fullName, lang)}</span>
                    </span>
                    <ExternalLink className="h-4 w-4 shrink-0 text-ink-500" aria-hidden="true" />
                  </a>
                </li>
              ))}
              <li className="card flex items-center p-4 text-sm text-ink-700">
                {lang === "hi" ? "अन्य आधिकारिक विभाग (जहाँ लागू)" : "Other official departments (where applicable)"}
              </li>
            </ul>
            <p className="mt-5 text-sm font-medium text-ink-700">{tr(dict.disclaimer.affiliation, lang)}</p>
          </div>
        </div>
      </section>

      {/* 13. Latest notifications */}
      <section className="section bg-surface" aria-labelledby="notif-h">
        <div className="container-page">
          <SectionHeader id="notif-h" title={tr(s.notifications, lang)} href="/notifications" linkLabel={tr(s.viewAll, lang)} />
          <ul className="card">
            {notifications.map((n) => (
              <NotificationItem key={n.id} n={n} lang={lang} />
            ))}
          </ul>
        </div>
      </section>

      {/* 14. FAQ */}
      <section className="section" aria-labelledby="faq-h">
        <div className="container-page max-w-3xl">
          <SectionHeader id="faq-h" title={tr(s.faq, lang)} href="/faq" linkLabel={tr(s.viewAll, lang)} />
          <FaqList faqs={faqs.slice(0, 6)} lang={lang} />
        </div>
      </section>

      {/* 15. CTA */}
      <section className="pb-4">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[var(--radius-card)] bg-gradient-to-r from-brand-800 to-brand-600 p-8 text-white sm:p-10 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">{tr(dict.cta.title, lang)}</h2>
              <p className="mt-2 max-w-xl text-brand-100">{tr(dict.cta.body, lang)}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/exams" className="btn-primary">
                {tr(dict.hero.ctaExams, lang)}
              </Link>
              <Link href="/exam-calendar" className="btn-ghost-light">
                {tr(dict.nav.calendar, lang)}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureRow({ items }: { items: { Icon: typeof Timer; text: string }[] }) {
  return (
    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
      {items.map(({ Icon, text }) => (
        <li key={text} className="flex items-center gap-2 text-sm text-ink-700">
          <Icon className="h-4 w-4 text-brand-600" aria-hidden="true" />
          {text}
        </li>
      ))}
    </ul>
  );
}
