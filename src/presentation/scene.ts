import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { PointLight } from '@babylonjs/core/Lights/pointLight';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder';
import { CreateCylinder } from '@babylonjs/core/Meshes/Builders/cylinderBuilder';
import { CreateTorus } from '@babylonjs/core/Meshes/Builders/torusBuilder';
import { CreatePlane } from '@babylonjs/core/Meshes/Builders/planeBuilder';
import { PointerEventTypes } from '@babylonjs/core/Events/pointerEvents';
import '@babylonjs/core/Shaders/pbr.vertex';
import '@babylonjs/core/Shaders/pbr.fragment';
import '@babylonjs/core/Shaders/default.vertex';
import '@babylonjs/core/Shaders/default.fragment';

/** All geometry and texture artwork is original, generated locally; no remote resources. */
export class GameScene {
  private engine: Engine;
  private scene: Scene;
  private camera: FreeCamera;
  private mode: 'menu' | 'room' | 'table' = 'menu';
  private reduced = false;
  private destination = new Vector3(7, 5.5, -10);
  private focus = new Vector3(0, 1.6, 0);
  private currentFocus = this.focus.clone();
  private tokens: Mesh[] = [];
  private rings: Mesh[] = [];
  private red: PBRMaterial;
  private blue: PBRMaterial;
  private brass: PBRMaterial;
  private ivory: PBRMaterial;
  private resize = () => this.engine.resize();

