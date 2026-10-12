import { esc, each } from '../lib/html.js';

export const facts = (items) =>
  `<dl class="facts">${each(items, (f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`)}</dl>`;
