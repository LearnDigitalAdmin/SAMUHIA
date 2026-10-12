// Markdown "twins" of key pages, served at <page>/index.md and concatenated into llms-full.txt.
// Written for LLM ingestion: dense, factual, no navigation chrome.
import { site, home, about, founder, pages, products, solutions, productBySlug, abs } from '../lib/data.js';

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
    list([`**Legal name:** ${site.legalName}`, `**Founded:** ${site.foundingYear}, ${site.countryName}`, `**Founder & CEO:** ${founder.name}`, `**Email:** ${site.email}`, `**Phone / WhatsApp:** ${site.phone}`, `**Website:** ${abs('/')}`]),
    `## Products\n${list(products.map((p) => `[${p.name}](${abs(`/products/${p.slug}/`)}) — ${p.description}`))}`,
    `## Story\n${home.story.paragraphs.join('\n\n')}\n\n${home.story.closing}`,
    `## Frequently asked questions\n${home.faq.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}`,
  );