  constructor(canvas: HTMLCanvasElement, onUrn: (index: 0 | 1) => void) {
    this.engine = new Engine(canvas, true, { stencil: true, preserveDrawingBuffer: true, antialias: true });
    this.engine.setHardwareScalingLevel(Math.max(1, window.devicePixelRatio / 1.5));
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(.035, .043, .046, 1);
    this.scene.ambientColor = new Color3(.16, .18, .2);
    this.scene.imageProcessingConfiguration.exposure = 1.35;
    this.scene.imageProcessingConfiguration.contrast = 1.25;
    this.camera = new FreeCamera('controlled-camera', this.destination.clone(), this.scene);
    this.camera.minZ = .1;
    this.camera.maxZ = 50;
    this.camera.fov = .7;
    this.camera.setTarget(this.focus);
    const fill = new HemisphericLight('cool-window-fill', new Vector3(-.5, 1, -.4), this.scene);
    fill.intensity = .85;
    fill.diffuse = new Color3(.65, .76, .85);
    fill.groundColor = new Color3(.12, .10, .08);
    const key = new PointLight('warm-table-light', new Vector3(-1, 5.4, -1), this.scene);
    key.diffuse = new Color3(1, .79, .49);
    key.intensity = 65;
    key.range = 13;
    this.brass = this.material('aged-brass', '#AD8650', .65, .3);
    this.ivory = this.material('warm-ivory', '#F0DFC0', .0, .7);
    this.red = this.material('red-triangle', '#F47562', .05, .3);
    this.blue = this.material('blue-circle', '#57B7E9', .08, .3);
    const wood = this.material('walnut', '#38271F', .05, .32);
    const dark = this.material('charcoal', '#181D20', .05, .72);
    const felt = this.material('teal-felt', '#174B44', .0, 1);
    const wall = this.material('plaster', '#292E2C', .0, .95);
    const panel = this.material('wall-panels', '#28201C', .0, .65);
    const floor = this.box('floor', [20,.12,18], [0,-.12,0], wood);
    floor.isPickable = false;
    for(let i=0;i<14;i++) this.box('floor-seam', [.018,.014,18], [-9+i*1.4,-.047,0], dark);
    this.box('back-wall', [20,7,.22], [0,3.4,7], wall);
    this.box('left-wall', [.22,7,18], [-9,3.4,0], wall);
    for(let x=-8;x<=8;x+=2){
      this.box('wainscot', [1.84,1.8,.15], [x,.9,6.8], panel);
      this.box('vertical-inlay', [.025,1.6,.035], [x-.82,.9,6.69], this.brass);
    }
    this.box('chair-rail', [19,.08,.15], [0,1.9,6.65], this.brass);
    this.box('picture-frame', [4.4,2.4,.12], [0,4.4,6.72], this.brass);
    this.box('picture-inner', [4.23,2.23,.14], [0,4.4,6.63], dark);
    this.label('LA CASA DEL AZAR', 0,4.45,6.52,3.7,.55, '#d5b97c', '#181d20');
    this.label('PROBABILIDAD · ARCHIVO Nº 03', 0,3.95,6.51,3.6,.24, '#9e998b', '#181d20');
    for(const x of [-6,6]) {
      this.box('alcove', [2,3.7,.13], [x,3.9,6.73], dark);
      for(const dx of [-1.03,1.03]) this.box('alcove-column', [.12,3.9,.24], [x+dx,3.8,6.57], this.brass);
      const arch = CreateTorus('arched-crown',{diameter:2.08,thickness:.12,tessellation:32},this.scene);
      arch.rotation.x=Math.PI/2; arch.position.set(x,5.65,6.58); arch.material=this.brass;
      this.box('alcove-sill',[2.2,.12,.4],[x,2.05,6.45],this.brass);
    }
    // Elliptical, layered table: a readable silhouette and a brass lip against dark walnut.
    const table=this.cylinder('table-edge', 7, .28, [0,1.5,0], wood); table.scaling.z=.72;
    const lip=this.cylinder('table-lip',6.87,.055,[0,1.665,0],this.brass); lip.scaling.z=.72;
    const top=this.cylinder('table-felt',6.68,.05,[0,1.70,0],felt); top.scaling.z=.72;
    const inset=CreateTorus('felt-inlay',{diameter:6.2,thickness:.016,tessellation:80},this.scene);
    inset.position.y=1.735; inset.scaling.z=.7; inset.material=this.brass;
    this.cylinder('table-pedestal',.85,1.3,[0,.69,0],wood);
    for(const x of [-1,1]) this.box('pedestal-foot',[2.2,.18,.34],[x*.5,.12,0],wood).rotation.y=x*.6;
    for(const x of [-1.05,1.05]) this.makeUrn(x);
    for(let i=0;i<3;i++) this.box('record-file',[.8,.04,1.1],[2.35,1.76+i*.05,.3],this.ivory).rotation.y=.15-i*.08;
    const die=this.box('die',[.34,.34,.34],[-2.35,1.92,-.3],this.ivory);die.rotation.y=.3;
    for(const dx of [-.085,.085]) for(const dz of [-.085,.085]) this.cylinder('die-pip',.045,.012,[-2.35+dx,2.1,-.3+dz],dark);
    // Vera: exaggerated face, expressive brows, asymmetric hair, tailored teal coat.
    const skin=this.material('vera-skin','#C89572',0,.75);
    const hair=this.material('vera-hair','#211A22',0,.8);
    const coat=this.material('vera-coat','#28565B',.05,.65);
    const body=this.sphere('vera-coat',[0,2.45,2.65],[1.5,1.8,.8],coat);
    this.box('shirt',[.47,.85,.18],[0,2.8,2.18],this.ivory);
    this.sphere('bow-left',[-.13,3.12,2.04],[.24,.13,.12],dark);
    this.sphere('bow-right',[.13,3.12,2.04],[.24,.13,.12],dark);
    this.sphere('vera-face',[0,3.72,2.45],[1.1,1.35,.95],skin);
    this.sphere('hair-back',[0,3.98,2.65],[1.2,1.3,.8],hair);
    this.sphere('hair-swoop',[-.35,4.29,2.22],[.8,.42,.5],hair).rotation.z=-.3;
    for(const x of [-.28,.28]) {
      this.sphere('ear',[x*2.05,3.75,2.48],[.22,.37,.23],skin);
      this.sphere('eye-white',[x,3.86,2.025],[.32,.24,.1],this.ivory);
      this.sphere('pupil',[x,3.85,1.965],[.11,.14,.045],dark);
      const brow=this.box('brow',[.32,.065,.075],[x,4.08,2.01],hair);brow.rotation.z=x<0?-.15:.25;
      this.sphere('hand',[x*4,1.94,1.45],[.45,.25,.52],skin);
      const arm=this.sphere('sleeve',[x*3.5,2.25,2.02],[.52,.9,.55],coat);arm.rotation.x=-.5;arm.rotation.z=x<0?-.4:.4;
    }
    this.sphere('nose',[0,3.7,1.96],[.18,.3,.23],skin);
    const mouth=this.box('knowing-smile',[.35,.045,.04],[.04,3.45,2.01],dark);mouth.rotation.z=.12;
    this.cylinder('hat-brim',1.65,.1,[.08,4.53,2.5],hair);
    this.cylinder('hat-crown',1.05,.65,[.08,4.84,2.5],hair);
    this.cylinder('hat-band',1.07,.13,[.08,4.61,2.5],this.brass);
    body.isPickable=false;
    // Hanging practical with luminous underside. Lighting needs no shadow-map allocation.
    const lamp=this.cylinder('lamp-shade',2.1,.5,[-.2,5.7,-.1],dark,1.05);
    lamp.material=this.brass;
    this.cylinder('lamp-cord',.035,1.7,[-.2,6.8,-.1],dark);
    const glow=this.material('lamp-glow','#FFE4AD',0,.7); glow.emissiveColor=new Color3(1,.65,.26);
    this.cylinder('lamp-diffuser',1.95,.03,[-.2,5.44,-.1],glow);
    this.updateUrns([{red:3,blue:2},{red:2,blue:3}],null);
    this.scene.onPointerObservable.add(info=>{
      if(info.type!==PointerEventTypes.POINTERPICK || this.mode!=='table')return;
      const mesh=info.pickInfo?.pickedMesh;
      const urn=mesh?.metadata?.urn as unknown;
      if(urn===0||urn===1)onUrn(urn);
    });
    this.engine.runRenderLoop(()=>{
      const dt=Math.min(this.engine.getDeltaTime()/1000,.05);
      const t=this.reduced?1:1-Math.exp(-8*dt);
      this.camera.position=Vector3.Lerp(this.camera.position,this.destination,t);
      this.currentFocus=Vector3.Lerp(this.currentFocus,this.focus,t);
      this.camera.setTarget(this.currentFocus);
      this.scene.render();
    });
    window.addEventListener('resize',this.resize);
  }

