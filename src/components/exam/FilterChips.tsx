import Link from "next/link";

export interface ChipOption {
  value: string;
  label: string;
}

/**
 * Server-rendered filter chips driven by URL search params. Works without
 * JavaScript and every filtered view has a shareable URL.
 */
export function FilterChips({
  label,
  param,
  options,
  current,
  params,
  basePath,
  allLabel,
}: {
  label: string;
  param: string;
  options: ChipOption[];
  current?: string;
  params: Record<string, string | undefined>;
  basePath: string;
  allLabel: string;
}) {
  const hrefFor = (value?: string) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v && k !== param) q.set(k, v);
    if (value) q.set(param, value);
    const s = q.toString();
    return s ? `${basePath}?${s}` : basePath;
  };
  const chip = (active: boolean) =>
    `inline-flex min-h-9 items-center rounded-full px-3.5 text-sm font-semibold transition-colors ${
      active ? "bg-brand-700 text-white" : "bg-surface text-ink-700 ring-1 ring-ink-200 hover:ring-brand-500"
    }`;
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="w-24 shrink-0 text-sm font-semibold text-ink-500">{label}</span>
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link href={hrefFor(undefined)} className={chip(!current)} aria-current={!current ? "true" : undefined} scroll={false}>
            {allLabel}
          </Link>
        </li>
        {options.map((o) => (
          <li key={o.value}>
            <Link href={hrefFor(o.value)} className={chip(current === o.value)} aria-current={current === o.value ? "true" : undefined} scroll={false}>
              {o.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
