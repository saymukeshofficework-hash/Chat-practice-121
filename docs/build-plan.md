# Shiksha.buzz — Build Plan

Nov 21, 2026 · MUKESH DAHIYA

> **For the coding agent (Codex or similar):** This is the product and content plan. Build the site described in "Content architecture", "Page templates", "Tech stack" and "SEO plan". Do not copy text, solutions, diagrams or PDFs from LearnCBSE or any other site. Use placeholder sample content clearly marked as sample until real reviewed content is added. Open questions at the end of the Summary are still unanswered; where they matter, make the choice configurable.

## Repository and handover

- **GitHub repository:** `Chat-practice-121` (owner: `saymukeshofficework-hash`). Codex builds the first version here; Claude Code continues later on the same repo. The owner confirmed that this is the repository referred to as `chat121` in the original plan.
- Save this plan in the repo as `docs/build-plan.md`. Both tools follow it as the source of truth.
- Work on branches and open pull requests; keep `main` deployable.
- Write a `README.md` with how to install, run locally, build and deploy, and a short `docs/handover.md` listing what is done, what is pending and any known issues, so the next tool can pick up without guessing.
- Keep content (Markdown/MDX + JSON questions) separate from code, under `content/class-{n}/{subject}/{chapter-slug}/`.
- Never commit secrets (API keys, Razorpay keys, `.env`). Use `.env.example` with placeholder names only.

## Summary

Shiksha.buzz should launch as a narrow, high-quality CBSE/NCERT library for Classes 9 and 10 (Maths and Science first), then widen to Classes 6 to 12. Its edge over LearnCBSE-style sites is not page count but the loop **read a short explanation → try an interactive question → see the worked answer → continue into a timed test**. Ads pay for traffic; test series and premium practice pay for the business.

The first 12 months aim for about 1,500 carefully checked pages, a working free-to-paid funnel, and a clear read on which subjects earn organic clicks. Traffic and revenue figures in this plan are scenarios, not forecasts.

**Caveats carried from the competitor report**

- LearnCBSE's ~9.42M monthly visits and ~21.95M pageviews are third-party model estimates (Semrush-type tools), not server data. Its revenue is unknown.
- Screenshots studied are historical Scribd captures (2020 to 2025), not live pages. Ad layouts may have changed.
- Nothing from any competitor is copied. Structure ideas are fine; text, solutions, diagrams and PDFs must be written from scratch.

**Open questions**

- How should Shiksha.buzz relate to TETTESTHUB? This plan assumes a separate student brand that reuses TETTESTHUB's test engine and accounts.
- Language at launch: English only, or English + Hindi medium from day one?
- Budget ceiling for the first 6 months.

## Goals and audience

The goal is a trusted free study site that turns search visitors into registered learners and some of them into paying test-series users.

| Audience | What they search for | What Shiksha.buzz gives them |
| --- | --- | --- |
| Class 9–10 students (core) | "class 10 maths chapter 3 exercise 3.2 solutions", "polynomials MCQ" | Exercise-level solutions, MCQs with explanations, chapter tests |
| Class 11–12 students | Notes, derivations, important questions, sample papers | Concise notes, solved PYQs, timed board-pattern papers |
| Class 6–8 students and parents | New NCERT books (e.g. Ganita Prakash) solutions | Simple step-by-step answers, parent-friendly worksheets |
| Teachers and tutors | Worksheets, question banks, test papers | Printable sets, later a paid teacher pack |

**12-month goals (targets, not promises)**

1. Publish ~1,500 reviewed pages across Class 9–10 Maths and Science, then Class 11–12 and 6–8.
2. Reach 25,000 registered learners.
3. Validate one paid product (board-exam test series) with at least 2% conversion of active registered users.
4. Keep pages fast: all key templates pass Core Web Vitals on mobile.

## Content architecture and URL structure

The site is a strict four-level tree (class → subject → chapter → resource), and every resource page ends in a test. Short, lowercase, hyphenated URLs mirror the tree so breadcrumbs, sitemaps and internal links fall out of it automatically.

```text
Home                         shiksha.buzz/
 └─ Class hub (6 to 12)      /class-10/
     └─ Subject hub          /class-10/maths/
         └─ Chapter hub      /class-10/maths/polynomials/
             ├─ Solutions
             ├─ Notes
             ├─ MCQs
             ├─ Important Qs
             └─ Chapter test
                  ↓ (all five lead to)
     Timed mock test → free signup → paid series
```

Each chapter hub is the canonical page for that chapter; resource pages link up to it and sideways to each other.

