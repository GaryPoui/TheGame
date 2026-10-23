"""Check that shipped game textures match their recorded source hashes and sizes."""
import hashlib
import json
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'docs/realistic-assets.json').read_text(encoding='utf-8'))
errors: list[str] = []
assets = [item for asset in manifest['assets'] for item in asset.get('maps', [])]
for asset in assets:
    path = root / asset['path']
    if not path.is_file():
        errors.append(f"missing {asset['path']}")
        continue
    data = path.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    if len(data) != asset['bytes']:
        errors.append(f"size mismatch {asset['path']}: {len(data)} != {asset['bytes']}")
    if digest != asset['sha256']:
        errors.append(f"SHA-256 mismatch {asset['path']}")
    if path.is_relative_to(root / 'public') and not (root / 'dist' / path.relative_to(root / 'public')).is_file():
        errors.append(f"missing from built site dist/{path.relative_to(root / 'public').as_posix()}")
if sum(item['bytes'] for item in assets) != manifest['totalBytes']:
    errors.append('totalBytes does not match map records')
public_manifest = json.loads((root / 'public/visual-provenance.json').read_text(encoding='utf-8'))
if public_manifest != manifest:
    errors.append('public/visual-provenance.json differs from docs/realistic-assets.json')
if not (root / 'third-party/makehuman/LICENSE.ASSETS.md').is_file():
    errors.append('missing MakeHuman asset license')
if not (root / 'third-party/polyhaven/CC0-1.0.txt').is_file():
    errors.append('missing Poly Haven CC0 text')
if errors:
    print('\n'.join('FAIL: ' + error for error in errors))
    sys.exit(1)
print(f"PASS: {len(assets)} texture files match recorded byte lengths and SHA-256; "
      f"{manifest['totalBytes']} source bytes; licenses and dist copies present.")
