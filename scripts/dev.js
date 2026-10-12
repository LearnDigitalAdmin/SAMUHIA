#!/usr/bin/env node
// Dev loop: build, serve on http://localhost:5000, rebuild when anything in ./src changes.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serve } from './serve.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rebuild = () => {
  const r = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'build.js'), '--noindex', '--no-minify'], { stdio: 'inherit' });
  if (r.status !== 0) console.log('Build failed — fix the error above and save again.');
};
rebuild();
serve();
let timer;
fs.watch(path.join(ROOT, 'src'), { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(rebuild, 150);
});
console.log('Watching ./src for changes…');
