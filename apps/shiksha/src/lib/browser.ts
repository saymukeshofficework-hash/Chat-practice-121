import { PUBLIC_CLARITY_ID, PUBLIC_GA4_ID } from 'astro:env/client';

function read(key: string) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function save(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* Preferences still work for this page. */ }
}

const root = document.documentElement;
const theme = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
const large = document.querySelector<HTMLButtonElement>('[data-size-toggle]');
const hi = root.lang === 'hi';

if (theme) {
  const system = matchMedia('(prefers-color-scheme: dark)');
  const dark = () => root.dataset.theme ? root.dataset.theme === 'dark' : system.matches;
  const sync = () => theme.setAttribute('aria-pressed', String(dark()));
  theme.addEventListener('click', () => {
    root.dataset.theme = dark() ? 'light' : 'dark';
    save('shiksha-theme', root.dataset.theme);
    sync();
  });
  system.addEventListener('change', sync);
  sync();
}
large?.setAttribute('aria-pressed', String(root.dataset.large === 'true'));
large?.addEventListener('click', () => {
  root.dataset.large = String(root.dataset.large !== 'true');
  save('shiksha-large', root.dataset.large);
  large.setAttribute('aria-pressed', root.dataset.large);
});

const visited = read('shiksha-last-lesson');
const resume = document.querySelector<HTMLAnchorElement>('[data-resume]');
if (resume && visited && /^\/(?:hi\/)?class-\d+\/[a-z\d-]+\/[a-z\d-]+\/(?:[a-z\d-]+\/)?$/.test(visited)) {
  resume.href = visited;
  const chapter = read('shiksha-last-title');
  if (chapter) resume.textContent = hi ? `आगे पढ़ें · ${chapter}` : `Continue · ${chapter}`;
  resume.hidden = false;
}
const lesson = document.querySelector<HTMLElement>('[data-lesson]');
if (lesson) {
  save('shiksha-last-lesson', location.pathname);
  save('shiksha-last-title', lesson.dataset.lesson ?? '');
}
for (const marker of document.querySelectorAll<HTMLElement>('[data-progress]')) {
  if (read(`shiksha-complete:${marker.dataset.progress}`) === 'true') marker.hidden = false;
}
for (const link of document.querySelectorAll<HTMLAnchorElement>('[data-print]')) {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    window.print();
  });
}

for (const question of document.querySelectorAll<HTMLElement>('.worked h3, [data-report-question]')) {
  const email = document.body.dataset.reportEmail;
  const control = document.createElement('a');
  control.className = 'report';
  const text = `Shiksha.buzz · ${question.dataset.reportQuestion ?? question.textContent}\n${location.href.split('#')[0]}#${question.id}`;
  if (email) {
    control.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('Shiksha.buzz question report')}&body=${encodeURIComponent(text + '\n\n')}`;
    control.textContent = hi ? 'त्रुटि की सूचना दें' : 'Report an error';
  } else {
    control.href = URL.createObjectURL(new Blob([text + '\n\n'], { type: 'text/plain' }));
    control.download = 'shiksha-question-report.txt';
    control.textContent = hi ? 'त्रुटि की सूचना डाउनलोड करें' : 'Download error report draft';
  }
  question.insertAdjacentElement(question.matches('fieldset') ? 'beforeend' : 'afterend', control);
}

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/study-sw.js')
      .then(() => navigator.serviceWorker.ready)
      .then((registration) => registration.active?.postMessage({ studyPath: location.pathname }))
      .catch(() => {});
  });
}

const exam = document.querySelector<HTMLElement>('[data-exam-date]');
if (exam?.dataset.examDate) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const days = Math.round((Date.parse(exam.dataset.examDate) - Date.parse(today)) / 86400000);
  const result = exam.querySelector('[data-days]');
  if (result && days >= 0) result.textContent = days === 0 ? (hi ? 'आज' : 'Today') : (hi ? `${days} दिन शेष` : `${days} days left`);
}

// The analytics prompt is opt-in. Preview visitors receive no tracking scripts.
const analytics = document.querySelector<HTMLElement>('[data-analytics]');
const ids = { ga4: PUBLIC_GA4_ID, clarity: PUBLIC_CLARITY_ID };
if (analytics && (ids.ga4 || ids.clarity)) {
  function loadAnalytics() {
    if (ids.ga4 && /^G-[A-Z0-9]+$/.test(ids.ga4)) {
      const tracking = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
      tracking.dataLayer ??= [];
      tracking.gtag ??= function () { tracking.dataLayer?.push(arguments); };
      tracking.gtag('js', new Date());
      tracking.gtag('config', ids.ga4);
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ids.ga4}`;
      script.async = true;
      document.head.append(script);
    }
    if (ids.clarity && /^[a-zA-Z0-9]+$/.test(ids.clarity)) {
      const script = document.createElement('script');
      script.src = `https://www.clarity.ms/tag/${ids.clarity}`;
      script.async = true;
      document.head.append(script);
    }
  }
  const consent = read('shiksha-analytics');
  if (consent === 'yes') loadAnalytics();
  if (!consent) analytics.hidden = false;
  analytics.querySelector('[data-analytics-yes]')?.addEventListener('click', () => {
    save('shiksha-analytics', 'yes');
    analytics.hidden = true;
    loadAnalytics();
  });
  analytics.querySelector('[data-analytics-no]')?.addEventListener('click', () => {
    save('shiksha-analytics', 'no');
    analytics.hidden = true;
  });
}