  private material(name:string,hex:string,metallic:number,roughness:number):PBRMaterial {
    const m=new PBRMaterial(name,this.scene);m.albedoColor=Color3.FromHexString(hex);m.metallic=metallic;m.roughness=roughness;return m;
  }
  private box(name:string,size:number[],at:number[],mat:PBRMaterial):Mesh {
    const m=CreateBox(name,{width:size[0]!,height:size[1]!,depth:size[2]!},this.scene);m.position.set(at[0]!,at[1]!,at[2]!);m.material=mat;m.isPickable=false;return m;
  }
  private sphere(name:string,at:number[],scale:number[],mat:PBRMaterial):Mesh {
    const m=CreateSphere(name,{diameter:1,segments:12},this.scene);m.position.set(at[0]!,at[1]!,at[2]!);m.scaling.set(scale[0]!,scale[1]!,scale[2]!);m.material=mat;m.isPickable=false;return m;
  }
  private cylinder(name:string,diameter:number,height:number,at:number[],mat:PBRMaterial,top?:number):Mesh {
    const m=CreateCylinder(name,{diameterBottom:diameter,diameterTop:top??diameter,height,tessellation:48},this.scene);m.position.set(at[0]!,at[1]!,at[2]!);m.material=mat;m.isPickable=false;return m;
  }
  private label(text:string,x:number,y:number,z:number,width:number,height:number,ink:string,bg:string):Mesh {
    const texture=new DynamicTexture('type-'+text,{width:1024,height:256},this.scene,false);
    texture.drawText(text,null,155,'bold 65px Georgia',ink,bg,true,true);
    const mat=new StandardMaterial('label-'+text,this.scene);mat.diffuseTexture=texture;mat.emissiveColor=Color3.White();mat.disableLighting=true;
    const plane=CreatePlane('label-'+text,{width,height},this.scene);plane.position.set(x,y,z);plane.material=mat;plane.isPickable=false;return plane;
  }
  private makeUrn(x:number):void {
    const index:0|1=x<0?0:1;
    const base=this.cylinder('urn-base',1.34,.12,[x,1.81,-.25],this.brass);base.metadata={urn:index};base.isPickable=true;
    const glass=this.material('glass-'+index,'#C3E4DC',.05,.15);glass.alpha=.12;glass.backFaceCulling=false;
    const vessel=this.cylinder('glass-urn',1.22,1.25,[x,2.48,-.25],glass);vessel.metadata={urn:index};vessel.isPickable=true;
    const rim=CreateTorus('urn-rim',{diameter:1.23,thickness:.055,tessellation:48},this.scene);rim.position.set(x,3.11,-.25);rim.material=this.brass;rim.isPickable=false;
    const ring=CreateTorus('selection-ring',{diameter:1.5,thickness:.045,tessellation:48},this.scene);ring.position.set(x,1.79,-.25);ring.material=this.ivory;ring.isVisible=false;ring.isPickable=false;this.rings.push(ring);
    this.label(index===0?'U':'V',x,1.98,-.9,.32,.32,'#f0dfc0','#243b35');
  }
  setMode(mode:'menu'|'room'|'table',reducedMotion?:boolean):void {
    this.mode=mode;if(reducedMotion!==undefined)this.reduced=reducedMotion;
    this.destination=mode==='menu'?new Vector3(7,5.5,-10):mode==='room'?new Vector3(0,4.6,-9):new Vector3(1.2,4.8,-5.8);
    this.focus=mode==='table'?new Vector3(1.2,2.15,.1):new Vector3(0,2.4,1.2);
  }
  updateUrns(urns:readonly {red:number;blue:number}[],selected:number|null,revealed?:'red'|'blue'):void {
    this.tokens.forEach(m=>m.dispose());this.tokens=[];
    urns.slice(0,2).forEach((urn,i)=>{
      const x=i===0?-1.05:1.05;
      const kinds:('red'|'blue')[]=[...Array.from({length:Math.min(urn.red,12)},()=> 'red' as const),...Array.from({length:Math.min(urn.blue,12)},()=> 'blue' as const)];
      // A literal inventory display, not a physical random pile: every symbol is separated.
      const columns=kinds.length<=6?2:Math.ceil(Math.sqrt(kinds.length));
      const rows=Math.ceil(kinds.length/columns);
      const spacing=Math.min(.39,.90/Math.max(1,Math.max(rows,columns)-1));
      kinds.forEach((kind,n)=>{
        const token=CreateCylinder(kind+'-token',{diameter:spacing*.87,height:.085,tessellation:kind==='red'?3:32},this.scene);
        token.position.set(x+((n%columns)-(columns-1)/2)*spacing,2.02+Math.floor(n/columns)*spacing,-.45);
        token.rotation.x=Math.PI/2;token.rotation.y=kind==='red'?Math.PI/6:0;
        token.material=kind==='red'?this.red:this.blue;token.metadata={urn:i};token.isPickable=true;this.tokens.push(token);
      });
    });
    this.rings.forEach((r,i)=>r.isVisible=i===selected);
    if(revealed){
      const t=CreateCylinder('revealed-'+revealed,{diameter:.53,height:.15,tessellation:revealed==='red'?3:32},this.scene);
      t.position.set(0,1.85,-1.5);t.material=revealed==='red'?this.red:this.blue;t.isPickable=false;this.tokens.push(t);
    }
  }
  setSettings(settings:{reducedMotion:boolean;sensitivity:number;fov:number}):void {
    this.reduced=settings.reducedMotion;this.camera.fov=Math.min(95,Math.max(45,settings.fov))*Math.PI/180;
  }
  /** A point-in-time renderer sample; no claim about other devices or a frame-time percentile. */
  metrics():{meshCount:number;activeMeshCount:number;geometryTriangles:number;fps:number;renderWidth:number;renderHeight:number;renderer:string} {
    return {meshCount:this.scene.meshes.length,activeMeshCount:this.scene.getActiveMeshes().length,
      geometryTriangles:this.scene.meshes.reduce((total,mesh)=>total+mesh.getTotalIndices()/3,0),
      fps:this.engine.getFps(),renderWidth:this.engine.getRenderWidth(),renderHeight:this.engine.getRenderHeight(),
      renderer:this.engine.getGlInfo().renderer};
  }
  dispose():void {window.removeEventListener('resize',this.resize);this.scene.dispose();this.engine.dispose();}
}
