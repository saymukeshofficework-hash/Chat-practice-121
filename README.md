# Shiksha.buzz

A CBSE study library for Classes 9 and 10 with worked examples, notes, interactive practice, and timed chapter-test demos. The Astro app lives in `apps/shiksha/`. This repository also contains the Next.js Exam Hub and existing GitHub Pages site at its root.

## Install and run locally

Use Node.js 22.12 or later and npm. From the repository root:

```sh
cd apps/shiksha
npm ci
npm run dev
```

Open the address printed by Astro. The development server renders lessons and exercises. To exercise Pagefind and offline reading, build and use the production preview:

```sh
npm run build
npm run verify
npm run preview
```

A Hindi preview can be built with `ENABLE_HINDI=true npm run build`.

## Content

Add chapter content in `content/class-{n}/{subject}/{chapter-slug}/` at the repository root. Chapter slugs stay stable across syllabus revisions.

| File | Purpose |
| --- | --- |
| `index.md` | Chapter title, short summary, `chapterNumber`, `testId`, and formulas or key concepts |
| `exercise-2-1.md` | Worked exercise with level-three question headings, steps, answer blocks, and common mistakes |
| `notes.md` | Notes with level-two headings used to generate the contents list |
| `mcq.md` | Practice title and description |
| `important-questions.md` | Subjective questions with worked answers |
| `questions.json` | `practice` and `timed` arrays plus the timed test length in `minutes`. Each question has an ID, prompt, choices, zero-based `correct` index, and explanation |
| `*-hi.md`, `questions-hi.json` | Hindi translations at matching `/hi/` routes when enabled |

Add a sample paper under `content/class-{n}/{subject}/sample-papers/{year}-set-{k}.md` or a reviewed previous-year paper under `content/class-{n}/{subject}/pyq/{year}.md`. Both use the subject paper template. Put inline maths in `$...$` and display maths in a separate `$$...$$` block.

Mark drafts `status: sample`. Switch to `status: reviewed` after the checks in the [build plan](docs/build-plan.md). The `review` block requires `session`, official `source` URL, `writer`, independent `reviewer` and `checkedOn` in YYYY-MM-DD format. Reviewed MCQ pages require at least 15 questions. Keep exercise drafts original and verify all exercise numbers, statements and solutions against the reviewed edition before publication.

Optional profiles live at `content/people/{slug}.json` with `name`, `role`, `credentials` (an array of strings), and `biography`. Set `review.writerProfile` or `review.reviewerProfile` to the slug to link to a matching real person.

## Configure and deploy

Production output is `apps/shiksha/dist` with static HTML, XML sitemaps, Pagefind and a service worker. In Cloudflare Pages or Vercel, connect this repository with the entire checkout available to the build so Astro can read the root `content/` directory. Use Node 22.12+, the build command below from the repository root, and publish `apps/shiksha/dist`:

```sh
npm --prefix apps/shiksha ci && npm --prefix apps/shiksha run build && npm --prefix apps/shiksha run verify
```

Serve at the root of a dedicated preview hostname first. Set `SITE_URL` to that hostname for preview canonical URLs. The existing GitHub Pages workflow owns the live domain. A future cutover needs an inventory of existing paths and a routing or redirects plan before moving the hostname. See the [handover](docs/handover.md).

Copy `apps/shiksha/.env.example` to `.env` **inside the app directory** for local overrides. Leave unused settings unset.

| Setting | Behavior |
| --- | --- |
| `SITE_URL` | Canonical origin, default `https://shiksha.buzz` |
| `ENABLE_INDEXING` | Defaults to `false`. Enabling it includes eligible reviewed content and its hubs in sitemaps. Samples and app routes retain `noindex` |
| `ENABLE_HINDI` | Defaults to `false`. Enables the Hindi tree and language links when a counterpart exists |
| `ACADEMIC_SESSION`, `SCHOOL_CURRICULUM_URL` | Session label and CBSE curriculum link |
| `EXAM_NAME`, `EXAM_DATE` | Optional countdown using an ISO date in Asia/Kolkata |
| `REPORT_EMAIL` | Optional recipient for error reports. With no recipient, the page offers a downloadable draft |
| `TEST_ENGINE`, `TETTESTHUB_TEST_URL` | Defaults to `local`. With `tettesthub`, supply an HTTPS test URL containing `{id}`. Use chapter `engineTestId` to map a different external ID |
| `TETTESTHUB_SIGNUP_URL`, `TETTESTHUB_SERIES_URL` | Optional HTTPS signup and series destinations |
| `SEARCH_CONSOLE_VERIFICATION`, `PUBLIC_GA4_ID`, `PUBLIC_CLARITY_ID` | Optional provider configuration. Analytics are disabled by default and require opt-in when configured |

For the existing Exam Hub at the repository root, use its original `npm ci`, `npm run dev`, and `npm run build` commands. Its static Pages deployment is defined in `.github/workflows/pages.yml`.

See the [build plan](docs/build-plan.md) and [handover](docs/handover.md) before expanding or releasing the library.
