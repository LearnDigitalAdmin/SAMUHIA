// Tiny HTML helpers. All dynamic text MUST go through esc().
export const esc = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const each = (items = [], fn) => items.map(fn).join('');

/** Serialise data for a <script type="application/ld+json"> block (safe against </script>). */
export const jsonScript = (data) =>
  JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

/** Collapse whitespace so `title` / `description` values are single-line. */
export const oneLine = (s = '') => String(s).replace(/\s+/g, ' ').trim();

export const truncate = (s, max) => {
  const t = oneLine(s);
  return t.length <= max ? t : t.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
};
