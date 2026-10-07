"use client";

import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, CreditCard, Download, FileText, Languages, ShieldCheck } from "lucide-react";
import { buyNotes, checkout, downloadPath } from "@/lib/checkout";
import type { Exam, Lang, NoteProduct } from "@/types";

const T = {
  notes: { hi: "नोट्स", en: "Notes" },
  choose: { hi: "भाषा चुनें", en: "Choose language" },
  buy: { hi: "नोट्स खरीदें", en: "Buy notes" },
  soon: { hi: "जल्द उपलब्ध", en: "Coming soon" },
  wait: { hi: "कृपया प्रतीक्षा करें…", en: "Please wait…" },
  pattern: { hi: "परीक्षा एक नज़र में", en: "Exam at a glance" },
  what: { hi: "इन नोट्स में क्या मिलेगा", en: "What you get" },
  instant: { hi: "भुगतान के बाद तुरंत PDF डाउनलोड", en: "Instant PDF download after payment" },
  secure: { hi: "Razorpay द्वारा सुरक्षित भुगतान", en: "Secure payment by Razorpay" },
  already: { hi: "पहले खरीदा है? PDF डाउनलोड करें", en: "Already bought? Download PDF" },
  error: { hi: "भुगतान पूरा नहीं हुआ। कृपया दोबारा प्रयास करें।", en: "Payment didn't go through. Please try again." },
};

const t = (k: keyof typeof T, lang: Lang) => T[k][lang];

