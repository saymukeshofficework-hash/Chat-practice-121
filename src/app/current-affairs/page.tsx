import { SectionLanding } from "@/components/ui/SectionLanding";
import { dict, tr } from "@/i18n/dictionary";
import { getLang } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "MP Current Affairs 2026 \u2014 Madhya Pradesh GK & Daily Current Affairs",
  description: "Madhya Pradesh and national current affairs for MPPSC, MPESB and other MP exams: economy, polity, science, sports, awards, appointments and government schemes.",
  path: "/current-affairs",
});

export default async function Page() {
  const lang = await getLang();
  return (
    <SectionLanding
      lang={lang}
      path="/current-affairs"
      title={tr(dict.nav.currentAffairs, lang)}
      subtitle={tr({ hi: "मध्यप्रदेश, राष्ट्रीय एवं अंतरराष्ट्रीय करेंट अफेयर्स", en: "MP, national and international current affairs" }, lang)}
      message={tr(dict.comingSoon.currentAffairs, lang)}
      notifySubject="current-affairs launch"
      categories={[
        { hi: "मध्यप्रदेश करेंट अफेयर्स", en: "MP Current Affairs" },
        { hi: "राष्ट्रीय", en: "India" },
        { hi: "अंतरराष्ट्रीय", en: "World" },
        { hi: "अर्थव्यवस्था", en: "Economy" },
        { hi: "राजव्यवस्था", en: "Polity" },
        { hi: "विज्ञान", en: "Science" },
        { hi: "खेल", en: "Sports" },
        { hi: "पुरस्कार", en: "Awards" },
        { hi: "नियुक्तियाँ", en: "Appointments" },
        { hi: "सरकारी योजनाएँ", en: "Government Schemes" },
        { hi: "मध्यप्रदेश महत्वपूर्ण तथ्य", en: "Important MP Facts" }
      ]}
      officialLinks={[
        
      ]}
    />
  );
}
