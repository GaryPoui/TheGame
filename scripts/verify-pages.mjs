import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const baseURL = 'https://garypoui.github.io/TheGame/';
const report = JSON.parse(await readFile('docs/evidence/ink/build-report.json', 'utf8'));
const pending = [...report.files], checked = [], errors = [];
await Promise.all(Array.from({ length: 6 }, async () => {
  while (pending.length) {
    const file = pending.shift();
    try {
      const response = await fetch(new URL(file.path.replace(/^dist\//, ''), baseURL), { cache: 'no-store' });
      const hash = createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex');
      if (response.status !== 200 || hash !== file.sha256) errors.push({ path: file.path, status: response.status, expected: file.sha256, actual: hash });
      else checked.push(file.path);
    } catch (e) { errors.push({ path: file.path, error: String(e) }); }
  }
}));
const result = { baseURL, date: new Date().toISOString(), filesChecked: report.files.length, matches: checked.length, errors };
await writeFile('docs/evidence/ink/public-integrity.json', JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
if (errors.length) process.exitCode = 1;
