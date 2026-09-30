import type { Metadata } from "next";
import { site } from "./site";

/** Consistent per-page metadata: title, description, canonical, OG, Twitter. */
export function pageMeta({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = `${site.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url, siteName: site.name, type, locale: "hi_IN", alternateLocale: ["en_IN"] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/icon.svg`,
  description: site.seo.description,
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  inLanguage: ["hi-IN", "en-IN"],
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${site.url}/search?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
});
