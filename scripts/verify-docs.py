"""Structural checks for documentation delivery. Does not claim game validation."""
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
errors = []
required = ['README.md', 'AGENTS.md', 'docs/continuity.md', 'docs/vision.md',
 'docs/game-design.md', 'docs/narrative.md', 'docs/educational-design.md',
 'docs/art-direction.md', 'docs/ui-style-guide.md', 'docs/asset-pipeline.md',
 'docs/visual-validation.md', 'docs/architecture.md', 'docs/research.md',
 'docs/research-education.md', 'docs/skills.md', 'docs/validation-plan.md',
 'docs/risks.md', 'docs/original-prompt.md', 'docs/spec-kit.md',
 'docs/consistency-analysis.md', '.specify/memory/constitution.md',
 'skills-manifest.json', 'package.json', 'package-lock.json', 'third-party/README.md']
for filename in required:
 if not (ROOT/filename).is_file(): errors.append(f'missing {filename}')
features = sorted((ROOT/'specs').glob('[0-9][0-9][0-9]-*'))
if len(features) != 10: errors.append(f'expected 10 specs, got {len(features)}')
requirements = tasks = 0
for feature in features:
 for f in ['spec.md','plan.md','tasks.md','research.md','data-model.md','quickstart.md',
           'contracts/ui-state.md','checklists/requirements.md']:
  if not (feature/f).is_file(): errors.append(f'missing {feature.name}/{f}')
 spec=(feature/'spec.md').read_text(encoding='utf-8-sig')
 task=(feature/'tasks.md').read_text(encoding='utf-8-sig')
 for heading in ['User Scenarios & Testing','Edge Cases','Functional Requirements','Success Criteria','Clarifications']:
  if heading not in spec: errors.append(f'{feature.name} missing {heading}')
 ids=re.findall(r'\*\*(FR-\d{3}-\d{2})\*\*',spec)
 if len(ids) != len(set(ids)): errors.append(f'{feature.name} duplicate requirements')
 requirements += len(ids)
 task_lines=[x for x in task.splitlines() if x.startswith('- [')]
 tasks+=len(task_lines)
 for line in task_lines:
  if not re.match(r'- \[ \] T\d{3} ',line): errors.append(f'{feature.name}: bad/premature task checkbox')
  if not re.search(r'(src/|tests/|specs/|docs/|assets/|\.github/|package\.json|vite\.config\.ts)',line):
   errors.append(f'{feature.name}: task lacks path')
 for x in ['[NEEDS CLARIFICATION:', '[FEATURE NAME]', '$ARGUMENTS']:
  if x in spec+task: errors.append(f'{feature.name} unresolved placeholder {x}')
docs=[ROOT/'README.md',ROOT/'AGENTS.md',ROOT/'specs/README.md']
docs+=list((ROOT/'docs').glob('*.md'))+list((ROOT/'specs').rglob('*.md'))
link_count=0
for doc in docs:
 if not doc.exists(): continue
 if doc.name=='original-prompt.md': continue # verbatim requested input, not authored links
 content=doc.read_text(encoding='utf-8-sig')
 content=re.sub(r'```.*?```','',content,flags=re.S)
 for target in re.findall(r'\[[^\]]*\]\(([^)]+)\)',content):
  target=target.split(' "',1)[0].strip('<>')
  if re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:',target) or target.startswith('#'): continue
  target=unquote(target.split('#',1)[0])
  if target:
   link_count+=1
   if not (doc.parent/target).exists(): errors.append(f'{doc.relative_to(ROOT)} broken link {target}')
package=json.loads((ROOT/'package.json').read_text(encoding='utf-8-sig'))
lock=json.loads((ROOT/'package-lock.json').read_text(encoding='utf-8-sig'))
for kind in ['dependencies','devDependencies']:
 for name,version in package[kind].items():
  if not re.fullmatch(r'\d+\.\d+\.\d+',version): errors.append(f'not exact pin {name}')
  if lock['packages'].get('node_modules/'+name,{}).get('version')!=version:
   errors.append(f'lock mismatch {name}')
constitution=(ROOT/'.specify/memory/constitution.md').read_text(encoding='utf-8')
if re.search(r'\[[A-Z][A-Z_]+\]',constitution): errors.append('constitution placeholder')
report={'scope':'structural documentation only; not game runtime or semantic proof',
 'result':'PASS' if not errors else 'FAIL','features':len(features),'requirements':requirements,
 'pending_tasks':tasks,'local_links_checked':link_count,'errors':errors}
(ROOT/'docs/evidence/docs-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(bool(errors))
