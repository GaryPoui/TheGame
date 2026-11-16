import {it,expect} from 'vitest';
import {defaultSettings} from '../../src/core/game';
import {loadPreferences,savePreferences,resetPreferences} from '../../src/platform/preferences';
function memory(raw:string|null=null){return {getItem:()=>raw,setItem:(_k:string,v:string)=>{raw=v;},removeItem:()=>{raw=null;}};}
it('preferences retain only validated display and sound values without altering campaign settings',()=>{
 const store=memory();const settings={...structuredClone(defaultSettings),textScale:2,volume:0,reducedMotion:true};
 expect(savePreferences(settings,store)).toBe(true);expect(loadPreferences(defaultSettings,store)).toEqual(settings);expect(defaultSettings.textScale).toBe(1);
 const bad=memory(JSON.stringify({version:1,textScale:100,volume:-1,reducedMotion:'false',keys:{forward:'wrong'}}));expect(loadPreferences(defaultSettings,bad)).toEqual(defaultSettings);
 resetPreferences(store);expect(loadPreferences(defaultSettings,store)).toEqual(defaultSettings);
});
it('damaged, oversized, future or unavailable preferences do not prevent play',()=>{
 for(const raw of ['null','{','[]','x'.repeat(513),JSON.stringify({version:2,textScale:2})])expect(loadPreferences(defaultSettings,memory(raw))).toEqual(defaultSettings);
 const denied={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');},removeItem(){throw Error('blocked');}};
 expect(loadPreferences(defaultSettings,denied)).toEqual(defaultSettings);expect(savePreferences(defaultSettings,denied)).toBe(false);expect(()=>resetPreferences(denied)).not.toThrow();
});
