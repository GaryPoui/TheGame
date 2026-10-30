export type CameraMode='exploration'|'dialogue'|'table'|'cinematic';
export interface RoomPosition{x:number;z:number}
export const ROOM_LIMIT=3;
export function clampPosition(p:RoomPosition):RoomPosition{return {x:Math.max(-ROOM_LIMIT,Math.min(ROOM_LIMIT,p.x)),z:Math.max(-ROOM_LIMIT,Math.min(ROOM_LIMIT,p.z))};}
/** Logical modes control input permissions; rendering keeps the painted theatre framing. */
export class CameraController {
 mode:CameraMode='cinematic';position:RoomPosition={x:0,z:2};revision=0;
 setMode(mode:CameraMode):void{this.mode=mode;this.revision++;}
 move(dx:number,dz:number):boolean {if(this.mode!=='exploration'||!Number.isFinite(dx)||!Number.isFinite(dz))return false;this.position=clampPosition({x:this.position.x+dx,z:this.position.z+dz});return true;}
}