| Page type | URL pattern | Example |
| --- | --- | --- |
| Class hub | `/class-{n}/` | `/class-10/` |
| Subject hub | `/class-{n}/{subject}/` | `/class-10/maths/` |
| Chapter hub | `/class-{n}/{subject}/{chapter-slug}/` | `/class-10/maths/polynomials/` |
| Exercise solutions | `.../{chapter-slug}/exercise-{x}/` | `/class-10/maths/polynomials/exercise-2-1/` |
| Notes | `.../{chapter-slug}/notes/` | `/class-10/science/light/notes/` |
| MCQs | `.../{chapter-slug}/mcq/` | `/class-10/science/light/mcq/` |
| Important questions | `.../{chapter-slug}/important-questions/` | `/class-10/maths/polynomials/important-questions/` |
| Sample papers | `/class-{n}/{subject}/sample-papers/{year}-set-{k}/` | `/class-10/maths/sample-papers/2027-set-1/` |
| Previous-year papers | `/class-{n}/{subject}/pyq/{year}/` | `/class-12/physics/pyq/2026/` |
| Hindi medium | `/hi/` prefix, same tree | `/hi/class-10/maths/polynomials/` |
| Tests (app) | `/test/{id}/` (noindex) | `/test/c10-poly-01/` |

**Rules**

- Chapter slugs use the textbook chapter name, not its number, so re-numbering in a new syllabus does not break URLs. The number lives in the title.
- One URL per intent. No separate "PDF" pages; a download button sits on the HTML page.
- Board-only content (RD Sharma, RS Aggarwal) waits until the NCERT tree is complete, and uses only original solutions to publicly listed exercise numbers.

## Page templates and mobile-first UX

Six templates cover the whole site, and every one is designed for a 360 px phone first. The competitor screenshots show weak spots to avoid: a long generic intro before any answer, ads between the title and content, and sidebars of 25+ unrelated links.

| Template | Above the fold (phone) | Body | Bottom |
| --- | --- | --- | --- |
| Home | Search box, class chips 6–12, "Continue where you left" | Popular chapters, exam countdown, latest sample papers | Trust block (who writes, how we check) |
| Class / subject hub | Breadcrumb, subject or chapter list with progress ticks | Short syllabus note with session and source link | Sample papers, PYQs, full-syllabus test |
| Chapter hub | Chapter title, 2-line summary, resource tabs (Solutions, Notes, MCQs, Important Qs, Test) | Key formulas or concepts card, exercise list | Related chapters, "Take chapter test" |
| Solution page | Question 1 visible without scrolling, exercise switcher | Each question: statement → steps → final answer box → "common mistake" note; diagrams as SVG | Prev/next exercise, 5-question quick check |
| MCQ / practice page | First question live, tap to answer | Instant feedback with explanation, score bar | "Try timed test" CTA, signup to save score |
| Notes page | Table of contents, reading time | Short sections, diagrams, formula boxes, mind map | Download printable version (signup), MCQ link |

**UX rules**

- Answer first: the intro is at most two sentences. No keyword-stuffed paragraphs.
- Sticky bottom bar on phones: "Practice this chapter" and search.
- Maths rendered with KaTeX (server-side), never images of equations.
- Breadcrumbs on every page; exercise switcher as horizontal chips.
- Dark mode, font-size toggle, and offline-readable pages (PWA cache) for patchy mobile data.
- Hindi medium uses Noto Sans Devanagari with the same layout.
- Ads never sit between the question and its answer, never look like a button, and never appear inside tests.

## Tech stack and hosting

Use a static-first site generated from structured content, with a small app layer for tests and accounts. Static HTML on a CDN is the cheapest way to get fast pages at millions of views, and structured content (not free-form blog posts) is what makes 1,500+ pages consistent and checkable.

| Layer | Choice | Why |
| --- | --- | --- |
| Front end | Next.js (static export + incremental regeneration) or Astro | Pre-rendered HTML, small JS, good Core Web Vitals |
| Content store | Git-based Markdown/MDX + JSON question files, or a headless CMS (Sanity / Strapi) once writers join | Version history, review by pull request, bulk edits when the syllabus changes |
| Questions and tests | Reuse TETTESTHUB's test engine and question bank if its stack allows; otherwise Supabase (Postgres + auth) | One account and one question bank across both brands |
| Maths and diagrams | KaTeX at build time, SVG diagrams | Crisp on phones, no image-of-text |
| Search | Pagefind (static) at launch, Typesense/Algolia later | Instant search without a server |
| Hosting and CDN | Cloudflare Pages or Vercel; images on Cloudflare R2 | Indian edge locations, low cost at scale |
| Analytics | Google Search Console, GA4, Microsoft Clarity | Queries, funnels, scroll and rage-click maps |
| Payments | Razorpay (UPI, cards) | Standard for Indian students and parents |
| Ads | AdSense first, then a managed ad partner at scale, loaded lazily | Ads must not hurt LCP or CLS |

