import { TestSeriesLanding } from "@/components/landing/TestSeriesLanding";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "MP High Court Assistant Grade-3 Test Series 2026 — 20 Mock Tests ₹199",
  description:
    "MP हाई कोर्ट सहायक ग्रेड-3 टेस्ट सीरीज़: 20 फुल मॉक टेस्ट, 2,000 प्रश्न, हिंदी/English, हर प्रश्न की व्याख्या — सिर्फ़ ₹199, टेस्ट 1 फ्री। 20 full mock tests on the official pattern for ₹199.",
  path: "/mp-high-court-assistant-grade-3-test-series",
});

export default function Page() {
  return <TestSeriesLanding />;
}
