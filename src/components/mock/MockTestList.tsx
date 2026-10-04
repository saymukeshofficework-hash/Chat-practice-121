"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, FileText, Lock, PlayCircle } from "lucide-react";
import { AG3_MOCK } from "@/data/mockTests";

type Lang = "hi" | "en";
type Best = { last: number; best: number; total: number; at: number };

const T = {
  title: { hi: "MP हाई कोर्ट सहायक ग्रेड-III — 20 फुल मॉक टेस्ट", en: "MP High Court Assistant Grade-III — 20 Full Mock Tests" },
  sub: {
    hi: "आधिकारिक पैटर्न (विज्ञापन 614/परीक्षा/2026) पर आधारित, हमारे नोट्स से बने प्रश्न। हिंदी/English दोनों में।",
    en: "Built on the official pattern (advt. 614/Exam/2026) with questions from our notes. In Hindi and English.",
  },
  pattern: { hi: "परीक्षा पैटर्न", en: "Exam pattern" },
  rows: {
    hi: [
      ["सामान्य ज्ञान + सामान्य अध्ययन (म.प्र. सहित)", "20", "हिंदी/English"],
      ["गणित + तार्किक क्षमता", "20", "हिंदी/English"],
      ["सामान्य हिंदी", "20", "हिंदी"],
      ["अंग्रेज़ी ज्ञान", "20", "English"],
      ["कंप्यूटर ज्ञान", "20", "English"],
    ],
    en: [
      ["GK + GS (incl. M.P.)", "20", "Hindi/English"],
      ["Maths + Logical Reasoning", "20", "Hindi/English"],
      ["General Hindi", "20", "Hindi"],
      ["English", "20", "English"],
      ["Computer Knowledge", "20", "English"],
    ],
  },
  total: { hi: "कुल 100 प्रश्न · 100 अंक · 120 मिनट · प्रत्येक प्रश्न 1 अंक", en: "Total 100 questions · 100 marks · 120 minutes · 1 mark each" },
  neg: {
    hi: "आधिकारिक विज्ञापन में ऋणात्मक अंकन का उल्लेख नहीं है, इसलिए इन टेस्ट में अंक नहीं कटते।",
    en: "The official advertisement does not mention negative marking, so none is applied in these tests.",
  },
  test: { hi: "मॉक टेस्ट", en: "Mock Test" },
  start: { hi: "टेस्ट शुरू करें", en: "Start test" },
  again: { hi: "फिर से दें", en: "Retake" },
  soon: { hi: "जल्द उपलब्ध", en: "Coming soon" },
  best: { hi: "सर्वश्रेष्ठ", en: "Best" },
  meta: { hi: "100 प्रश्न · 120 मिनट", en: "100 Qs · 120 min" },
};

export function MockTestList() {
  const [lang, setLang] = useState<Lang>("hi");
  const [best, setBest] = useState<Record<number, Best>>({});
  useEffect(() => {
    try {
      const q = new URLSearchParams(location.search).get("lang");
      const l = (q || localStorage.getItem("testhub_lang_pref")) as Lang | null;
      if (l === "en" || l === "hi") setLang(l);
      const m: Record<number, Best> = {};
      for (let i = 1; i <= AG3_MOCK.total; i++) {
        const v = localStorage.getItem(`testhub_ag3_mock_${String(i).padStart(2, "0")}`);
        if (v) m[i] = JSON.parse(v);
      }
      setBest(m);
    } catch {
      /* ignore */
    }
  }, []);
  const switchLang = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem("testhub_lang_pref", l);
    } catch {
      /* ignore */
    }
  };
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const t = (k: keyof typeof T) => (T[k] as Record<Lang, string>)[lang];

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-900 sm:text-3xl">{t("title")}</h1>
          <p className="mt-2 max-w-2xl text-ink-600">{t("sub")}</p>
        </div>
        <div className="inline-flex shrink-0 rounded-full border border-ink-200 bg-white p-0.5 text-sm font-semibold" role="group" aria-label="भाषा / Language">
          {(["hi", "en"] as Lang[]).map((l) => (
            <button key={l} type="button" onClick={() => switchLang(l)} aria-pressed={lang === l}
              className={`rounded-full px-3 py-1 ${lang === l ? "bg-brand-700 text-white" : "text-ink-700"}`}>
              {l === "hi" ? "हिंदी" : "English"}
            </button>
          ))}
        </div>
      </div>

      <section className="card mt-6 overflow-x-auto p-5" aria-labelledby="pat-h">
        <h2 id="pat-h" className="font-bold text-ink-900">{t("pattern")}</h2>
        <table className="mt-3 w-full text-sm">
          <tbody>
            {T.rows[lang].map(([a, b, c]) => (
              <tr key={a} className="border-t border-ink-100">
                <td className="py-2 pr-3 font-medium text-ink-900">{a}</td>
                <td className="px-3 py-2">{b}</td>
                <td className="py-2 pl-3 text-ink-600">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-sm font-semibold text-ink-800">{t("total")}</p>
        <p className="mt-1 text-xs text-ink-500">{t("neg")}</p>
      </section>

      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: AG3_MOCK.total }, (_, i) => i + 1).map((n) => {
          const ready = AG3_MOCK.ready.includes(n);
          const b = best[n];
          const href = `${base}${AG3_MOCK.enginePath}?t=${String(n).padStart(2, "0")}&lang=${lang}`;
          return (
            <li key={n} className="card flex flex-col p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-ink-900">
                  {t("test")} {n}
                </h3>
                {b ? <CheckCircle2 className="h-5 w-5 text-success-700" aria-hidden="true" /> : null}
              </div>
              <p className="mt-1 flex items-center gap-3 text-xs text-ink-500">
                <span className="inline-flex items-center gap-1"><FileText className="h-3.5 w-3.5" aria-hidden="true" />{t("meta")}</span>
              </p>
              {b ? (
                <p className="mt-2 text-sm text-ink-700">
                  {t("best")}: <b>{b.best}</b> / {b.total}
                </p>
              ) : null}
              <div className="mt-auto pt-4">
                {ready ? (
                  <a href={href} className="btn-primary w-full">
                    <PlayCircle className="h-4 w-4" aria-hidden="true" />
                    {b ? t("again") : t("start")}
                  </a>
                ) : (
                  <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-canvas px-3 py-2 text-sm font-semibold text-ink-500 ring-1 ring-ink-200">
                    <Lock className="h-4 w-4" aria-hidden="true" />
                    {t("soon")}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
