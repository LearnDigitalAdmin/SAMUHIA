#!/usr/bin/env node
// Minimal static server that mimics Firebase Hosting (clean URLs, trailing slashes, 404.html).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const PORT = Number(process.env.PORT || process.argv.find((a) => a.startsWith('--port='))?.split('=')[1] || 5001);
const HEADERS = (() => {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, '..', 'firebase.json'), 'utf8'));
    const rule = cfg.hosting.headers.find((h) => h.source === '**');
    return Object.fromEntries(rule.headers.filter((h) => h.key !== 'Cache-Control' && h.key !== 'Strict-Transport-Security').map((h) => [h.key, h.value]));
  } catch { return {}; }
})();
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.md': 'text/markdown; charset=utf-8', '.webmanifest': 'application/manifest+json' };

export const serve = (port = PORT) =>
  http
    .createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let file = path.join(ROOT, p);
      if (!file.startsWith(ROOT)) return res.writeHead(403).end();
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
        if (!p.endsWith('/')) return res.writeHead(301, { Location: p + '/' }).end();
        file = path.join(file, 'index.html');
      }
      if (fs.existsSync(file)) {
        res.writeHead(200, { ...HEADERS, 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
        return fs.createReadStream(file).pipe(res);
      }
      const nf = path.join(ROOT, '404.html');
      res.writeHead(404, { ...HEADERS, 'Content-Type': TYPES['.html'] });
      res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'Not found');
    })
    .listen(port, () => console.log(`\n→ Serving ./public at http://localhost:${port}  (Ctrl+C to stop)`));

if (process.argv[1] && process.argv[1].endsWith('serve.js')) serve();
