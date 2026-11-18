import type {RoomPosition} from './camera-controller';
import type {TableId} from '../core/campaign/progression';
export const ROOM_TABLES:readonly {id:TableId;x:number;z:number;name:string}[]=[{id:'urns',x:-2,z:1,name:'Vera'},{id:'contracts',x:-2,z:-2,name:'Doble'},{id:'records',x:2,z:-2,name:'Ada'},{id:'finale',x:2,z:1,name:'El anfitrión'}];
/** Open floor plan: no wall can be bypassed by proximity interaction. */
export function nearbyTable(p:RoomPosition):typeof ROOM_TABLES[number]|null{return ROOM_TABLES.find(t=>Math.hypot(t.x-p.x,t.z-p.z)<=1.2)??null;}
