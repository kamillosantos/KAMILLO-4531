import { useEffect } from "react";
import { site } from "../lib/site";

type SeoProps = {
  title: string;
  description?: string;
  keywords?: string[];
  path?: string;
  type?: "website" | "article";
  jsonLd?: object | object[];
  noindex?: boolean;
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const MANAGED_LD_ID = "seo-managed-jsonld";

export function Seo({
  title,
  description = site.defaultDescription,
  keywords = site.keywords,
  path = "/",
  type = "website",
  jsonLd,
  noindex = false,
}: SeoProps) {
  useEffect(() => {
    const canonical = `${site.url}${path === "/" ? "/" : path}`;

    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", keywords.join(", "));
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    upsertLink("canonical", canonical);

    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:site_name", site.fullName);
    upsertMeta("property", "og:locale", "pt_BR");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);

    // Managed JSON-LD (page-specific). Base graph stays in index.html.
    const prev = document.getElementById(MANAGED_LD_ID);
    if (prev) prev.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = MANAGED_LD_ID;
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    window.scrollTo(0, 0);
  }, [title, description, keywords, path, type, jsonLd, noindex]);

  return null;
}
