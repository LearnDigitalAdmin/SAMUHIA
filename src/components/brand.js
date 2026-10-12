import { esc } from '../lib/html.js';
import { brand } from '../lib/data.js';

/** Product/brand app icon (rounded tile) as an <img>. Decorative by default. */
export const icon = (key, size = 40, { alt = '', lazy = true } = {}) =>
  `<img src="/assets/brand/${esc(key)}-icon.svg" width="${size}" height="${size}" alt="${esc(alt)}"${lazy ? ' loading="lazy" decoding="async"' : ''}>`;

/** Horizontal lockup. reversed=true for dark backgrounds. */
export const lockup = (key, height = 40, { reversed = false, alt } = {}) => {
  const [w, h] = brand[key].lockup;
  const width = Math.round((w / h) * height);
  const file = `${key}-lockup${reversed ? '-reversed' : ''}.svg`;
  return `<img src="/assets/brand/${file}" width="${width}" height="${height}" alt="${esc(alt ?? `${brand[key].name} ${brand[key].sub}`)}">`;
};
