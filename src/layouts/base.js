import { esc, each, jsonScript, oneLine } from '../lib/html.js';
import { site, build, abs } from '../lib/data.js';
import { header } from '../components/header.js';
import { footer } from '../components/footer.js';

const FONT_URL = 'https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700;800&display=swap';

/**
 * Wraps a page body in the full HTML document with all SEO / social / LLM discovery tags.
 * page: { path, title, description, body, jsonld[], noindex, ogType, hasMarkdown, file }
 */
export const layout = (page) => {
  const url = abs(page.path);
  const title = oneLine(page.title);
  const description = oneLine(page.description);
  const noindex = page.noindex || build.noindex;
  const robots = noindex
    ? 'noindex,nofollow'
    : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
  const ogImage = abs(page.ogImage || site.ogImage);
  const graph = page.jsonld?.length ? `<script type="application/ld+json">${jsonScript({ '@context': 'https://schema.org', '@graph': page.jsonld })}</script>` : '';

  return `<!doctype html>
<html lang="${esc(site.lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${robots}">
${page.isNotFound ? '' : `<link rel="canonical" href="${esc(url)}">
<link rel="alternate" hreflang="en-KE" href="${esc(url)}">
<link rel="alternate" hreflang="x-default" href="${esc(url)}">`}
<meta name="theme-color" content="${esc(site.themeColor)}">
<meta name="author" content="${esc(site.legalName)}">
${site.verification.google ? `<meta name="google-site-verification" content="${esc(site.verification.google)}">` : ''}
${site.verification.bing ? `<meta name="msvalidate.01" content="${esc(site.verification.bing)}">` : ''}
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable summary of ${esc(site.name)}">
${page.hasMarkdown ? `<link rel="alternate" type="text/markdown" href="${esc(page.path + 'index.md')}" title="Markdown version of this page">` : ''}
<meta property="og:type" content="${esc(page.ogType || 'website')}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="${esc(site.locale)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(site.ogImageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(ogImage)}">
<meta name="twitter:image:alt" content="${esc(site.ogImageAlt)}">
${graph}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONT_URL}">
<link rel="stylesheet" href="${esc(build.assets.css)}">
<script src="${esc(build.assets.js)}" defer></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header(page.path)}
<main id="main" tabindex="-1">
${page.body}
</main>
${footer()}
</body>
</html>
`;
};
