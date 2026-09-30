/**
 * Data access layer. Every page reads content through these functions.
 *
 * Today they read the typed seed files in src/data. When the database lands
 * (Phase 6/7), only this file changes — function signatures stay the same.
 * Functions are async on purpose so that swap is transparent.
 */
import { categories } from "@/data/categories";
import { exams } from "@/data/exams";
import { faqs } from "@/data/faqs";
import { notes } from "@/data/notes";
import { notifications } from "@/data/notifications";
import { compareExams, examPhase } from "@/lib/dates";
import type { CategorySlug, Exam, ExamCategory, ExamNotification, Faq, NoteProduct } from "@/types";

export async function getExams(now = new Date()): Promise<Exam[]> {
  return [...exams].sort((a, b) => compareExams(a, b, now));
}

export async function getUpcomingExams(limit?: number, now = new Date()): Promise<Exam[]> {
  const list = (await getExams(now)).filter((e) => {
    const p = examPhase(e, now);
    return p !== "EXAM_COMPLETED" && p !== "AWAITING_UPDATE" && p !== "NOT_NOTIFIED";
  });
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export async function getPopularExams(): Promise<Exam[]> {
  return (await getExams()).filter((e) => e.popular);
}

export async function getExamBySlug(slug: string): Promise<Exam | undefined> {
  return exams.find((e) => e.slug === slug);
}

export async function getExamsByCategory(cat: CategorySlug): Promise<Exam[]> {
  return (await getExams()).filter((e) => e.category === cat);
}

export async function getRelatedExams(exam: Exam, limit = 4): Promise<Exam[]> {
  const all = await getExams();
  const same = all.filter((e) => e.id !== exam.id && e.category === exam.category);
  const others = all.filter((e) => e.id !== exam.id && e.category !== exam.category && e.organization === exam.organization);
  return [...same, ...others].slice(0, limit);
}

export async function getCategories(): Promise<ExamCategory[]> {
  return categories;
}

export async function getCategory(slug: string): Promise<ExamCategory | undefined> {
  return categories.find((c) => c.slug === slug);
}

export async function getNotes(): Promise<NoteProduct[]> {
  return notes;
}

export async function getFeaturedNotes(limit = 6): Promise<NoteProduct[]> {
  return notes.filter((n) => n.featured).slice(0, limit);
}

export async function getNoteBySlug(slug: string): Promise<NoteProduct | undefined> {
  return notes.find((n) => n.slug === slug);
}

export async function getNotesForExam(examSlug: string): Promise<NoteProduct[]> {
  return notes.filter((n) => n.examSlugs.includes(examSlug));
}

export async function getNotifications(limit?: number): Promise<ExamNotification[]> {
  // Notices with a known publish date first (newest), undated after.
  const sorted = [...notifications].sort((a, b) => (b.publishedOn ?? "").localeCompare(a.publishedOn ?? ""));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export async function getNotificationsForExam(examSlug: string): Promise<ExamNotification[]> {
  return (await getNotifications()).filter((n) => n.examSlug === examSlug);
}

export async function getFaqs(group?: Faq["group"]): Promise<Faq[]> {
  return group ? faqs.filter((f) => f.group === group) : faqs;
}

/* ------------------------------------------------------------------ search */

export type SearchHit =
  | { kind: "exam"; exam: Exam }
  | { kind: "note"; note: NoteProduct }
  | { kind: "category"; category: ExamCategory };

const norm = (s: string) => s.toLowerCase().normalize("NFC").replace(/[-_]/g, " ");

/** Simple token search across exams, notes and categories. */
export async function search(query: string): Promise<SearchHit[]> {
  const tokens = norm(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  const match = (hay: string) => {
    const h = norm(hay);
    return tokens.every((t) => h.includes(t));
  };
  const hits: SearchHit[] = [];
  for (const c of categories) {
    if (match([c.name.hi, c.name.en, c.description.hi, c.description.en, ...c.subcategories.flatMap((s) => [s.hi, s.en])].join(" "))) {
      hits.push({ kind: "category", category: c });
    }
  }
  for (const e of await getExams()) {
    if (match([e.name.hi, e.name.en, e.shortName, e.organization, e.category, e.slug].join(" "))) hits.push({ kind: "exam", exam: e });
  }
  for (const n of notes) {
    if (match([n.title.hi, n.title.en, n.subject.hi, n.subject.en, n.category, "notes नोट्स"].join(" "))) hits.push({ kind: "note", note: n });
  }
  return hits;
}
