import fs from 'node:fs';
import path from 'node:path';

// Order matters: tokens → base → layout → components → pages → utilities (responsive/a11y last).
export const CSS_FILES = ['tokens.css', 'base.css', 'layout.css', 'components.css', 'pages.css', 'utilities.css'];

/** Conservative CSS minifier (comments + whitespace). Safe for this stylesheet. */
export const minify = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();

export const bundleCss = (stylesDir, { minified = true } = {}) => {
  const css = CSS_FILES.map((f) => fs.readFileSync(path.join(stylesDir, f), 'utf8')).join('\n');
  return minified ? minify(css) : css;
};
