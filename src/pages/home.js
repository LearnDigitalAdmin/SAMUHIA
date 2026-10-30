import { esc, each } from '../lib/html.js';
import { botCallout } from '../components/whatsapp.js';
import { site, bot, home, founder, products, solutions } from '../lib/data.js';
import { productCard, solutionCard } from '../components/cards.js';
import { ecosystem } from '../components/ecosystem.js';
import { faq } from '../components/faq.js';
import { founderPortrait } from '../components/portrait.js';
import * as ld from '../seo/jsonld.js';
import { homeMarkdown } from '../seo/markdown.js';

export const homePage = () => {
  const h = home;
  const stats = each(h.stats, (s) => `<li><b>${esc(s.value.replace('{productCount}', products.length))}</b>${esc(s.label)}</li>`);
  const body = `
<section class="hero dark" aria-labelledby="hero-title">
  <div class="wrap grid">
    <div>
      <p class="eyebrow">${esc(h.hero.eyebrow)}</p>
      <h1 id="hero-title">${esc(h.hero.titleLead)} <em>${esc(h.hero.titleEmphasis)}</em></h1>
      <p class="lead">${esc(h.hero.lead)}</p>
      <div class="row"><a class="btn pri" href="${esc(h.hero.primaryCta.href)}">${esc(h.hero.primaryCta.label)}</a><a class="btn" href="${esc(h.hero.secondaryCta.href)}">${esc(h.hero.secondaryCta.label)}</a></div>
    </div>
    <div>${ecosystem(products)}</div>
  </div>
</section>
<div class="strip"><div class="wrap"><ul>${stats}</ul></div></div>

<section aria-labelledby="products-title">
  <div class="wrap">
    <div class="head"><p class="eyebrow">${esc(h.intro.eyebrow)}</p><h2 id="products-title">${esc(h.intro.title)}</h2><p class="lead">${esc(h.intro.lead)}</p></div>
    <h2 class="sr-only">${esc(h.intro.productsHeading)}</h2>
    <div class="bento">${each(products, productCard)}</div>
  </div>
</section>

<section class="dark" aria-labelledby="solutions-title">
  <div class="wrap">
    <div class="head"><p class="eyebrow">${esc(h.solutions.eyebrow)}</p><h2 id="solutions-title">${esc(h.solutions.title)}</h2></div>
    <div class="grid g3">${each(solutions, (s) => solutionCard(s, { dark: true }))}</div>
  </div>
</section>

<section aria-labelledby="why-title">
  <div class="wrap grid g2" style="align-items:start;gap:48px">
    <div><p class="eyebrow">${esc(h.why.eyebrow)}</p><h2 id="why-title" style="margin-top:10px">${esc(h.why.title)}</h2></div>
    <div>${each(h.why.items, (w, i) => `<div class="wy"><span class="idx">0${i + 1}</span><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></div>`)}</div>
  </div>
</section>

<section style="background:var(--color-surface);border-block:1px solid var(--color-border)" aria-labelledby="story-title">
  <div class="wrap grid g2" style="gap:48px">
    <div><p class="eyebrow">${esc(h.story.eyebrow)}</p><h2 id="story-title" style="margin-top:10px">${esc(h.story.title)}</h2></div>
    <div>${h.story.paragraphs.map((t, i) => `<p${i ? ' style="margin-top:14px"' : ''}>${esc(t)}</p>`).join('')}<p class="muted" style="margin-top:14px">${esc(h.story.closing)}</p></div>
  </div>
</section>

<section aria-labelledby="founder-title">
  <div class="wrap grid g2" style="align-items:center;gap:48px">
    ${founderPortrait()}
    <div>
      <p class="eyebrow">${esc(h.founderTeaser.eyebrow)}</p>
      <h2 id="founder-title" style="margin:10px 0">${esc(founder.name)}</h2>
      <p class="muted">${esc(founder.jobTitle)}</p>
      <p style="margin-top:12px">${esc(h.founderTeaser.text)}</p>
      <div class="row"><a class="btn" href="${esc(h.founderTeaser.cta.href)}">${esc(h.founderTeaser.cta.label)}</a></div>
    </div>
  </div>
</section>

<section class="dark" aria-labelledby="cta-title">
  <div class="wrap grid g2" style="gap:48px">
    <div>
      <h2 id="cta-title">${esc(h.cta.title)}</h2>
      <p class="lead">${esc(h.cta.lead)}</p>
      <div class="row"><a class="btn pri" href="${esc(h.cta.primary.href)}">${esc(h.cta.primary.label)}</a><a class="btn" href="${esc(h.cta.secondary.href)}">${esc(h.cta.secondary.label)}</a></div>
    </div>
    <div>
      <h2 style="font-size:1.6rem">${esc(h.cta.contactTitle)}</h2>
      <p style="margin-top:12px"><a href="mailto:${esc(site.email)}">${esc(site.email)}</a><br><a href="mailto:${esc(site.altEmail)}">${esc(site.altEmail)}</a><br><a href="tel:${esc(site.phone)}">${esc(site.phoneDisplay)}</a><br><a href="https://wa.me/${esc(site.whatsapp)}" rel="noopener">WhatsApp</a><br><a href="${esc(bot.url)}" rel="noopener">WhatsApp bot ${esc(bot.phoneSpaced)}</a></p>
    </div>
  </div>
</section>

<section aria-labelledby="bot-title"><div class="wrap">${botCallout({ id: 'bot-title', title: h.bot.title, text: h.bot.text })}</div></section>

<section aria-labelledby="faq-title">
  <div class="wrap"><h2 id="faq-title">Frequently asked questions</h2><div style="margin-top:20px">${faq(h.faq)}</div></div>
</section>`;

  const title = h.seoTitle;
  return {
    path: '/',
    title,
    description: h.description,
    body,
    hasMarkdown: true,
    markdown: homeMarkdown(),
    jsonld: [
      ld.organization(),
      ld.person(),
      ld.website(),
      ld.webPage({ path: '/', title, description: h.description }),
      ld.productItemList(),
      ld.faqPage(h.faq),
    ],
  };
};
