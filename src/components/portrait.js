import { esc } from '../lib/html.js';
import { founder } from '../lib/data.js';

/** Founder photo if configured in content/founder.json, otherwise a branded card. */
export const founderPortrait = ({ tall = false } = {}) =>
  founder.image
    ? `<div class="portrait${tall ? ' tall' : ''}"><img src="${esc(founder.image)}" alt="${esc(founder.imageAlt)}" width="1200" height="${tall ? 1500 : 900}" loading="lazy" decoding="async"></div>`
    : `<div class="portrait${tall ? ' tall' : ''}"><img class="mark" src="/assets/brand/samuhia-symbol.svg" width="152" height="138" alt="" loading="lazy"></div>`;
