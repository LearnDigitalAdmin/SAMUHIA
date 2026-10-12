import fs from 'node:fs';
import path from 'node:path';

export const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });
export const emptyDir = (dir) => {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
};
export const write = (file, data) => {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, data);
};
export const copyDir = (from, to) => {
  if (!fs.existsSync(from)) return;
  fs.cpSync(from, to, { recursive: true });
};
export const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });
