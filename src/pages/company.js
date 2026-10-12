import { esc, each } from '../lib/html.js';
import { site, pages, about, founder, security } from '../lib/data.js';
import { founderPortrait } from '../components/portrait.js';
import * as ld from '../seo/jsonld.js';
import { aboutMarkdown, founderMarkdown } from '../seo/markdown.js';

export const aboutPage = () => ({
  path: '/about/',
  title: about.seoTitle,
  description: about.description,
  crumbs: [{ label: 'About' }],
  hasMarkdown: true,
  markdown: aboutMarkdown(),
  jsonld: [ld.webPage({ path: '/about/', title: about.seoTitle, description: about.description, type: 'AboutPage' })],
  body: `<div class="page wrap"><article>
  <p class="eyebrow">${esc(about.eyebrow)}</p><h1>${esc(about.title)}</h1><p class="lead">${esc(about.lead)}</p>
  <section aria-labelledby="mission"><h2 id="mission">Mission</h2><p>${esc(about.mission)}</p></section>
  <section aria-labelledby="vision"><h2 id="vision">Vision</h2><p>${esc(about.vision)}</p></section>
  <section aria-labelledby="principles"><h2 id="principles">Principles</h2><div class="grid g3">${each(about.principles, (x) => `<div class="card"><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div>`)}</div></section>
  <section aria-labelledby="journey"><h2 id="journey">Journey</h2><div class="tl">${each(about.journey, (j) => `<div>${j.isYear ? `<strong>${esc(j.label)}</strong><br>` : ''}${esc(j.text)}${j.note ? ` <span class="muted">${esc(j.note)}</span>` : ''}</div>`)}</div></section>
  <p class="muted">${esc(about.footnote)}</p>
  <div class="row"><a class="btn" href="/founder/">Meet the Founder</a></div>
</article></div>`,
});

export const founderPage = () => {
  const links = [
    founder.links.linkedin && `<a class="btn" href="${esc(founder.links.linkedin)}" rel="me noopener">LinkedIn</a>`,
    founder.links.github && `<a class="btn" href="${esc(founder.links.github)}" rel="me noopener">GitHub</a>`,
  ].filter(Boolean);
  const media = founder.media?.length
    ? `<section aria-labelledby="media"><h2 id="media">Media &amp; interviews</h2><ul class="chk">${each(founder.media, (m) => `<li><a href="${esc(m.url)}" rel="noopener">${esc(m.title)}</a></li>`)}</ul></section>`
    : '';
  return {
    path: '/founder/',
    title: founder.seoTitle,
    description: founder.description,
    crumbs: [{ label: 'Company', href: '/about/' }, { label: 'Founder' }],
    ogType: 'profile',
    hasMarkdown: true,
    markdown: founderMarkdown(),
    jsonld: [ld.webPage({ path: '/founder/', title: founder.seoTitle, description: founder.description, type: 'ProfilePage', extra: { mainEntity: { '@id': ld.person()['@id'] } } }), ld.person()],
    body: `<div class="page wrap"><article>
  <div class="grid g2" style="gap:48px;align-items:center">
    <div><p class="eyebrow">Founder</p><h1>${esc(founder.name)}</h1><p class="lead">${esc(founder.jobTitle)}, ${esc(site.name)}</p>${links.length ? `<div class="row">${links.join('')}</div>` : ''}</div>
    ${founderPortrait({ tall: true })}
  </div>
  <section aria-labelledby="bio"><h2 id="bio">Biography</h2>${founder.bio.map((t, i) => `<p${i ? ' style="margin-top:14px"' : ''}>${esc(t)}</p>`).join('')}</section>
  <section aria-labelledby="why"><h2 id="why">Why I build</h2><p>${esc(founder.whyIBuild)}</p></section>
  ${media}
</article></div>`,
  };
};

export const securityPage = () => ({
  path: '/security/',
  title: security.seoTitle,
  description: security.description,
  crumbs: [{ label: 'Company', href: '/about/' }, { label: 'Security' }],
  jsonld: [ld.webPage({ path: '/security/', title: security.seoTitle, description: security.description })],
  body: `<div class="page wrap"><p class="eyebrow">Security</p><h1>${esc(security.title)}</h1><p class="lead">${esc(security.lead)}</p><ul class="chk" style="margin-top:32px">${each(security.practices, (x) => `<li>${esc(x)}</li>`)}</ul><p class="muted" style="margin-top:20px">${esc(security.note)}</p></div>`,
});

export const careersPage = () => {
  const c = pages.careers;
  return {
    path: '/careers/',
    title: c.seoTitle,
    description: c.description,
    crumbs: [{ label: 'Company', href: '/about/' }, { label: 'Careers' }],
    jsonld: [ld.webPage({ path: '/careers/', title: c.seoTitle, description: c.description })],
    body: `<div class="page wrap"><p class="eyebrow">Careers</p><h1>${esc(c.title)}</h1><p class="lead">${esc(c.lead)}</p><div class="row"><a class="btn pri" href="mailto:${esc(site.email)}?subject=Expression%20of%20interest">Send an expression of interest</a></div></div>`,
  };
};
