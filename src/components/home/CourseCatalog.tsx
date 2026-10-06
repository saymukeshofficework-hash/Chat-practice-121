"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import type { Lang } from "@/types";

/** Minimal course catalogue (same look as the tettesthub.in homepage). */

type Course = {
  f: string[];
  tone: string;
  art: "book" | "test" | "combo";
  kick: string;
  big: string;
  sub: string[];
  isNew?: boolean;
  tags: string[];
  meta: [string, string];
  title: string;
  desc: string;
  price: number;
  mrp?: number;
  href: string;
};

const TONES: Record<string, string> = {
  teal: "bg-[#0f766e] text-white",
  ink: "bg-[#1f2937] text-white",
  amber: "bg-[#f2c46d] text-[#2a1f08]",
  indigo: "bg-[#3f4a9a] text-white",
  sage: "bg-[#dfe9df] text-[#1f3326]",
};

const COURSES = (lang: Lang): Course[] => {
  const hi = lang === "hi";
  return [
    {
      f: ["new", "notes"], tone: "teal", art: "book", isNew: true,
      kick: "MP हाई कोर्ट • 1174 पद", big: "सहायक ग्रेड-3 नोट्स", sub: ["हिंदी", "343 पेज", "18 अध्याय"],
      tags: hi ? ["MP हाई कोर्ट", "नया कोर्स"] : ["MP High Court", "New"], meta: [hi ? "PDF" : "PDF", hi ? "तुरंत डाउनलोड" : "Instant download"],
      title: "MP हाई कोर्ट सहायक ग्रेड-3 2026 — संपूर्ण नोट्स (हिंदी PDF)",
      desc: "✅ पूरा आधिकारिक सिलेबस ✅ सभी 5 विषय ✅ परीक्षा-केंद्रित भाषा ✅ भुगतान के तुरंत बाद डाउनलोड",
      price: 299, href: "/mp-high-court-assistant-grade-3-notes",
    },
    {
      f: ["new", "tests"], tone: "ink", art: "test", isNew: true,
      kick: hi ? "आधिकारिक पैटर्न • 100 प्रश्न • 120 मिनट" : "Official pattern • 100 Qs • 120 min", big: hi ? "20 फुल मॉक टेस्ट" : "20 Full Mock Tests",
      sub: [hi ? "हिंदी / English" : "Hindi / English", hi ? "टेस्ट 1 फ्री" : "Test 1 free"],
      tags: hi ? ["MP हाई कोर्ट", "टेस्ट सीरीज़"] : ["MP High Court", "Test series"], meta: [hi ? "टेस्ट" : "Tests", hi ? "20 · 2,000 प्रश्न" : "20 · 2,000 questions"],
      title: hi ? "MP हाई कोर्ट सहायक ग्रेड-3 — टेस्ट सीरीज़ (20 मॉक टेस्ट)" : "MP High Court Assistant Grade-3 — Test Series (20 mock tests)",
      desc: hi ? "✅ असली ऑनलाइन परीक्षा जैसी स्क्रीन ✅ हिंदी/English टॉगल ✅ तुरंत रिज़ल्ट ✅ हर प्रश्न की व्याख्या" : "✅ Real online-exam screen ✅ Hindi/English toggle ✅ Instant result ✅ Explanation for every question",
      price: 199, href: "/mp-high-court-assistant-grade-3-test-series",
    },
    {
      f: ["new", "notes", "tests"], tone: "amber", art: "combo", isNew: true,
      kick: hi ? "सबसे ज़्यादा फ़ायदा" : "Best value", big: hi ? "कॉम्बो: नोट्स + 20 टेस्ट" : "Combo: Notes + 20 Tests", sub: [hi ? "₹49 की बचत" : "Save ₹49"],
      tags: hi ? ["MP हाई कोर्ट", "कॉम्बो"] : ["MP High Court", "Combo"], meta: [hi ? "शामिल" : "Includes", hi ? "PDF नोट्स + टेस्ट सीरीज़" : "PDF notes + test series"],
      title: hi ? "MP हाई कोर्ट AG-3 कॉम्बो — PDF नोट्स + 20 मॉक टेस्ट" : "MP High Court AG-3 Combo — PDF notes + 20 mock tests",
      desc: hi ? "✅ हिंदी या English नोट्स चुनें ✅ पूरी 20 टेस्ट सीरीज़ ✅ पढ़ें, फिर टेस्ट से जाँचें" : "✅ Choose Hindi or English notes ✅ Full 20-test series ✅ Study, then test yourself",
      price: 449, mrp: 498, href: "/mp-high-court-assistant-grade-3-notes#buy",
    },
    {
      f: ["notes"], tone: "indigo", art: "book",
      kick: "MP High Court • 1174 posts", big: "Assistant Grade-3 Notes", sub: ["English", "324 pages", "18 chapters"],
      tags: ["MP High Court", "English"], meta: ["PDF", "Instant download"],
      title: "MP High Court Assistant Grade-3 2026 — Complete Notes (English PDF)",
      desc: "✅ Full official syllabus ✅ All 5 subjects ✅ Exam-focused ✅ Download right after payment",
      price: 299, href: "/mp-high-court-assistant-grade-3-notes?lang=en",
    },
    {
      f: ["tests", "free"], tone: "sage", art: "test",
      kick: hi ? "बिना भुगतान" : "No payment", big: hi ? "फ्री मॉक टेस्ट 1" : "Free Mock Test 1", sub: [hi ? "100 प्रश्न" : "100 Qs", hi ? "120 मिनट" : "120 min", "हिंदी / English"],
      tags: hi ? ["MP हाई कोर्ट", "फ्री"] : ["MP High Court", "Free"], meta: [hi ? "समय" : "Time", hi ? "120 मिनट" : "120 minutes"],
      title: hi ? "MP हाई कोर्ट AG-3 — फ्री फुल मॉक टेस्ट (टेस्ट 1)" : "MP High Court AG-3 — Free full mock test (Test 1)",
      desc: hi ? "✅ असली पैटर्न पर 100 प्रश्न ✅ तुरंत रिज़ल्ट और खंड-वार विश्लेषण ✅ हर प्रश्न की व्याख्या" : "✅ 100 questions on the real pattern ✅ Instant section-wise result ✅ Explanations",
      price: 0, href: "/mock-tests/ag3/test.html?t=01",
    },
  ];
};

