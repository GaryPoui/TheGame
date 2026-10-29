import {it,expect} from 'vitest';
import {INTRO} from '../../src/content/intro';
import {validateDialogue} from '../../src/content/dialogue-schema';
import {createDialogue,applyDialogue,validDialogue} from '../../src/core/dialogue/runner';
import {createTutorial,advanceTutorial,requestHelp} from '../../src/core/tutorial/runner';
import {CameraController} from '../../src/presentation/camera-controller';
import {nearbyTable} from '../../src/presentation/interaction';
import {defaultSettings,createGame,choose,advance,bestChoices,saveGame,loadGame,type SaveStorage} from '../../src/core/game';
import {rebind,actionForKey} from '../../src/platform/input';
import {dbGain} from '../../src/platform/audio';
import {checkpointCampaign,tableUnlocked} from '../../src/core/campaign/progression';
it('all dialogue paths terminate; release happens once and skip has the same effect',()=>{
 let s=createDialogue(INTRO);expect(validateDialogue(INTRO)).toBe(true);
 for(let i=0;i<3;i++){const c={id:`d${i}`,revision:s.revision,type:'next' as const};s=applyDialogue(INTRO,s,c);expect(validDialogue(INTRO,s)).toBe(true);expect(applyDialogue(INTRO,s,c)).toBe(s);}
 const skipped=applyDialogue(INTRO,createDialogue(INTRO),{id:'skip',revision:0,type:'skip'});
 expect(s.effects).toEqual(['released']);expect(skipped.effects).toEqual(s.effects);expect(s.ended).toBe(true);expect(skipped.ended).toBe(true);
 expect(validateDialogue({...INTRO,nodes:[{...INTRO.nodes[0]!,next:INTRO.start}]})).toBe(false);
 expect(validDialogue(INTRO,{...s,effects:[]})).toBe(false);
});
it('explicit branches validate and invalid choices have no effects',()=>{
 const g={id:'branch',start:'a',strings:{a:'Choose',b:'Done'},nodes:[{id:'a',speaker:'Vera',lineId:'a',next:null,choices:[{id:'ok',lineId:'b',to:'b'}]},{id:'b',speaker:'Vera',lineId:'b',next:null}]};
 const s=createDialogue(g);expect(applyDialogue(g,s,{id:'bad',revision:0,type:'next',choice:'missing'})).toBe(s);expect(applyDialogue(g,s,{id:'yes',revision:0,type:'next',choice:'ok'}).node).toBe('b');
});
it('tutorial helpers preserve finite five stages and deduplicate help',()=>{let s=createTutorial();s=requestHelp(s,'fractions');s=requestHelp(s,'fractions');expect(s.helpIds).toEqual(['fractions']);for(let i=0;i<5;i++)s=advanceTutorial(s);expect(s.finished).toBe(true);expect(advanceTutorial(s)).toBe(s);});
it('four modes cancel movement, clamp room bounds and keep return position',()=>{
 const c=new CameraController();for(const mode of ['dialogue','table','cinematic'] as const){c.setMode(mode);expect(c.move(1,1)).toBe(false);}
 c.setMode('exploration');c.move(-2,-1);expect(nearbyTable(c.position)?.id).toBe('urns');const p={...c.position};c.setMode('table');c.move(10,10);expect(c.position).toEqual(p);c.setMode('exploration');c.move(99,-99);expect(c.position).toEqual({x:3,z:-3});
});
it('all movement and interaction bindings detect conflicts without changing keys',()=>{
 const keys=structuredClone(defaultSettings.keys);expect(rebind(keys,'forward','KeyA')).toBeNull();const next=rebind(keys,'forward','KeyJ')!;expect(actionForKey(next,'KeyJ')).toBe('forward');expect(actionForKey(next,'KeyW')).toBeNull();expect(keys.forward).toBe('KeyW');expect(dbGain(-6)).toBeCloseTo(.501187);
});
it('v1 and v2 snapshots migrate without losing state; completed seals survive practice',()=>{
 const map=new Map<string,string>(),store:SaveStorage={getItem:k=>map.get(k)??null,setItem:(k,v)=>{map.set(k,v);},removeItem:k=>{map.delete(k);}};
 for(const [schemaVersion,contentVersion] of [[1,'urns-mvp-v1'],[2,'urns-contracts-v2']] as const){const s=createGame(2);map.set('thegame.save.v1.current',JSON.stringify({schemaVersion,contentVersion,state:s}));expect(loadGame(store).state).toEqual(s);expect(saveGame(s,store)).toBeNull();expect(JSON.parse(map.get('thegame.save.v1.current')!).schemaVersion).toBe(5);}
 let s=createGame(3);while(s.phase!=='complete')s=s.phase==='choose'||s.phase==='guided'?choose(s,bestChoices(s)[0] as 0|1):advance(s);
 s=checkpointCampaign(s);expect(tableUnlocked(s,'contracts')).toBe(true);expect(tableUnlocked(s,'records')).toBe(false);const practice={...createGame(4),seals:s.seals!};expect(checkpointCampaign(practice).seals?.urnsMethod).toBe('independent');expect(tableUnlocked(practice,'contracts')).toBe(true);
});

it('repeated urn transfer uses fresh documented counts and stays save-valid',()=>{
 let s=createGame(8);s.urnVariant='repeat';
 while(s.round!==3)s=s.phase==='choose'||s.phase==='guided'?choose(s,bestChoices(s)[0] as 0|1):advance(s);
 expect(s.urns).toEqual([{red:4,blue:2},{red:2,blue:2}]);expect(bestChoices(s)).toEqual([1]);
 const map=new Map<string,string>();const store:SaveStorage={getItem:k=>map.get(k)??null,setItem:(k,v)=>{map.set(k,v);},removeItem:k=>{map.delete(k);}};
 expect(saveGame(s,store)).toBeNull();expect(loadGame(store).state).toEqual(s);
});
