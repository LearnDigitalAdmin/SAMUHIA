import { site, build, abs } from '../lib/data.js';

export const robotsTxt = () => {
  if (build.noindex) return `# Staging / preview build — do not index\nUser-agent: *\nDisallow: /\n`;
  const ai = site.aiCrawlers.map((ua) => `User-agent: ${ua}\nAllow: /\n`).join('\n');
  return `# ${site.name} — robots.txt
# Search engines and AI assistants are welcome. LLM-friendly summaries live at /llms.txt and /llms-full.txt

User-agent: *
Allow: /

# AI / LLM crawlers (explicitly allowed)
${ai}
Sitemap: ${abs('/sitemap.xml')}
`;
};