function Art({ kind }: { kind: Course["art"] }) {
  if (kind === "book")
    return (
      <svg className="absolute -right-3 -bottom-4 w-[46%]" viewBox="0 0 120 90" aria-hidden="true">
        <rect x="22" y="14" width="62" height="74" rx="6" fill="rgba(255,255,255,.22)" />
        <rect x="32" y="6" width="62" height="74" rx="6" fill="rgba(255,255,255,.9)" />
        <rect x="42" y="20" width="40" height="5" rx="2.5" fill="currentColor" opacity=".55" />
        <rect x="42" y="32" width="32" height="4" rx="2" fill="currentColor" opacity=".3" />
        <rect x="42" y="42" width="38" height="4" rx="2" fill="currentColor" opacity=".3" />
        <rect x="42" y="52" width="26" height="4" rx="2" fill="currentColor" opacity=".3" />
      </svg>
    );
  return (
    <svg className="absolute -right-3 -bottom-4 w-[46%]" viewBox="0 0 120 90" aria-hidden="true">
      {kind === "combo" ? <rect x="16" y="16" width="56" height="70" rx="6" fill="rgba(255,255,255,.85)" /> : null}
      <rect x={kind === "combo" ? 50 : 28} y="8" width={kind === "combo" ? 62 : 70} height="80" rx="8" fill="rgba(255,255,255,.92)" />
      <g fill="currentColor" opacity=".5">
        <circle cx={kind === "combo" ? 63 : 42} cy="26" r="4" />
        <circle cx={kind === "combo" ? 63 : 42} cy="44" r="4" />
        <circle cx={kind === "combo" ? 63 : 42} cy="62" r="4" />
      </g>
      <g fill="currentColor" opacity=".22">
        <rect x={kind === "combo" ? 71 : 52} y="23" width="30" height="5" rx="2.5" />
        <rect x={kind === "combo" ? 71 : 52} y="41" width="25" height="5" rx="2.5" />
        <rect x={kind === "combo" ? 71 : 52} y="59" width="28" height="5" rx="2.5" />
      </g>
    </svg>
  );
}