Budget: roughly ₹2,000–₹8,000 per month for hosting, domain, email and tools in year one (estimate). Costs rise with test-taking traffic, not page views.

## SEO plan

Win long-tail chapter and exercise queries first, where big sites often serve thin or outdated pages, then build up to subject and class head terms. A new domain will take 6 to 12 months to rank for head terms like "NCERT solutions class 10".

**Keywords, by tier**

| Tier | Example queries | Page that targets it | When |
| --- | --- | --- | --- |
| Exercise long tail | "class 10 maths exercise 2.1 solutions", "polynomials ex 2.2 q3" | Exercise solutions | Month 1 onward |
| Chapter practice | "light class 10 MCQ", "polynomials important questions" | MCQ, Important Qs | Month 1 onward |
| New-syllabus gaps | "Ganita Prakash class 7 chapter 1 solutions", newly revised NCERT books | Chapter hubs for new books | As soon as books release |
| Exam season | "class 10 maths sample paper 2027", "CBSE PYQ 2026" | Sample papers, PYQ | Sep–Feb each year |
| Head terms | "NCERT solutions class 10 maths" | Subject hub | Month 6+ |

Keyword research: Search Console data from month 2, plus Google autocomplete, "People also ask" and a paid tool (Semrush or Ahrefs) for volume. Prioritise by volume × weakness of the current top results.

**On-page**

- Title pattern: `{Chapter} Class {n} {Resource} | {Exercise} | Shiksha.buzz`, under 60 characters where possible.
- One H1 per page; each question as an H3 so Google can link to it.
- Meta descriptions written per hub; templated with real numbers for exercise pages ("All 6 questions of Exercise 2.1 solved step by step").
- "Last checked against the 2026–27 syllabus" date and reviewer name on every page.

**Internal linking**

- Up: breadcrumbs. Down: hub lists. Sideways: the five resource tabs on every chapter page. Next: previous/next exercise and chapter.
- Contextual links inside explanations ("uses the identity from Chapter 2").
- No sitewide sidebar of unrelated links; it dilutes link value and distracts.

**Structured data (JSON-LD)**

- `BreadcrumbList` on every page; `Organization` and `WebSite` (with search) on home.
- `Quiz` / `Question` markup on practice pages; `LearningResource` on notes.
- Avoid `FAQPage` for solutions; Google restricts its rich results.

**Technical and Core Web Vitals**

- Targets on mobile at the 75th percentile: LCP < 2.5 s, INP < 200 ms, CLS < 0.1.
- Reserve fixed space for every ad slot to keep CLS near zero; lazy-load ads below the first screen.
- XML sitemaps split by class; canonical tags on every page; `noindex` on tests, search results and thin tag pages.
- Hindi pages use `hreflang` pairs with their English twins.

**Authority**

- Author and reviewer pages showing real teaching credentials (helps trust signals).
- Earn links from school blogs, teacher communities and YouTube descriptions with free printable worksheets; no bought links.

## Content production and QA workflow

Every page passes two human checks before it goes live, and nothing is published faster than reviewers can check it. Accuracy is the product; one wrong answer shared in a class WhatsApp group costs more trust than ten new pages earn.

**Workflow per chapter**

1. **Syllabus lock.** Check the current CBSE curriculum PDF and the NCERT textbook edition for the session; record the source and date in the chapter file. Note deleted or added topics.
2. **Brief.** Editor lists the pages for the chapter (exercises, notes, MCQ set, important questions) and the target queries.
3. **Write.** Subject writer solves every question independently, in original words, using the house template. AI may draft explanations or distractors, but a writer must re-solve and rewrite every item.
4. **Solve-check.** A second subject expert solves each question blind and compares final answers. Any mismatch goes back to step 3.
5. **Edit.** Language, formatting, KaTeX, diagrams, internal links, title and meta.
6. **Plagiarism and duplication check.** Run a plagiarism tool against the web; run an internal similarity check so no two Shiksha.buzz pages are near-duplicates.
7. **Publish** with reviewer name and "last checked" date.
8. **Feedback loop.** "Report an error" button on every question; fixes within 48 hours; monthly review of pages with high bounce or many reports.

