import { esc } from './html.js';

/**
 * Tiny inline markup for legal text: **bold** and [label](href). Everything is escaped first;
 * hrefs are limited to https:, mailto:, tel:, site-relative paths and #anchors.
 */
const SAFE_HREF = /^(https:\/\/|mailto:|tel:|\/|#)/;

export const inline = (text = '') =>
  esc(text)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, href) => {
      const raw = href.replace(/&amp;/g, '&');
      if (!SAFE_HREF.test(raw)) return label;
      const ext = /^https:/.test(raw) ? ' rel="noopener"' : '';
      return `<a href="${href}"${ext}>${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
