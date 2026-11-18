import { readdir, readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import path from 'node:path';

async function filesAt(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? filesAt(path.join(directory, e.name)) : [path.join(directory, e.name)]))).flat();
}
const files = [];
for (const file of await filesAt('dist')) {
  const bytes = await readFile(file);
  files.push({ path: file.replaceAll('\\', '/'), bytes: (await stat(file)).size, gzipBytes: gzipSync(bytes).length,
    sha256: createHash('sha256').update(bytes).digest('hex') });
}
const report = {
  scope: 'All emitted files, not a browser transfer timing or GPU benchmark',
  files, totalBytes: files.reduce((n, f) => n + f.bytes, 0),
  totalGzipBytes: files.reduce((n, f) => n + f.gzipBytes, 0),
  externalRuntimeAssets: false,
};
const destination = process.argv[2] ?? 'docs/evidence/runtime/build-report.json';
await mkdir(path.dirname(destination), { recursive: true });
await writeFile(destination, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ files: files.length, totalBytes: report.totalBytes, totalGzipBytes: report.totalGzipBytes }));