**Quality rules**

- No thin pages: an exercise page has every question solved; an MCQ page has at least 15 questions with explanations; otherwise merge it into the chapter hub.
- No spun or copied content from LearnCBSE, other sites, or paid guides. NCERT questions may be quoted for solving; solutions, notes, MCQs and diagrams are original.
- No mass-produced pages for keyword variants; one page per real intent.
- Annual syllabus sweep each April, and an immediate sweep when CBSE issues a circular.

**Throughput assumptions**

One trained writer produces about 4–6 finished exercise or MCQ pages a day; one reviewer checks about 10–15. With 3 writers and 2 reviewers that is roughly 250–300 pages a month at full speed (estimate to test in month 1).

## Monetization (scenario estimates)

Ads alone will earn little in year one; paid test series is the stronger lever because one paying student is worth thousands of page views. All numbers below are illustrative scenarios built from assumed traffic, RPM and conversion. They are not forecasts, and LearnCBSE's own revenue is not known.

**Channels, in order of launch**

1. **Free tier (month 0):** all notes, solutions, MCQs. Signup (free) unlocks saved progress, printable PDFs and full-length tests.
2. **Display ads (month 3–4, after ~200 pages and steady traffic):** AdSense, maximum 3 slots per page, none in tests. Move to a managed ad partner past ~1M monthly pageviews.
3. **Paid test series (month 6, before board-exam season):** chapter tests free; full-length board-pattern mocks, analytics and answer-writing feedback paid. Powered by the TETTESTHUB engine.
4. **Affiliate (month 6+):** reference books, stationery, tablets; clearly labelled.
5. **Later:** school/teacher licences, sponsored scholarship tests, ad-free premium.

Ad formula (page RPM = publisher earnings per 1,000 pageviews):

```
Monthly ad revenue = (monthly pageviews / 1000) × page RPM
```

**Ad revenue scenarios (per month)**

| Scenario | Month 12 pageviews | Assumed RPM | Month 12 ad revenue | Month 24 pageviews | Assumed RPM | Month 24 ad revenue |
| --- | --- | --- | --- | --- | --- | --- |
| Low | 1 lakh | ₹30 | ₹3,000 | 5 lakh | ₹40 | ₹20,000 |
| Base | 5 lakh | ₹50 | ₹25,000 | 30 lakh | ₹60 | ₹1,80,000 |
| High | 15 lakh | ₹80 | ₹1,20,000 | 80 lakh | ₹90 | ₹7,20,000 |

For scale: even the High month-24 case is about a third of the modelled LearnCBSE pageviews (~2.2 crore a month, itself an estimate).

**Test-series scenarios (per year)**

| Scenario | Registered users | Paid buyers | Avg price | Year revenue |
| --- | --- | --- | --- | --- |
| Year 1 Low | 10,000 | 100 (1%) | ₹399 | ₹39,900 |
| Year 1 Base | 25,000 | 500 (2%) | ₹399 | ₹1,99,500 |
| Year 2 Base | 1,00,000 | 2,000 (2%) | ₹499 | ₹9,98,000 |
| Year 2 High | 2,50,000 | 7,500 (3%) | ₹499 | ₹37,42,500 |

All figures are gross, before payment fees (~2%), GST (18% on digital services) and costs. RPM in Indian education is seasonal: expect it to rise Oct–Mar and fall in May–Jun.

## Phased roadmap

Four phases over 12 months, each opened only when the previous gate is met, so quality never trails volume. Month 0 is December 2026; the first board season (Feb–Mar 2027) is too close for a paid product, so it is used to earn search visibility with free sample papers.

| Phase | Dates | Work | Gate to move on |
| --- | --- | --- | --- |
| 0 · Foundation | Dec 2026 – Jan 2027 | Domain, stack, templates, QA checklist, TETTESTHUB link-up; first 50 Class 10 Maths pages (both checks passed); Search Console, GA4, sitemaps live | 50 pages with zero open errors; Core Web Vitals pass |
| 1 · Class 10 core | Feb – Apr 2027 | Class 10 Maths and Science complete (~400 pages); sample papers and PYQs for Feb–Mar 2027 boards; free chapter tests and signup live | 300+ pages indexed; impressions rising month on month |
| 2 · Widen and earn | May – Aug 2027 | Class 9 and 11–12 Maths, Physics, Chemistry, Biology; AdSense on (max 3 slots/page); labelled affiliate links; ~900 pages total; free worksheets to earn links | Ads keep Core Web Vitals green; 3%+ of practice users sign up |
| 3 · Board season | Sep – Dec 2027 | **Paid board-exam test series on the TETTESTHUB engine** (month 9); 2028 sample papers; Class 6–8 new books; Hindi pilot; ~1,500 pages; year-one review | — |

