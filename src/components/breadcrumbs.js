import { esc } from '../lib/html.js';

/** items: [{label, href?}] — last item has no href. Home is prepended automatically. */
export const breadcrumbs = (items) =>
  `<nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a>${items
    .map((x) => ` / ${x.href ? `<a href="${esc(x.href)}">${esc(x.label)}</a>` : `<span aria-current="page">${esc(x.label)}</span>`}`)
    .join('')}</nav>`;
