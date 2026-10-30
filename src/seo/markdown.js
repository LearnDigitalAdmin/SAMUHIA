// Markdown "twins" of key pages, served at <page>/index.md and concatenated into llms-full.txt.
// Written for LLM ingestion: dense, factual, no navigation chrome.
import { site, bot, home, about, founder, pages, products, solutions, features, productBySlug, abs, careers } from '../lib/data.js';
import { fill, kes, planEarnings, scenario, serviceNet, manualEntryPrice } from '../lib/earnings.js';

const list = (items) => items.map((x) => `- ${x}`).join('\n');
const nl = (...parts) => parts.filter((p) => p !== '' && p != null).join('\n\n') + '\n';

export const plansMarkdown = (p) =>
  p.plans.length
    ? p.plans
        .map((pl) => `### ${pl.name} — ${pl.price}${pl.per ? ' ' + pl.per : ''}${pl.tag ? ` (${pl.tag})` : ''}\n${pl.description}\n${list(pl.features)}`)
        .join('\n\n')
    : p.priceSummary;

export const productMarkdown = (p) =>
  nl(
    `# ${p.name}`,
    `> ${p.description}`,
    list([
      `**Category:** ${p.category}`,
      `**Built for:** ${p.audience}`,
      `**Status:** ${p.status}`,
      `**Open the app:** ${p.appUrl}`,
      `**Web page:** ${abs(`/products/${p.slug}/`)}`,
      `**Publisher:** ${site.legalName} (${abs('/')})`,
    ]),
    `## Overview\n${p.longDescription}`,
    `## The problem it solves\n${p.problem}`,
    `## Core capabilities\n${list(p.features)}`,
    `## How it works\n${p.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
    `## At a glance\n${list(p.facts.map((f) => `**${f.label}:** ${f.value}`))}`,
    `## Pricing\n${plansMarkdown(p)}${p.priceNote ? `\n\n${p.priceNote}` : ''}`,
    p.whatsappBot ? `## On WhatsApp\n${p.whatsappBot} Chat: ${bot.url}` : '',
    p.careersCta ? `## Careers\n${p.careersCta.text} ${abs(p.careersCta.href)}` : '',
    `## Part of the SAMUHIA ecosystem\n${p.connects}`,
    `## Frequently asked questions\n${p.faq.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}`,
  );

export const solutionMarkdown = (s) => {
  const p = productBySlug(s.product);
  return nl(
    `# ${s.title}`,
    `> ${s.description}`,
    `## Recommended product: ${p.name}\n${p.longDescription}`,
    `**Product page:** ${abs(`/products/${p.slug}/`)}  \n**Open the app:** ${p.appUrl}`,
    p.whatsappBot ? `## Also on WhatsApp\n${p.whatsappBot} Chat: ${bot.url}` : '',
    `## What you can do\n${list(p.features.slice(0, 8))}`,
    `## Pricing\n${p.priceSummary}`,
  );
};

export const solutionsIndexMarkdown = () =>
  nl(`# ${pages.solutions.title}`, `> ${pages.solutions.description}`, solutions.map((s) => `## ${s.title}\n${s.description} Recommended product: [${productBySlug(s.product).name}](${abs(`/products/${s.product}/`)}).`).join('\n\n'));

export const productsIndexMarkdown = () =>
  nl(`# ${pages.products.title}`, `> ${pages.products.description}`, products.map((p) => `## ${p.name}\n${p.description}\n\n- Category: ${p.category}\n- Built for: ${p.audience}\n- Page: ${abs(`/products/${p.slug}/`)}\n- App: ${p.appUrl}`).join('\n\n'));

export const pricingMarkdown = () =>
  nl(`# ${pages.pricing.title}`, `> ${pages.pricing.lead}`, products.map((p) => `## ${p.name}\n${plansMarkdown(p)}${p.priceNote ? `\n\n${p.priceNote}` : ''}`).join('\n\n'), pages.pricing.footnote);

export const aboutMarkdown = () =>
  nl(
    `# About ${site.name}`,
    `> ${about.lead}`,
    `## Mission\n${about.mission}`,
    `## Vision\n${about.vision}`,
    `## Principles\n${list(about.principles.map((x) => `**${x.title}:** ${x.text}`))}`,
    `## Journey\n${list(about.journey.map((j) => `${j.label ? j.label + ' — ' : ''}${j.text}${j.note ? ' ' + j.note : ''}`))}`,
    about.footnote,
  );

export const founderMarkdown = () =>
  nl(`# ${founder.name} — ${founder.jobTitle}`, founder.bio.join('\n\n'), `## Why I build\n${founder.whyIBuild}`);

