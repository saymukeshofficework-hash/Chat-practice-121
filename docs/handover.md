# Shiksha.buzz handover

## Implemented

- Isolated Astro app in `apps/shiksha/` and versioned chapter content in root `content/`. The existing Next.js Exam Hub and GitHub Pages deployment stay in place while the library is reviewed.
- English demos for five chapters across Classes 9 and 10 Maths and Science. Real Numbers and Polynomials are the two Class 10 Maths pilot chapters. Each chapter has worked examples, notes, MCQs, important questions and a local timed test. Includes one original sample paper and a reusable PYQ route.
- Build-time KaTeX and an original reflection SVG, Pagefind search, browser-local progress and preferences, and offline reading of visited library pages. The optional Hindi branch includes a Polynomials sample.
- Review metadata validation, minimum question count for reviewed MCQs, canonical URLs, breadcrumbs, structured data, multilingual alternates for indexable twins and class sitemaps. The preview defaults to noindex and excludes sample content from sitemaps.
- Configurable test-engine links, error reporting, exam countdown, Search Console and opt-in analytics. See the root README for settings and build commands.

## Pending

1. Confirm syllabus sources and editions, recruit writers and reviewers, and replace the five demo chapters with checked content. Apply the production checklist in [the build plan](build-plan.md).
2. Confirm the shared-account and test-engine contract with TETTESTHUB. The current adapter can link to mapped tests and signup. Shared sessions, score syncing, entitlements, gated PDFs, full-syllabus tests and payment remain future integration work.
3. Configure HTTPS preview hosting, approve a domain cutover plan for existing Exam Hub URLs and tools, then configure analytics, Search Console and error-report routing. Run mobile accessibility and field Core Web Vitals measurements after rollout.
4. Populate the author and reviewer profile template with real credentials, add official PYQs, reviewed Hindi content when approved, and the later advertising and monetization phases. The six-month budget is still open.

## Implementation limits

- Timed demo answers are present in static HTML and the timer resets when the page reloads. This makes the demo appropriate for practice. A production assessment needs server-issued questions, timing and scoring.
- Progress and reading position are stored in the device's browser. The print action can save a PDF in the browser, and an optional external signup URL supplies a link.
- Offline data is cached after a successful visit and can be cleared by a new deployment or browser storage eviction. Search and account activity require a connection.
- The Study Library takes the root path on its own host. Launching it on the production domain needs an explicit rollout and legacy URL migration.

## Verification

- `npm run verify` checks every generated HTML page for one H1, valid JSON-LD, canonical tags, resolving local links, and noindex on samples and app routes. It also checks the search index, worker manifest and pilot outputs.
- English and Hindi builds passed verification. A temporary reviewed fixture exercised class sitemaps, reciprocal hreflang, reviewer metadata, profile links, notes schema, and a mapped test-engine URL. The fixture was removed after the check.
- Chrome preview checks covered search, immediate MCQ scoring, timed submission, progress and the Hindi switch. Field Core Web Vitals and production offline behavior need measurement on the configured host.
- The existing Pages-style Next.js export built successfully. It reports a pre-existing hook-dependency warning in `src/components/mock/MockTestList.tsx`.
