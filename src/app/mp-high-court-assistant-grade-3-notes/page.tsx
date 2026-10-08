import { notFound } from "next/navigation";
import { SimpleNotesLanding } from "@/components/landing/SimpleNotesLanding";
import { JsonLd } from "@/components/ui/Primitives";
import { getLang } from "@/i18n/server";
import { getExamBySlug, getNoteBySlug } from "@/lib/repo";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

const PATH = "/mp-high-court-assistant-grade-3-notes";

export const metadata = pageMeta({
  title: "MP High Court Assistant Grade-3 Notes 2026 — Hindi & English PDF ₹299",
  description:
    "MP हाई कोर्ट सहायक ग्रेड-3 (1174 पद) परीक्षा के लिए हिंदी और English PDF नोट्स सिर्फ़ ₹299 में। Exam-focused notes for MP High Court Assistant Grade-3 2026, secure payment by Razorpay.",
  path: PATH,
  image: "/og/mphc-assistant-grade-3-notes.png",
});

export default async function Page() {
  const [lang, exam, hi, en] = await Promise.all([
    getLang(),
    getExamBySlug("mp-high-court-assistant-grade-3-2026"),
    getNoteBySlug("mp-high-court-assistant-grade-3-notes-hindi"),
    getNoteBySlug("mp-high-court-assistant-grade-3-notes-english"),
  ]);
  if (!exam) notFound();

  const notifyHref = site.contact.whatsapp || site.contact.telegram || "/contact?subject=";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { q: "MP High Court Assistant Grade-3 notes ki keemat kitni hai?", a: "Hindi PDF aur English PDF — dono ₹299 pratyek." },
      { q: "How much do the MP High Court Assistant Grade-3 notes cost?", a: "Hindi PDF and English PDF — ₹299 each." },
      { q: "How do I pay?", a: "Payment is through Razorpay — UPI, debit/credit card, net banking or wallets." },
    ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  const live = [hi, en].filter((n) => n?.status === "AVAILABLE" && n.paymentUrl);
  const productSchemas = live.map((n) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: n!.title.en,
    description: n!.shortDescription.en,
    brand: { "@type": "Brand", name: site.name },
    offers: { "@type": "Offer", price: n!.price.amount, priceCurrency: "INR", availability: "https://schema.org/InStock", url: `${site.url}${PATH}` },
  }));

  return (
    <>
      <SimpleNotesLanding exam={exam} notes={{ hi, en }} initialLang={lang} notifyHref={notifyHref} />
      <JsonLd data={faqSchema} />
      {productSchemas.map((p, i) => (
        <JsonLd key={i} data={p} />
      ))}
    </>
  );
}
