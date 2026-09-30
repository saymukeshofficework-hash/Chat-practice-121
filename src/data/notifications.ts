import type { ExamNotification } from "@/types";

const CHECKED = "2026-09-30";
const ESB = "https://esb.mp.gov.in/";
const ESB_APPLY = "https://esb.mponline.gov.in/Portal/Examinations/Vyapam/examsList.aspx";

/** Only notices actually seen on the official websites. */
export const notifications: ExamNotification[] = [
  {
    id: "n-psc-sfs-main-key",
    type: "ANSWER_KEY",
    title: {
      hi: "राज्य वन सेवा मुख्य परीक्षा 2026 — प्रावधिक उत्तर कुंजी जारी",
      en: "State Forest Service Main Exam 2026 — provisional answer key released",
    },
    organization: "MPPSC",
    examSlug: "mppsc-state-forest-service-2026",
    publishedOn: "2026-09-29",
    officialUrl: "https://mppsc.mp.gov.in/uploads/files/Provisional_Answer_Key_SFS_Main_Exam_2026_Dated_29_09_2026.pdf",
    source: { label: "MPPSC", url: "https://mppsc.mp.gov.in/", checkedOn: CHECKED },
  },
  {
    id: "n-psc-ap-english-result",
    type: "RESULT",
    title: {
      hi: "सहायक प्राध्यापक (अंग्रेजी) परीक्षा 2025 — लिखित परीक्षा परिणाम",
      en: "Assistant Professor (English) Exam 2025 — written exam result",
    },
    organization: "MPPSC",
    publishedOn: "2026-09-28",
    officialUrl: "https://mppsc.mp.gov.in/uploads/files/Written_Exam_Result_Assistant_Professor_English_Exam_2025_Dated_28_09_2026.pdf",
    source: { label: "MPPSC", url: "https://mppsc.mp.gov.in/", checkedOn: CHECKED },
  },
  {
    id: "n-esb-asi-open",
    type: "APPLICATION_OPEN",
    title: {
      hi: "सूबेदार (शीघ्रलेखक) एवं ASI भर्ती परीक्षा 2026 — ऑनलाइन आवेदन 24.09.2026 से",
      en: "Subedar (Steno) & ASI Recruitment Test 2026 — online applications from 24.09.2026",
    },
    organization: "MPESB",
    examSlug: "mp-subedar-steno-asi-2026",
    publishedOn: "2026-09-24",
    officialUrl: ESB_APPLY,
    source: { label: "MPESB", url: ESB, checkedOn: CHECKED },
  },
  {
    id: "n-esb-constable-open",
    type: "APPLICATION_OPEN",
    title: {
      hi: "पुलिस आरक्षक (जी.डी.) भर्ती परीक्षा 2026 — ऑनलाइन आवेदन 22.09.2026 से",
      en: "Police Constable (G.D.) Recruitment Test 2026 — online applications from 22.09.2026",
    },
    organization: "MPESB",
    examSlug: "mp-police-constable-2026",
    publishedOn: "2026-09-22",
    officialUrl: ESB_APPLY,
    source: { label: "MPESB", url: ESB, checkedOn: CHECKED },
  },
  {
    id: "n-esb-nt-open",
    type: "APPLICATION_OPEN",
    title: {
      hi: "नायब तहसीलदार विभागीय भर्ती परीक्षा 2026 — ऑनलाइन आवेदन 17.09.2026 से",
      en: "Nayab Tahsildar Departmental Test 2026 — online applications from 17.09.2026",
    },
    organization: "MPESB",
    examSlug: "mp-nayab-tahsildar-2026",
    publishedOn: "2026-09-17",
    officialUrl: ESB_APPLY,
    source: { label: "MPESB", url: ESB, checkedOn: CHECKED },
  },
  {
    id: "n-esb-tet-extension",
    type: "DATE_CHANGE",
    title: {
      hi: "शिक्षक पात्रता परीक्षा 2026 — आवेदन की अंतिम तिथि 05.10.2026 तक बढ़ाई गई",
      en: "Teacher Eligibility Test 2026 — last date to apply extended to 05.10.2026",
    },
    organization: "MPESB",
    examSlug: "mp-tet-2026",
    officialUrl: ESB_APPLY,
    source: { label: "MPESB / MPOnline", url: ESB_APPLY, checkedOn: CHECKED },
  },
  {
    id: "n-esb-g2sg4-admit",
    type: "ADMIT_CARD",
    title: {
      hi: "समूह-2 उपसमूह-4 भर्ती परीक्षा 2026 — प्रवेश पत्र एवं परीक्षा तिथि सूचना",
      en: "Group-2 Sub Group-4 Recruitment Test 2026 — admit card & exam-date notice",
    },
    organization: "MPESB",
    examSlug: "mp-group-2-sub-group-4-2026",
    officialUrl: ESB,
    source: { label: "MPESB", url: ESB, checkedOn: CHECKED },
  },
];
