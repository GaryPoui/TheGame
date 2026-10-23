"""Verify vendored skills, or reinstall pinned sources without executing their code."""
from pathlib import Path
import argparse
import hashlib
import io
import json
import re
import tempfile
import urllib.request
import zipfile
import shutil

ROOT = Path(__file__).resolve().parents[1]

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def verify(manifest):
    errors = []
    checked = 0
    for item in manifest['skills']:
        if not item['status'].startswith('installed'):
            continue
        folder = ROOT / item['destination']
        for rel, expected in item['files'].items():
            path = folder / rel
            checked += 1
            if not path.is_file() or digest(path) != expected:
                errors.append(f"Missing/changed: {path}")
        actual = {p.relative_to(folder).as_posix() for p in folder.rglob('*') if p.is_file()} if folder.exists() else set()
        errors.extend(f"Unexpected: {folder / rel}" for rel in actual - item['files'].keys())
        for md in folder.rglob('*.md'):
            prose = re.sub(r'```[^\n]*\n.*?```', '', md.read_text(encoding='utf-8'), flags=re.S)
            for link in re.findall(r'\[[^\]]*\]\(([^)]+)\)', prose):
                if ':' in link or link.startswith('#'):
                    continue
                target = link.split('#')[0]
                if target and not (md.parent / target).exists():
                    errors.append(f"Broken relative link: {md}: {link}")
    print(json.dumps({'files_checked': checked, 'errors': errors}, ensure_ascii=False, indent=2))
    return bool(errors)

def install(manifest):
    # No deletion or overwrite; stage and check every archive before copying.
    with tempfile.TemporaryDirectory(prefix='thegame-skills-') as tmp:
        cache = {}
        for source in manifest['sources']:
            repo, commit = source['repository'], source['commit']
            url = f'https://codeload.github.com/{repo}/zip/{commit}'
            request = urllib.request.Request(url, headers={'User-Agent': 'TheGame-skills-reinstaller'})
            data = urllib.request.urlopen(request, timeout=120).read()
            archive = zipfile.ZipFile(io.BytesIO(data))
            target = Path(tmp) / source['id']
            for info in archive.infolist():
                resolved = (target / info.filename).resolve()
                if not resolved.is_relative_to(target.resolve()) or (info.external_attr >> 16) & 0o170000 == 0o120000:
                    raise ValueError('Unsafe archive member')
            archive.extractall(target)
            cache[source['id']] = next(target.iterdir())
        for item in manifest['skills']:
            if not item['status'].startswith('installed'):
                continue
            destination = ROOT / item['destination']
            if destination.exists():
                continue  # verify detects any local divergence; never replace it.
            source = cache[item['source']] / item['source_path']
            staged = Path(tmp) / ('staged-' + item['name'])
            shutil.copytree(source, staged)
            if item.get('license_source'):
                shutil.copy2(cache[item['source']] / item['license_source'], staged / 'LICENSE.upstream')
            if item.get('notice_source'):
                shutil.copy2(cache[item['source']] / item['notice_source'], staged / 'NOTICE.upstream')
            for rel, expected in item['files'].items():
                if digest(staged / rel) != expected:
                    raise ValueError(f'Unexpected upstream content: {item["name"]}/{rel}')
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copytree(staged, destination)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['verify', 'install'])
    args = parser.parse_args()
    manifest = json.loads((ROOT / 'skills-manifest.json').read_text(encoding='utf-8'))
    if args.action == 'install':
        install(manifest)
    raise SystemExit(verify(manifest))