export function CourseCatalog({ lang }: { lang: Lang }) {
  const courses = useMemo(() => COURSES(lang), [lang]);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const chips: [string, string][] = lang === "hi"
    ? [["all", "सभी"], ["new", "नए कोर्स"], ["notes", "PDF नोट्स"], ["tests", "टेस्ट सीरीज़"], ["free", "फ्री"]]
    : [["all", "All"], ["new", "New"], ["notes", "PDF notes"], ["tests", "Test series"], ["free", "Free"]];
  const shown = courses.filter((c) => {
    const okF = filter === "all" || c.f.includes(filter);
    const hay = [c.title, c.big, c.kick, c.desc, ...c.tags, ...c.sub].join(" ").toLowerCase();
    return okF && (!q.trim() || hay.includes(q.trim().toLowerCase()));
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
          {chips.map(([k, label]) => (
            <button key={k} type="button" onClick={() => setFilter(k)} aria-pressed={filter === k}
              className={`shrink-0 rounded-full border px-4 py-2 text-[15px] transition-colors ${filter === k ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 bg-surface text-ink-900 hover:border-ink-300"}`}>
              {label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 rounded-full border border-ink-200 bg-surface px-4 py-2 sm:w-72">
          <Search className="h-4 w-4 text-ink-500" aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} type="search" aria-label={lang === "hi" ? "कोर्स खोजें" : "Search courses"}
            placeholder={lang === "hi" ? "कोर्स खोजें…" : "Search courses…"} className="w-full bg-transparent text-sm outline-none" />
        </label>
      </div>

      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => {
          const external = c.href.endsWith(".html") || c.href.includes(".html?");
          const inner = (
            <>
              <div className={`relative flex aspect-[16/9] flex-col justify-between overflow-hidden p-5 ${TONES[c.tone]}`}>
                {c.isNew ? <span className="absolute top-4 right-4 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-extrabold text-ink-900">NEW</span> : null}
                <div>
                  <p className="text-[11.5px] font-bold tracking-wide uppercase opacity-85">{c.kick}</p>
                  <p className="mt-1 max-w-[75%] text-2xl leading-tight font-extrabold">{c.big}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.sub.map((s) => (
                    <span key={s} className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">{s}</span>
                  ))}
                </div>
                <Art kind={c.art} />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <span key={t} className="rounded-md border border-ink-200 bg-canvas px-2.5 py-0.5 text-xs text-ink-500">{t}</span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-ink-500">
                  {c.meta[0]}: <b className="font-semibold text-ink-900">{c.meta[1]}</b>
                </p>
                <p className="mt-2 text-lg leading-snug font-bold text-ink-900">{c.title}</p>
                <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">{c.desc}</p>
                <div className="mt-auto flex items-center justify-between border-t border-ink-200 pt-4">
                  <span className="text-2xl font-extrabold text-ink-900">
                    {c.price ? `₹${c.price}` : <span className="text-brand-700">{lang === "hi" ? "फ्री" : "Free"}</span>}
                    {c.mrp ? <s className="ml-1.5 text-base font-medium text-ink-500">₹{c.mrp}</s> : null}
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-900 text-white" aria-hidden="true">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </>
          );
          const cls = "flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-surface transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]";
          return (
            <li key={c.title}>
              {external ? <a href={`${base}${c.href}`} className={cls}>{inner}</a> : <Link href={c.href} className={cls}>{inner}</Link>}
            </li>
          );
        })}
      </ul>
      {shown.length === 0 ? <p className="py-10 text-center text-ink-500">{lang === "hi" ? "कुछ नहीं मिला।" : "Nothing found."}</p> : null}
    </div>
  );
}
