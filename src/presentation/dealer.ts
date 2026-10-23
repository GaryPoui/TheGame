import { Scene } from '@babylonjs/core/scene';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder';
import { headPositions, headIndices, headUVs } from './dealer-head';
import { CreateTube } from '@babylonjs/core/Meshes/Builders/tubeBuilder';

/** Original static anatomical study: adult proportions, sculpted contours and tailored fabric.
 * Head topology derived from the MakeHuman CC0 base mesh; see third-party/makehuman.
 * Original clothing and pose; no remote runtime resources. Facing the player (-Z).
 */
export function createDealer(scene: Scene): { root: TransformNode; shadowMeshes: AbstractMesh[] } {
  const root = new TransformNode('vera-realistic', scene);
  root.position.set(0, 0, 2.65);
  const shadowMeshes: AbstractMesh[] = [];
  const material = (name: string, hex: string, roughness: number, metallic = 0) => {
    const m = new PBRMaterial('vera-' + name, scene);
    m.albedoColor = Color3.FromHexString(hex); m.roughness = roughness; m.metallic = metallic;
    return m;
  };
  const skin = material('skin', '#B48670', .69);
  const faceSkin=material('face-skin','#FFFFFF',.76);
  faceSkin.albedoTexture=new Texture(import.meta.env.BASE_URL+'textures/dealer-skin.png',scene);
  faceSkin.albedoTexture.gammaSpace=true;
  const lips = material('lips', '#81574C', .76);
  const hair = material('hair', '#201B18', .83);
  const vest = material('wool', '#24282A', .94);
  const shirt = material('cotton', '#CDC5B0', .91);
  const dark = material('crease', '#3C302B', .9);
  const gold = material('watch-brass', '#9E8751', .4, .65);
  const attach = (mesh: Mesh, mat: PBRMaterial) => {
    mesh.parent = root; mesh.material = mat; mesh.isPickable = false;
    mesh.receiveShadows = true; shadowMeshes.push(mesh); return mesh;
  };
  // Smooth elliptical cross sections with an optional sculpted front plane.
  type Section = [number, number, number, number]; // y, half-width, half-depth, z center
  const form = (name: string, sections: Section[], mat: PBRMaterial,
    sculpt?: (x: number, y: number, z: number, angle: number) => number) => {
    const positions: number[] = [], indices: number[] = [], normals: number[] = [];
    const sides = 48;
    sections.forEach(([y, w, d, zc]) => {
      for (let i = 0; i <= sides; i++) {
        const a = i / sides * Math.PI * 2;
        const x = Math.sin(a) * w; let z = zc - Math.cos(a) * d;
        if (sculpt) z = sculpt(x, y, z, a);
        positions.push(x, y, z);
      }
    });
    for (let j = 0; j < sections.length - 1; j++) for (let i = 0; i < sides; i++) {
      const a = j * (sides + 1) + i, b = a + sides + 1;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
    VertexData.ComputeNormals(positions, indices, normals);
    const data = new VertexData(); data.positions = positions; data.indices = indices; data.normals = normals;
    const mesh = new Mesh(name, scene); data.applyToMesh(mesh); return attach(mesh, mat);
  };
  const tube = (name: string, points: number[][], radii: number[], mat: PBRMaterial) =>
    attach(CreateTube(name, { path: points.map(p => new Vector3(p[0]!, p[1]!, p[2]!)),
      radiusFunction: i => radii[i]!, tessellation: 12, cap: Mesh.CAP_ALL }, scene), mat);
  form('tailored-waistcoat', [[1.43,.29,.17,.02],[1.7,.31,.19,0],[2,.32,.19,0],
    [2.27,.37,.21,0],[2.53,.43,.19,0],[2.64,.34,.14,0],[2.7,.14,.1,0]], vest);
  form('shirt-front', [[2.02,.02,.005,-.199],[2.4,.12,.01,-.207],[2.66,.16,.02,-.15],
    [2.71,.1,.01,-.125]], shirt);
  form('neck', [[2.66,.094,.085,0],[2.83,.085,.078,-.008],[2.9,.11,.09,-.006]],skin);
  const head = new Mesh('vera-makehuman-head',scene);
  const headData = new VertexData(), headNormals: number[] = [];
  VertexData.ComputeNormals(headPositions,headIndices,headNormals);
  headData.positions=headPositions;headData.indices=headIndices;headData.normals=headNormals;headData.uvs=headUVs;
  headData.applyToMesh(head);attach(head,faceSkin);head.position.y=-.055;
  // Follow the anatomical scalp exactly. A separate elliptical cap sits inside this
  // mesh at the forehead and makes the character read as bald from the game camera.
  const scalpPositions=headPositions.map((v,i)=>v+headNormals[i]!*.004);
  const scalpIndices:number[]=[];
  for(let i=0;i<headIndices.length;i+=3) {
    const ids=[headIndices[i]!,headIndices[i+1]!,headIndices[i+2]!];
    const center=ids.reduce((a,id)=>a.add(new Vector3(headPositions[id*3]!,headPositions[id*3+1]!,headPositions[id*3+2]!)),Vector3.Zero()).scale(1/3);
    const hairline=center.z<-.055?3.205:Math.abs(center.x)>.1?3.12:3.035;
    if(center.y>hairline)scalpIndices.push(...ids);
  }
  const scalp=new Mesh('vera-anatomical-scalp',scene), scalpData=new VertexData();
  const scalpNormals:number[]=[];VertexData.ComputeNormals(scalpPositions,scalpIndices,scalpNormals);
  scalpData.positions=scalpPositions;scalpData.indices=scalpIndices;scalpData.normals=scalpNormals;
  scalpData.applyToMesh(scalp);attach(scalp,hair);scalp.position.y=-.055;
  const sclera=material('sclera','#979084',.64);
  for (const side of [-1,1]) {
    const ex=side*.0585;
    const eye=attach(CreateSphere('anatomical-eye',{diameter:.038,segments:16},scene),sclera);
    eye.position.set(ex,3.0407,-.1416);eye.scaling.y=.88;
    const iris=attach(CreateSphere('iris',{diameter:.013,segments:12},scene),dark);
    iris.position.set(ex,3.0407,-.163);iris.scaling.z=.16;
    tube('eyebrow',[[ex-.029,3.08,-.152],[ex,3.087,-.166],[ex+.028,3.081,-.152]],[.002,.004,.002],hair);
    const sx=side*.4;
    tube('shirt-upper-arm',[[sx,2.55,.005],[side*.49,2.32,-.04],[side*.51,2.16,-.18]],[.115,.102,.087],shirt);
    tube('shirt-forearm',[[side*.51,2.16,-.18],[side*.57,2,-.51],[side*.63,1.94,-.85]],[.087,.075,.06],shirt);
    tube('shirt-cuff',[[side*.62,1.946,-.79],[side*.64,1.932,-.89]],[.065,.063],shirt);
    const hand=form('hand-palm',[[1.895,.061,.106,-1.0],[1.916,.072,.12,-1.0],
      [1.95,.064,.1,-.992],[1.968,.045,.065,-.95]],skin);hand.position.x=side*.65;
    for(let f=0;f<4;f++) {
      const fx=side*.65+(f-1.5)*.033;
      const length=[.13,.16,.151,.12][f]!;
      tube('finger',[[fx,1.929,-1.064],[fx+side*.008,1.917,-1.13],
        [fx+side*.009,1.904,-1.064-length]],[.017,.015,.011],skin);
      tube('knuckle',[[fx-.01,1.934,-1.105],[fx+.01,1.934,-1.105]],[.0015,.0015],lips);
    }
    tube('thumb',[[side*.7,1.924,-.97],[side*.757,1.913,-1.01],[side*.768,1.9,-1.075]],[.025,.021,.014],skin);
    // Seam and cuff detailing remain tonal and small.
    tube('waistcoat-edge',[[side*.15,2.65,-.13],[side*.095,2.41,-.213],[side*.02,2.25,-.212]], [.009,.009,.006],vest);
    tube('collar',[[side*.085,2.75,-.09],[side*.155,2.66,-.158],[side*.09,2.6,-.192]], [.018,.018,.007],shirt);
  }
  for(let i=0;i<4;i++)tube('vest-button',[[0,2.23-i*.13,-.199],[0,2.23-i*.13,-.211]],[.012,.012],gold);
  tube('watch-chain',[[.01,1.99,-.203],[.13,1.91,-.213],[.25,1.94,-.182]],[.003,.003,.003],gold);
  return { root, shadowMeshes };
}