export const homeMarkdown = () =>
  nl(
    `# ${site.name} — ${site.tagline}`,
    `> ${site.description}`,
    list([`**Legal name:** ${site.legalName}`, `**Founded:** ${site.foundingYear}, ${site.countryName}`, `**Founder & CEO:** ${founder.name}`, `**Email:** ${site.email}`, `**Phone / WhatsApp:** ${site.phone}`, `**${bot.name}:** ${bot.phoneSpaced} (${bot.url})`, `**Website:** ${abs('/')}`]),
    `## ${home.bot.title}\n${home.bot.text} Chat: ${bot.url}`,
    `## Products\n${list(products.map((p) => `[${p.name}](${abs(`/products/${p.slug}/`)}) — ${p.description}`))}`,
    `## Story\n${home.story.paragraphs.join('\n\n')}\n\n${home.story.closing}`,
    `## Frequently asked questions\n${home.faq.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}`,
  );

const streamsMd = (keys) =>
  careers.streams
    .filter((x) => !keys || keys.includes(x.key))
    .map((x) => `- **${x.name}** (${x.status}): ${fill(x.what)} ${fill(x.rate)}. ${fill(x.example)}`)
    .join('\n');

const plansMd = (slug) =>
  `### ${productBySlug(slug).name}: estimate per account per month\n` +
  planEarnings(slug).map((r) => `- ${r.name} (${kes(r.price)} / month): Clerk ${kes(r.clerk)}, Senior ${kes(r.senior)}`).join('\n');

const servicesMd = () =>
  `### Desk services\n` +
  careers.serviceRows
    .map((r) => {
      const price = r.records ? manualEntryPrice(r.records) : careers.assumptions[r.price];
      return `- ${r.service}: customer pays ${kes(price)}, you earn about ${kes(serviceNet(price))}`;
    })
    .join('\n');

export const careersMarkdown = () =>
  nl(
    `# ${pages.careers.title}`,
    `> ${fill(pages.careers.description)}`,
    fill(pages.careers.lead),
    `## Career paths\n${careers.paths.map((p) => `- [${p.name}](${abs(`/careers/${p.slug}/`)}): ${fill(p.short)}`).join('\n')}`,
    `## How you earn\n${streamsMd()}`,
    servicesMd(),
    `## Illustrative months\n${careers.scenarios.map(scenario).map((s) => `### ${s.name} (${s.rank})\n${s.computed.map((l) => `- ${l.label}: ${kes(l.amount)}`).join('\n')}\n- Total: about ${kes(s.total)}`).join('\n\n')}\n\n${fill(careers.scenarioNote)}`,
    `## From application to first payout\n${careers.journey.map((j, i) => `${i + 1}. **${j.title}:** ${fill(j.text)}`).join('\n')}`,
    `## Rules\n${list(careers.rules.map(fill))}`,
    `## Frequently asked questions\n${careers.faq.map((q) => `### ${fill(q.q)}\n${fill(q.a)}`).join('\n\n')}`,
    `## Other roles\n${fill(careers.hub.otherText)} Email ${site.email}.`,
    `**Apply:** ${productBySlug('desk').appUrl}`,
  );

export const careerPathMarkdown = (p) =>
  nl(
    `# ${p.name} — Samuhia Desk career path`,
    `> ${fill(p.description)}`,
    fill(p.lead),
    `## Who it suits\n${list(p.forWho.map(fill))}`,
    `## What you do\n${list(p.youDo.map(fill))}`,
    `## What you can earn\n${fill(p.callout)}\n\n${streamsMd(p.earns)}`,
    ...(p.tables || []).map(plansMd),
    p.earns.includes('services') ? servicesMd() : '',
    `## Questions\n${p.faq.map((q) => `### ${fill(q.q)}\n${fill(q.a)}`).join('\n\n')}`,
    `**Page:** ${abs(`/careers/${p.slug}/`)}  \n**Apply:** ${productBySlug('desk').appUrl}`,
  );

export const featureMarkdown = (f) => {
  const p = productBySlug(f.product);
  return nl(
    `# ${f.name}`,
    `> ${f.description}`,
    list([
      `**Part of:** [${p.name}](${abs(`/products/${p.slug}/`)})`,
      `**Built for:** ${f.audience}`,
      `**Available on:** ${f.channels.join(' and ')}`,
      `**WhatsApp bot:** ${bot.phoneSpaced} (${bot.url})`,
      `**Web page:** ${abs(`/features/${f.slug}/`)}`,
      `**Publisher:** ${site.legalName} (${abs('/')})`,
    ]),
    `## Overview\n${f.lead}`,
    `## The problem it solves\n${f.problem}`,
    `## ${f.capabilitiesTitle}\n${list(f.capabilities)}`,
    `## How it works\n${f.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
    `## ${f.safeguards.title}\n${list(f.safeguards.items)}`,
    ...f.audiences.map((a) => `## ${a.title}\n${a.lead}\n\n${list(a.items)}`),
    `## At a glance\n${list(f.facts.map((x) => `**${x.label}:** ${x.value}`))}`,
    `## Frequently asked questions\n${f.faq.map((q) => `### ${q.q}\n${q.a}`).join('\n\n')}`,
  );
};

export const featuresIndexMarkdown = () =>
  nl(`# ${pages.features.title}`, `> ${pages.features.description}`, features.map((f) => `## ${f.name}\n${f.cardDescription}\n\n- Part of: ${productBySlug(f.product).name}\n- Page: ${abs(`/features/${f.slug}/`)}`).join('\n\n'));
