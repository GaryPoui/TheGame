import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { SpotLight } from '@babylonjs/core/Lights/spotLight';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { ImageProcessingConfiguration } from '@babylonjs/core/Materials/imageProcessingConfiguration';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { HDRCubeTexture } from '@babylonjs/core/Materials/Textures/hdrCubeTexture';
import { CreateLathe } from '@babylonjs/core/Meshes/Builders/latheBuilder';
import { createDealer } from './dealer';
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
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

/** Local scanned CC0 materials, original set dressing and a CC0 anatomical head. */
export class GameScene {
  readonly ready: Promise<void>;
  private engine: Engine;
  private scene: Scene;
  private camera: FreeCamera;
  private shadows: ShadowGenerator;
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
    this.scene.ambientColor = new Color3(.025, .028, .026);
    this.scene.imageProcessingConfiguration.exposure = 1.05;
    this.scene.imageProcessingConfiguration.contrast = 1.2;
    this.scene.imageProcessingConfiguration.toneMappingEnabled = true;
    this.scene.imageProcessingConfiguration.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
    this.scene.environmentTexture = new HDRCubeTexture(this.url('studio.hdr'), this.scene, 128, false, true, false, true);
    this.scene.environmentIntensity = .3;
    this.camera = new FreeCamera('controlled-camera', this.destination.clone(), this.scene);
    this.camera.minZ = .1;
    this.camera.maxZ = 50;
    this.camera.fov = .7;
    this.camera.setTarget(this.focus);
    const fill = new DirectionalLight('soft-portrait-fill', new Vector3(.12,-.3,1), this.scene);
    fill.intensity = .75;
    fill.diffuse = new Color3(1,.85,.68);
    const key = new SpotLight('warm-table-light', new Vector3(-1, 5.4, -1), new Vector3(.12,-1,.14), 1.6, 1.5, this.scene);
    key.diffuse = new Color3(1, .83, .61); key.intensity = 115; key.range = 17;
    key.shadowMinZ = .5; key.shadowMaxZ = 18;
    this.shadows = new ShadowGenerator(1024,key);
    this.shadows.usePercentageCloserFiltering = true;
    this.shadows.filteringQuality = ShadowGenerator.QUALITY_MEDIUM;
    this.shadows.bias = .0003; this.shadows.normalBias = .015; this.shadows.setDarkness(.18);
    this.brass = this.material('aged-brass', '#A9915E', .86, .34);
    this.ivory = this.material('warm-ivory', '#D9CFB4', 0, .88);
    this.red = this.material('red-triangle', '#9B1728', .12, .28);
    this.blue = this.material('blue-circle', '#125F8D', .12, .28);
    const wood = this.scanned('dark_wood', '#8E7865', 1.4);
    const dark = this.material('charcoal', '#181D20', .05, .72);
    const felt = this.material('teal-felt', '#17382C', 0, .96);
    felt.bumpTexture = this.map('fabric_pattern_07/normal.jpg',8,false); felt.bumpTexture.level=.14;
    const wall = this.scanned('plastered_wall_02', '#556155', 3);
    const panel = wood;
    const floor = this.box('floor', [22,.12,26], [0,-.12,0], this.scanned('wood_floor','#817663',5));
    floor.receiveShadows = true;
    floor.isPickable = false;
    this.box('back-wall', [20,7,.22], [0,3.4,7], wall);
    this.box('left-wall', [.22,7,18], [-9,3.4,0], wall);
    this.box('right-wall', [.22,7,26], [10,3.4,0], wall);
    for(let x=-8;x<=8;x+=2){
      this.box('wainscot', [1.84,1.8,.15], [x,.9,6.8], panel);
      this.box('vertical-inlay', [.025,1.6,.035], [x-.82,.9,6.69], this.brass);
    }
    this.box('chair-rail', [19,.08,.15], [0,1.9,6.65], this.brass);
    this.box('picture-frame', [4.4,2.4,.12], [0,4.4,6.72], this.brass);
    this.box('picture-inner', [4.23,2.23,.14], [0,4.4,6.63], dark);
    this.label('LA CASA DEL AZAR', 0,4.45,6.52,3.7,.55, '#d5b97c', '#181d20');
    this.label('PROBABILIDAD · ARCHIVO Nº 03', 0,3.95,6.51,3.6,.24, '#9e998b', '#181d20');
    const windowGlass=this.material('night-window','#17252A',.2,.24);
    for(const x of [-6,6]) {
      this.box('window-recess',[2.05,3.25,.14],[x,3.9,6.72],dark);
      this.box('night-window-pane',[1.92,3.12,.035],[x,3.9,6.62],windowGlass);
      for(const dx of [-1.04,1.04]) this.box('window-frame',[.1,3.45,.2],[x+dx,3.9,6.52],wood);
      for(const y of [2.21,5.59]) this.box('window-frame-top',[2.18,.1,.2],[x,y,6.52],wood);
      this.box('window-mullion',[.045,3.25,.08],[x,3.9,6.48],wood);
      for(const y of [3.35,4.45]) this.box('window-crossbar',[2,.045,.08],[x,y,6.48],wood);
      this.box('oak-window-sill',[2.3,.12,.38],[x,2.1,6.4],wood);
    }
    // Elliptical, layered table: a readable silhouette and a brass lip against dark walnut.
    const table=this.cylinder('table-edge', 7, .28, [0,1.5,0], wood); table.scaling.z=.72;
    const lip=this.cylinder('table-lip',6.87,.055,[0,1.665,0],this.brass); lip.scaling.z=.72;
    const top=this.cylinder('table-felt',6.68,.05,[0,1.70,0],felt); top.scaling.z=.72; top.receiveShadows=true;
    const inset=CreateTorus('felt-inlay',{diameter:6.2,thickness:.016,tessellation:80},this.scene);
    inset.position.y=1.735; inset.scaling.z=.7; inset.material=this.brass;
    this.cylinder('table-pedestal',.85,1.3,[0,.69,0],wood);
    for(const x of [-1,1]) this.box('pedestal-foot',[2.2,.18,.34],[x*.5,.12,0],wood).rotation.y=x*.6;
    for(const x of [-1.05,1.05]) this.makeUrn(x);
    for(let i=0;i<3;i++) this.box('record-file',[.8,.04,1.1],[2.35,1.76+i*.05,.3],this.ivory).rotation.y=.15-i*.08;
    const die=this.box('die',[.34,.34,.34],[-2.35,1.92,-.3],this.ivory);die.rotation.y=.3;
    for(const dx of [-.085,.085]) for(const dz of [-.085,.085]) this.cylinder('die-pip',.045,.012,[-2.35+dx,2.1,-.3+dz],dark);
    const dealer = createDealer(this.scene);
    dealer.root.setPivotPoint(new Vector3(0,1.9,-1));
    dealer.root.scaling.setAll(1.65);
    dealer.root.position.y=-.17;
    dealer.shadowMeshes.forEach(mesh=>this.shadows.addShadowCaster(mesh));
    const leather=this.material('chair-leather','#321E18',0,.65);
    this.box('dealer-chair-back',[.95,1.1,.18],[0,2.12,3.17],leather);
    for(const x of [-.5,.5]) this.box('chair-post',[.065,1.7,.065],[x,1.8,3.2],wood);
    // Hanging practical with luminous underside. Lighting needs no shadow-map allocation.
    const lamp=this.cylinder('lamp-shade',2.1,.5,[-.2,5.7,-.1],dark,1.05);
    lamp.material=this.brass;
    this.cylinder('lamp-cord',.035,1.7,[-.2,6.8,-.1],dark);
    const glow=this.material('lamp-glow','#FFE4AD',0,.7); glow.emissiveColor=new Color3(1,.65,.26);
    this.cylinder('lamp-diffuser',1.95,.03,[-.2,5.44,-.1],glow);
    for(const mesh of this.scene.meshes) {
      if(['table-edge','die','record-file','urn-base'].includes(mesh.name))this.shadows.addShadowCaster(mesh);
    }
    this.updateUrns([{red:3,blue:2},{red:1,blue:1}],null);
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
    this.ready=new Promise(resolve=>this.scene.executeWhenReady(resolve));
    window.addEventListener('resize',this.resize);
  }

  private url(path:string):string {return `${import.meta.env.BASE_URL}textures/${path}`;}
  private map(path:string,scale=1,gamma=true):Texture {
    const texture=new Texture(this.url(path),this.scene,false,false,Texture.TRILINEAR_SAMPLINGMODE);
    texture.uScale=scale;texture.vScale=scale;texture.gammaSpace=gamma;
    texture.anisotropicFilteringLevel=4;return texture;
  }
  private scanned(folder:string,tint:string,scale:number):PBRMaterial {
    const m=this.material(folder,tint,1,1);
    m.albedoTexture=this.map(`${folder}/albedo.jpg`,scale);
    m.bumpTexture=this.map(`${folder}/normal.jpg`,scale,false);m.bumpTexture.level=.32;
    m.metallicTexture=this.map(`${folder}/arm.jpg`,scale,false);
    m.useAmbientOcclusionFromMetallicTextureRed=true;m.useRoughnessFromMetallicTextureGreen=true;
    m.useMetallnessFromMetallicTextureBlue=true;return m;
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
    const single=text.length<=2;
    const texture=new DynamicTexture('type-'+text,{width:single?256:1024,height:256},this.scene,false);
    texture.drawText(text,null,single?205:155,single?'bold 195px Georgia':'bold 65px Georgia',ink,bg,true,true);
    const mat=new StandardMaterial('label-'+text,this.scene);mat.diffuseTexture=texture;mat.emissiveColor=Color3.White();mat.disableLighting=true;
    const plane=CreatePlane('label-'+text,{width,height},this.scene);plane.position.set(x,y,z);plane.material=mat;plane.isPickable=false;return plane;
  }
  private makeUrn(x:number):void {
    const index:0|1=x<0?0:1;
    const base=this.cylinder('urn-base',1.34,.12,[x,1.81,-.25],this.brass);base.metadata={urn:index};base.isPickable=true;
    const glass=this.material('glass-'+index,'#ECF5F1',0,.09);glass.alpha=.035;glass.backFaceCulling=false;
    glass.indexOfRefraction=1.48;glass.transparencyMode=PBRMaterial.PBRMATERIAL_ALPHABLEND;
    glass.clearCoat.isEnabled=true;glass.clearCoat.intensity=1;glass.clearCoat.roughness=.06;
    const vessel=CreateLathe('thick-glass-urn',{
      shape:[new Vector3(.58,0,0),new Vector3(.62,.07,0),new Vector3(.62,1.25,0),new Vector3(.6,1.28,0),new Vector3(.575,1.25,0),new Vector3(.57,.065,0)],
      tessellation:64,sideOrientation:Mesh.FRONTSIDE,
    },this.scene);
    vessel.position.set(x,1.83,-.25);vessel.material=glass;vessel.metadata={urn:index};vessel.isPickable=true;
    const rim=CreateTorus('urn-rim',{diameter:1.23,thickness:.055,tessellation:48},this.scene);rim.position.set(x,3.11,-.25);rim.material=this.brass;rim.isPickable=false;
    const ring=CreateTorus('selection-ring',{diameter:1.5,thickness:.045,tessellation:48},this.scene);ring.position.set(x,1.79,-.25);ring.material=this.ivory;ring.isVisible=false;ring.isPickable=false;this.rings.push(ring);
    this.box('identification-plate',[.44,.25,.018],[x,1.94,-.94],this.brass);
    this.label(index===0?'U':'V',x,1.95,-.952,.28,.19,'#f0dfc0','#243b35');
  }
  setMode(mode:'menu'|'room'|'table',reducedMotion?:boolean):void {
    this.mode=mode;if(reducedMotion!==undefined)this.reduced=reducedMotion;
    this.destination=mode==='menu'?new Vector3(7,5.5,-10):mode==='room'?new Vector3(0,4.6,-9):new Vector3(1.2,4.8,-5.8);
    this.focus=mode==='table'?new Vector3(1.2,2.15,.1):new Vector3(0,2.4,1.2);
  }
  updateUrns(urns:readonly {red:number;blue:number}[],selected:number|null,revealed?:'red'|'blue'):void {
    this.tokens.forEach(m=>{this.shadows.removeShadowCaster(m);m.dispose();});this.tokens=[];
    urns.slice(0,2).forEach((urn,i)=>{
      const x=i===0?-1.05:1.05;
      const kinds:('red'|'blue')[]=[...Array.from({length:Math.min(urn.red,12)},()=> 'red' as const),...Array.from({length:Math.min(urn.blue,12)},()=> 'blue' as const)];
      // Separated chips rest on the urn floor; the DOM provides exact counts at every angle.
      kinds.forEach((kind,n)=>{
        const token=CreateCylinder(kind+'-token',{diameter:.34,height:.055,tessellation:kind==='red'?3:40},this.scene);
        token.position.set(x+((n%2)-.5)*.4,1.94+n*.004,-.61+Math.floor(n/2)*.33);
        token.rotation.y=kind==='red'?Math.PI/6+n*.11:n*.2;
        token.material=kind==='red'?this.red:this.blue;token.metadata={urn:i};token.isPickable=true;
        token.receiveShadows=true;this.shadows.addShadowCaster(token);this.tokens.push(token);
      });
    });
    this.rings.forEach((r,i)=>r.isVisible=i===selected);
    if(revealed){
      const t=CreateCylinder('revealed-'+revealed,{diameter:.53,height:.15,tessellation:revealed==='red'?3:32},this.scene);
      t.position.set(0,1.85,-1.5);t.material=revealed==='red'?this.red:this.blue;t.isPickable=false;
      t.receiveShadows=true;this.shadows.addShadowCaster(t);this.tokens.push(t);
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
