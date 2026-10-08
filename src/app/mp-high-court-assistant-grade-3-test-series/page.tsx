import { MockTestList } from "@/components/mock/MockTestList";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "MP High Court Assistant Grade-3 Mock Test 2026 — 20 Full Tests",
  description:
    "MP हाई कोर्ट सहायक ग्रेड-3 2026 के 20 फुल मॉक टेस्ट — हिंदी/English, 100 प्रश्न, 120 मिनट, परिणाम और व्याख्या के साथ। टेस्ट 1 फ्री।",
  path: "/mp-high-court-assistant-grade-3-test-series",
});

export default function Page() {
  return <MockTestList series="ag3" />;
}