If a gate is missed, the next phase waits and the team fixes the cause (accuracy, speed, indexing) instead of adding pages.

**Milestone checklist**

- [ ] Domain, hosting, analytics and Search Console set up
- [ ] House templates and QA checklist signed off
- [ ] First 50 Class 10 Maths pages live
- [ ] Class 10 Maths and Science complete
- [ ] Free chapter tests linked to the TETTESTHUB engine
- [ ] AdSense approved and live
- [ ] Paid test series on sale
- [ ] 1,500 pages and year-one review

## Team and cost

A lean year one costs roughly ₹6–8 lakh if you run product and editing yourself and pay freelancers per page; a fully staffed team costs about ₹2.7 lakh a month. Rates are Indian market estimates to confirm with real quotes.

| Role | Lean model (year 1) | Staffed model (per month) | Notes |
| --- | --- | --- | --- |
| Founder / product owner | You | You | Priorities, gates, TETTESTHUB integration |
| Subject writers (Maths, Science) | Freelance, ~₹200–300 per finished page | 3 × ~₹30,000 | Trained on house template; paid only after review passes |
| Subject reviewers | Freelance, ~₹80–120 per page | 2 × ~₹40,000 | Practising teachers; name shown on pages |
| Editor / SEO lead | You, part-time | ~₹40,000 | Titles, links, schema, Search Console |
| Developer | You or contract build ~₹1–1.5 lakh one-off | ~₹50,000 | Templates, test-engine link, performance |
| Hosting, tools, plagiarism checker | ~₹60,000 a year | ~₹8,000 | Grows with test traffic |

Lean year-one content cost: 1,500 pages × ~₹350 (write + review) ≈ ₹5.25 lakh, plus tools and a contract build. The staffed model only makes sense once ad and test revenue cover at least half of it.

## Risks and metrics

The biggest risks are slow rankings on a new domain and Google's AI answers taking clicks from simple solution queries; interactive practice and tests are the hedge because a summary cannot replace them.

| Risk | Impact | Mitigation |
| --- | --- | --- |
| New domain ranks slowly | Low traffic for 6–12 months | Long-tail and new-syllabus pages first; share free worksheets with teachers and on YouTube |
| AI Overviews answer simple questions | Fewer clicks on solution pages | Lean on practice, tests and progress tracking that need a visit |
| Wrong answers published | Lost trust, bad reviews | Blind double-solve, error button, 48-hour fix target |
| Copyright complaint | Pages removed | Only original solutions and diagrams; no competitor or guide text; legal check on how much NCERT text is quoted |
| Syllabus change (new NCERT books, CBSE circulars) | Pages go stale | Name-based slugs, April sweep, "last checked" dates |
| Google core updates hit thin content | Sitewide ranking drop | No thin or near-duplicate pages; prune weak pages quarterly |
| Ads hurt speed and trust | Lower rankings and returns | Max 3 slots, reserved space, none in tests |
| Seasonality (traffic dips May–Jun) | Uneven cash flow | Summer bridge courses and next-class previews |

**Metrics to track**

| Area | Metric | Source | Month 12 target (base) |
| --- | --- | --- | --- |
| Reach | Organic clicks, impressions, average position by page type | Search Console | Rising each month outside May–Jun |
| Engagement | Pages per session, scroll depth, practice starts per 100 visits | GA4, Clarity | 2+ pages per session; 15 practice starts per 100 visits |
| Quality | Error reports per 1,000 views, time to fix | Error button log | Under 1; fixed within 48 h |
| Speed | LCP, INP, CLS at 75th percentile on mobile | Search Console CWV report | All key templates "Good" |
| Funnel | Signup rate of practice users, test completion rate | App analytics | 3% signup; 60% completion |
| Revenue | Page RPM, paid conversion, revenue per registered user | AdSense, Razorpay | Track against the scenarios above |

**Next steps this week**

- [ ] Answer the three open questions in the Summary (TETTESTHUB link, language, budget)
- [ ] Register Shiksha.buzz with Search Console and set up hosting
- [ ] Pick two Class 10 Maths chapters as the pilot and recruit one writer and one reviewer
