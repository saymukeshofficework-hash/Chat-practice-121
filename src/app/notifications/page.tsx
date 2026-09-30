import { FilterChips } from "@/components/exam/FilterChips";
import { NotificationItem } from "@/components/exam/NotificationItem";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState, PageHeader } from "@/components/ui/Primitives";
import { dict, tr } from "@/i18n/dictionary";
import { getLang } from "@/i18n/server";
import { getNotifications } from "@/lib/repo";
import { pageMeta } from "@/lib/seo";
import type { NotificationType } from "@/types";

export const metadata = pageMeta({
  title: "MP Exam Notifications 2026 — MPESB & MPPSC Latest Updates",
  description: "Latest official notices from MPESB and MPPSC: new recruitments, application dates, date changes, admit cards, answer keys and results.",
  path: "/notifications",
});

type SP = Promise<{ type?: string }>;

export default async function NotificationsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const lang = await getLang();
  const all = await getNotifications();
  const list = sp.type ? all.filter((n) => n.type === sp.type) : all;
  const types = Object.keys(dict.notificationType) as NotificationType[];

  return (
    <>
      <PageHeader
        title={tr(dict.nav.notifications, lang)}
        subtitle={lang === "hi" ? "MPESB और MPPSC की आधिकारिक सूचनाएँ — स्रोत लिंक सहित" : "Official notices from MPESB and MPPSC — with source links"}
      >
        <Breadcrumbs items={[{ label: tr(dict.nav.home, lang), href: "/" }, { label: tr(dict.nav.notifications, lang), href: "/notifications" }]} />
      </PageHeader>
      <div className="container-page py-8">
        <div className="card p-4 sm:p-5">
          <FilterChips
            label={lang === "hi" ? "प्रकार" : "Type"}
            param="type"
            basePath="/notifications"
            params={sp}
            current={sp.type}
            allLabel={tr(dict.calendar.all, lang)}
            options={types.map((t) => ({ value: t, label: tr(dict.notificationType[t], lang) }))}
          />
        </div>
        <div className="mt-6">
          {list.length ? (
            <ul className="card">
              {list.map((n) => (
                <NotificationItem key={n.id} n={n} lang={lang} />
              ))}
            </ul>
          ) : (
            <EmptyState title={lang === "hi" ? "इस प्रकार की कोई सूचना नहीं" : "No notices of this type yet"} />
          )}
        </div>
        <p className="mt-6 text-xs text-ink-500">{tr(dict.disclaimer.info, lang)}</p>
      </div>
    </>
  );
}