export function SimpleNotesLanding({
  exam,
  notes,
  initialLang,
}: {
  exam: Exam;
  notes: { hi?: NoteProduct; en?: NoteProduct };
  initialLang: Lang;
}) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [payState, setPayState] = useState<"idle" | "creating" | "open" | "verifying">("idle");
  const [payError, setPayError] = useState("");
  const [ownedToken, setOwnedToken] = useState<string | null>(null);
  const [canBuy, setCanBuy] = useState(false);

  const note = lang === "hi" ? notes.hi : notes.en;
  const product = note?.checkoutProduct;
  const secure = !!product;

  useEffect(() => {
    try {
      if (product) setOwnedToken(localStorage.getItem(`testhub_dl_${product}`));
    } catch {}
    if (product) {
      checkout<{ ready?: boolean }>({ action: "status", product })
        .then((r) => setCanBuy(!!r.ready))
        .catch(() => setCanBuy(false));
    } else {
      setCanBuy(false);
    }
  }, [product]);

  const buy = () => {
    if (!product || !canBuy) return;
    setPayError("");
    buyNotes(product, {
      onState: (s) => setPayState(s),
      onError: () => setPayError(t("error", lang)),
      onPaid: (token) => {
        setOwnedToken(token);
        setPayState("idle");
      },
    });
  };

  const topics = note?.topics?.slice(0, 8) ?? [];
  const title = note?.title?.[lang] ?? (lang === "hi" ? "MP हाई कोर्ट सहायक ग्रेड-3 नोट्स" : "MP High Court Assistant Grade-3 Notes");
  const description =
    note?.shortDescription?.[lang] ??
    (lang === "hi"
      ? "MP हाई कोर्ट सहायक ग्रेड-3 परीक्षा की तैयारी के लिए परीक्षा-केंद्रित PDF नोट्स।"
      : "Exam-focused PDF notes for MP High Court Assistant Grade-3 preparation.");

  return (
    <main className="container-page py-8 sm:py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-accent-700">MP HIGH COURT • ASSISTANT GRADE-3</p>
          <h1 className="mt-1 text-2xl font-extrabold text-brand-900 sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-ink-600">{description}</p>
        </div>
        <div className="inline-flex shrink-0 rounded-full border border-ink-200 bg-white p-0.5 text-sm font-semibold" role="group" aria-label="भाषा / Language">
          {(["hi", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`rounded-full px-3 py-1 ${lang === l ? "bg-brand-700 text-white" : "text-ink-700"}`}
            >
              {l === "hi" ? "हिंदी" : "English"}
            </button>
          ))}
        </div>
      </div>

      <section className="card mt-6 overflow-x-auto p-5" aria-labelledby="exam-facts">
        <h2 id="exam-facts" className="font-bold text-ink-900">{t("pattern", lang)}</h2>
        <table className="mt-3 w-full text-sm">
          <tbody>
            <tr className="border-t border-ink-100">
              <td className="py-2 pr-3 font-medium text-ink-900">{lang === "hi" ? "कुल पद" : "Total posts"}</td>
              <td className="px-3 py-2">{exam.posts ?? 1174}</td>
              <td className="py-2 pl-3 text-ink-600">{lang === "hi" ? "सहायक ग्रेड-3" : "Assistant Grade-3"}</td>
            </tr>
            <tr className="border-t border-ink-100">
              <td className="py-2 pr-3 font-medium text-ink-900">{lang === "hi" ? "परीक्षा" : "Exam"}</td>
              <td className="px-3 py-2">{lang === "hi" ? "ऑनलाइन प्रारंभिक परीक्षा" : "Online preliminary exam"}</td>
              <td className="py-2 pl-3 text-ink-600">{lang === "hi" ? "MCQ" : "MCQ"}</td>
            </tr>
            <tr className="border-t border-ink-100">
              <td className="py-2 pr-3 font-medium text-ink-900">{lang === "hi" ? "भाषा" : "Language"}</td>
              <td className="px-3 py-2">{lang === "hi" ? "हिंदी PDF" : "English PDF"}</td>
              <td className="py-2 pl-3 text-ink-600">{lang === "hi" ? "डिजिटल PDF" : "Digital PDF"}</td>
            </tr>
            <tr className="border-t border-ink-100">
              <td className="py-2 pr-3 font-medium text-ink-900">{lang === "hi" ? "कीमत" : "Price"}</td>
              <td className="px-3 py-2 font-bold">₹{note?.price.amount ?? 299}</td>
              <td className="py-2 pl-3 text-ink-600">{lang === "hi" ? "एक बार भुगतान" : "One-time payment"}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="card mt-6 flex flex-col gap-4 border-accent-100 bg-accent-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-ink-900">{lang === "hi" ? "PDF नोट्स अनलॉक करें" : "Unlock PDF notes"}</h2>
          <p className="mt-1 text-sm text-ink-600">{t("instant", lang)}</p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-500">
            <ShieldCheck className="h-4 w-4 text-success-700" aria-hidden="true" />
            {t("secure", lang)} • UPI / Card / Net banking
          </p>
        </div>
        <div className="shrink-0 sm:w-72">
          {ownedToken ? (
            <a href={downloadPath(ownedToken)} className="btn-primary w-full">
              <Download className="h-4 w-4" aria-hidden="true" />
              {t("already", lang)}
            </a>
          ) : secure ? (
            <button type="button" onClick={buy} disabled={!canBuy || payState !== "idle"} className="btn-primary w-full disabled:opacity-60">
              <CreditCard className="h-4 w-4" aria-hidden="true" />
              {payState !== "idle" ? t("wait", lang) : canBuy ? `${t("buy", lang)} — ₹${note?.price.amount ?? 299}` : t("soon", lang)}
            </button>
          ) : note?.paymentUrl ? (
            <a href={note.paymentUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
              <CreditCard className="h-4 w-4" aria-hidden="true" />
              {t("buy", lang)} — ₹{note.price.amount}
            </a>
          ) : (
            <span className="inline-flex w-full items-center justify-center rounded-lg bg-canvas px-3 py-2 text-sm font-semibold text-ink-500 ring-1 ring-ink-200">
              {t("soon", lang)}
            </span>
          )}
          {payError ? <p role="alert" className="mt-2 text-sm text-danger-700">{payError}</p> : null}
        </div>
      </section>

      <section className="mt-8" aria-labelledby="what">
        <h2 id="what" className="text-xl font-bold text-brand-900 sm:text-2xl">{t("what", lang)}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            [FileText, lang === "hi" ? "परीक्षा-केंद्रित PDF" : "Exam-focused PDF", lang === "hi" ? "सीधी और साफ़ भाषा में जरूरी सामग्री।" : "Clear, focused preparation material."],
            [Languages, lang === "hi" ? "हिंदी और English" : "Hindi & English", lang === "hi" ? "दोनों भाषाओं के अलग PDF उपलब्ध।" : "Separate PDFs for both languages."],
            [Download, lang === "hi" ? "तुरंत डाउनलोड" : "Instant download", lang === "hi" ? "भुगतान के बाद PDF प्राप्त करें।" : "Get the PDF after payment."],
            [BookOpen, lang === "hi" ? "मोबाइल फ्रेंडली" : "Mobile friendly", lang === "hi" ? "फोन, टैबलेट और कंप्यूटर पर पढ़ें।" : "Read on phone, tablet or computer."],
            [CheckCircle2, lang === "hi" ? "परीक्षा पर फोकस" : "Exam focused", lang === "hi" ? "तैयारी को सरल और व्यवस्थित रखें।" : "Keep preparation simple and structured."],
            [CreditCard, lang === "hi" ? "सुरक्षित भुगतान" : "Secure payment", lang === "hi" ? "Razorpay से UPI/कार्ड भुगतान।" : "Pay securely by UPI/card via Razorpay."],
          ].map(([Icon, heading, body], i) => {
            const C = Icon as typeof FileText;
            return (
              <div key={i} className="card p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <C className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 font-bold text-ink-900">{heading as string}</h3>
                <p className="mt-1 text-sm text-ink-500">{body as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      {topics.length ? (
        <section className="card mt-8 p-5" aria-labelledby="topics">
          <h2 id="topics" className="text-xl font-bold text-brand-900">{lang === "hi" ? "शामिल विषय" : "Topics covered"}</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {topics.map((topic) => (
              <li key={topic.en} className="rounded-lg bg-canvas px-3 py-2 text-sm text-ink-800 ring-1 ring-ink-100">
                {topic[lang]}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="mt-8 text-center text-xs text-ink-500">
        {lang === "hi" ? "नोट्स केवल अध्ययन सहायता के लिए हैं। आधिकारिक सूचना के लिए MP हाई कोर्ट की वेबसाइट देखें।" : "These notes are for study support. Check the official MP High Court website for official notices."}
      </p>
    </main>
  );
}
