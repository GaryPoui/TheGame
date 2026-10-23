"""Extract only the CC0 MakeHuman head. Run from repository root; no downloads or DCC required."""
from pathlib import Path
import json

source = Path('third-party/makehuman/base.obj').read_text().splitlines()
vertices: list[list[float]] = []
texcoords: list[list[float]] = []
faces: list[list[tuple[int, int]]] = []
group = ''
for line in source:
    if line.startswith('v '):
        vertices.append(list(map(float, line.split()[1:])))
    elif line.startswith('vt '):
        texcoords.append(list(map(float, line.split()[1:3])))
    elif line.startswith('g '):
        group = line[2:]
    elif line.startswith('f ') and group == 'body':
        face = [(int(parts[0]) - 1, int(parts[1]) - 1)
                for token in line.split()[1:] for parts in [token.split('/')]]
        # The game never imports or displays an unclothed body.
        if all(vertices[index][1] > 5.9 for index, _ in face):
            faces.append(face)
# OBJ texture seams have distinct v/vt pairs at the same position. Preserve them.
used = sorted({pair for face in faces for pair in face})
remap = {pair: i for i, pair in enumerate(used)}
positions = [round(component, 5) for index, _ in used for component in (
    vertices[index][0] * .19,
    3.325 + (vertices[index][1] - 8.4913) * .19,
    -(vertices[index][2] - .5) * .19,
)]
uvs = [round(component, 6) for _, index in used for component in texcoords[index]]
indices: list[int] = []
for face in faces:
    for j in range(1, len(face) - 1):
        # Babylon left-handed front faces use clockwise winding. The Z reflection
        # already converts the OBJ face convention; retain original index order.
        indices.extend((remap[face[0]], remap[face[j]], remap[face[j + 1]]))
header = '// Derived head-only geometry from MakeHuman CC0 base.obj. See third-party/makehuman/provenance.json.\n'
Path('src/presentation/dealer-head.ts').write_text(header + ''.join(
    f'export const {name} = ' + json.dumps(data, separators=(',', ':')) + ';\n'
    for name, data in [('headPositions', positions), ('headIndices', indices), ('headUVs', uvs)]
))
print(f'Extracted {len(used)} UV vertices and {len(indices) // 3} triangles; head only.')
