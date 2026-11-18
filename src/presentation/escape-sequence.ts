import type {Scene} from '@babylonjs/core/scene';
import type {UniversalCamera} from '@babylonjs/core/Cameras/universalCamera';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {CreateBox} from '@babylonjs/core/Meshes/Builders/boxBuilder';
import {CreatePlane} from '@babylonjs/core/Meshes/Builders/planeBuilder';
import {Texture} from '@babylonjs/core/Materials/Textures/texture';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {Color3} from '@babylonjs/core/Maths/math.color';
import {Vector3} from '@babylonjs/core/Maths/math.vector';
import type {Mesh} from '@babylonjs/core/Meshes/mesh';
import {escapeFrame} from './escape-path';
export class EscapeSequence {
 private meshes:Mesh[]=[];private materials:StandardMaterial[]=[];private hinges:TransformNode[]=[];
 private textures:Texture[]=[];
 readonly started=performance.now();
 constructor(private scene:Scene,private camera:UniversalCamera){
  const material=(name:string,color:string)=>{const m=new StandardMaterial(name,scene);m.diffuseColor=Color3.FromHexString(color);m.emissiveColor=m.diffuseColor;m.disableLighting=true;this.materials.push(m);return m;};
  const ink=material('escape-ink','#241e2c'),wood=material('escape-wood','#4b3449'),gold=material('escape-brass','#bd9459'),floor=material('escape-floor','#715248');
  const box=(name:string,w:number,h:number,d:number,x:number,y:number,z:number,mat:StandardMaterial)=>{const m=CreateBox(name,{width:w,height:h,depth:d},scene);m.position.set(x+30,y,z);m.material=mat;m.isPickable=false;m.renderOutline=true;m.outlineWidth=.025;m.outlineColor=Color3.FromHexString('#241e2c');this.meshes.push(m);return m;};
  const floorboards = new Texture(import.meta.env.BASE_URL + 'textures/wood_floor/albedo.jpg', scene);
  floorboards.uScale = 2;
  floorboards.vScale = 5;
  floorboards.level = .6;
  floor.emissiveTexture = floorboards;
  this.textures.push(floorboards);
  box('escape-floor', 5, .15, 12, 0, -.08, -5.86, floor);
  box('escape-ceiling', 5, .25, 12, 0, 4.55, -5.86, ink);
  for (const side of [-1, 1]) {
   box('escape-wall', .3, 4.5, 12, side * 2.4, 2.25, -5.86, ink);
   box('escape-wainscot', .10, 1.1, 11.7, side * 2.2, .55, -5.8, wood);
   box('escape-wall-molding', .12, .055, 11.7, side * 2.16, 1.1, -5.8, gold);
  }
  for(const side of [-1,1]){box('escape-door-surround',1.25,4.5,.3,side*1.85,2.25,0,wood);box('escape-door-jamb',.14,3.5,.35,side*1.18,1.75,-.05,gold);}
  box('escape-lintel',2.5,.16,.35,0,3.45,-.09,gold);
  box('escape-overdoor-wall', 2.5, 1.03, .3, 0, 4, 0, wood);
  for(const side of [-1,1]){const hinge=new TransformNode('escape-door-hinge',scene);hinge.position.set(30+side*1.1,1.7,0);this.hinges.push(hinge);const door=box('escape-opening-door',1.1,3.3,.16,0,0,0,wood);door.parent=hinge;door.position.set(-side*.55,0,0);const band=box('escape-door-band',.9,.08,.19,0,0,0,gold);band.parent=door;band.position.set(0,.7,0);}
  const dawn=material('escape-painted-dawn','#ffffff'),texture=new Texture(import.meta.env.BASE_URL+'art/escape-dawn-v1.png',scene);dawn.diffuseTexture=texture;this.textures.push(texture);
  const vista=CreatePlane('escape-painted-street',{width:18,height:10.125},scene);vista.position.set(30,2.9,9);vista.material=dawn;vista.isPickable=false;this.meshes.push(vista);this.update(this.started);
 }
 update(now:number):void {const f=escapeFrame(now-this.started);this.camera.fov=.9;this.camera.position.set(30+f.x,f.y,f.z);this.camera.setTarget(new Vector3(30,1.72,f.z+5));this.hinges.forEach((h,i)=>h.rotation.y=(i===0?-1:1)*f.doorAngle);}
 dispose():void {this.meshes.forEach(m=>m.dispose());this.hinges.forEach(h=>h.dispose());this.materials.forEach(m=>m.dispose());this.textures.forEach(t=>t.dispose());}
}
