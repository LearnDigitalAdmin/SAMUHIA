import { esc, each } from '../lib/html.js';

export const faq = (items) => each(items, (f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`);
