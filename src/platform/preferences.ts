import type {Settings} from '../core/game';
const key='thegame.preferences.v1';
type Store=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
/** Preferences also survive when no campaign has been started. Ignore unknown data. */
export function loadPreferences(fallback:Settings,store?:Store):Settings {
 const result=structuredClone(fallback);
 try {
  const raw=(store??globalThis.localStorage).getItem(key);
  if(!raw||raw.length>512)return result;
  const p:unknown=JSON.parse(raw);
  if(!p||typeof p!=='object'||!('version' in p)||p.version!==1)return result;
  if('volume' in p&&typeof p.volume==='number'&&Number.isFinite(p.volume)&&p.volume>=0&&p.volume<=1)result.volume=p.volume;
  if('textScale' in p&&typeof p.textScale==='number'&&[1,1.25,1.5,2].includes(p.textScale))result.textScale=p.textScale;
  if('reducedMotion' in p&&typeof p.reducedMotion==='boolean')result.reducedMotion=p.reducedMotion;
 } catch { /* Unavailable or damaged preferences never block the game. */ }
 return result;
}
export function savePreferences(s:Settings,store?:Store):boolean {
 try {(store??globalThis.localStorage).setItem(key,JSON.stringify({version:1,volume:s.volume,textScale:s.textScale,reducedMotion:s.reducedMotion}));return true;}catch{return false;}
}
export function resetPreferences(store?:Store):void {
 try {(store??globalThis.localStorage).removeItem(key);}catch{/* Defaults still work in memory. */}
}
