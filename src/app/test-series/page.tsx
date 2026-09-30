import { SectionLanding } from "@/components/ui/SectionLanding";
import { dict, tr } from "@/i18n/dictionary";
import { getLang } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "MP Exam Test Series 2026 \u2014 MPESB, MPPSC, Police, TET Mock Tests",
  description: "Online test series for Madhya Pradesh exams \u2014 MPPSC, MPESB, MP TET, Police, Group 1\u20134, Teacher, Nursing and Technical. Launching soon.",
  path: "/test-series",
});

export default async function Page() {
  const lang = await getLang();
  return (
    <SectionLanding
      lang={lang}
      path="/test-series"
      title={tr(dict.nav.testSeries, lang)}
      subtitle={tr({ hi: "परीक्षा पैटर्न पर आधारित ऑनलाइन टेस्ट सीरीज़", en: "Online test series built on the real exam pattern" }, lang)}
      message={tr(dict.comingSoon.testSeries, lang)}
      notifySubject="test-series launch"
      categories={[
        { hi: "MPPSC", en: "MPPSC" },
        { hi: "MPESB", en: "MPESB" },
        { hi: "TET", en: "TET" },
        { hi: "पुलिस", en: "Police" },
        { hi: "समूह 1", en: "Group 1" },
        { hi: "समूह 2", en: "Group 2" },
        { hi: "समूह 3", en: "Group 3" },
        { hi: "समूह 4", en: "Group 4" },
        { hi: "शिक्षक", en: "Teacher" },
        { hi: "नर्सिंग", en: "Nursing" },
        { hi: "तकनीकी", en: "Technical" }
      ]}
      officialLinks={[
        
      ]}
    />
  );
}
