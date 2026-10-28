import {createGame,saveGame,loadGame,type SaveStorage} from '../../src/core/game';
import {describe,it,expect} from 'vitest';
import {createRecords,applyRecordsCommand,bestRecords,recordsChoices,validRecordsState,type RecordsState} from '../../src/core/tables/records';
const action=(s:RecordsState,good=true)=>applyRecordsCommand(s,{type:s.phase==='tutorial'?s.diagnostic===null?'diagnose':'begin':s.phase==='choose'?'choose':'next',choice:s.phase==='tutorial'?'no':good||s.assisted?bestRecords(s)[0]:recordsChoices(s).find(c=>!bestRecords(s).includes(c)),commandId:'p'+s.revision,expectedRevision:s.revision});
describe('Las fotos tramposas',()=>{
 it('writes a v4 envelope that older clients preserve as future, while loading legacy v3',()=>{const values=new Map<string,string>();const store:SaveStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>{values.set(k,v);},removeItem:k=>{values.delete(k);}};const s=createGame(6);values.set('thegame.save.v1.current',JSON.stringify({schemaVersion:3,contentVersion:'campaign-v3',state:s}));expect(loadGame(store).state).toEqual(s);expect(saveGame(s,store)).toBeNull();expect(JSON.parse(values.get('thegame.save.v1.current')!).schemaVersion).toBe(4);expect(loadGame(store).state).toEqual(s);});
 it('requires a diagnostic, preserves either initial answer without points or RNG and refuses replacement',()=>{
  for(const choice of ['yes','no'] as const){const s=createRecords(4);expect(applyRecordsCommand(s,{type:'begin',commandId:'early',expectedRevision:0})).toBe(s);const c={type:'diagnose' as const,choice,commandId:'diagnostic',expectedRevision:0};const n=applyRecordsCommand(s,c);expect(n.diagnostic).toBe(choice);expect(n.merit).toBe(0);expect(n.history).toEqual([]);expect(n.rng).toEqual(s.rng);expect(validRecordsState(n)).toBe(true);expect(applyRecordsCommand(n,c)).toBe(n);expect(applyRecordsCommand(n,{...c,commandId:'replace',expectedRevision:n.revision})).toBe(n);}
 });
 it('reveals all prepared results even after choosing the biased album, without changing chance',()=>{
  let s=action(action(createRecords(1)));const rng=s.rng;s=applyRecordsCommand(s,{type:'choose',choice:'album',expectedRevision:s.revision,commandId:'wrong-source'});expect(s.source).toBe('complete');expect(s.observations.filter(v=>v===0)).toHaveLength(4);expect(s.merit).toBe(0);expect(s.rng).toEqual(rng);expect(validRecordsState(s)).toBe(true);
 });
 it('finishes with eight good decisions or finite help after eight mistakes, replaying every checkpoint',()=>{
  for(const good of [true,false])for(const repeat of [true,false]){let s=createRecords(9,repeat),rng=s.rng;for(let i=0;i<30&&s.phase!=='complete';i++){s=action(s,good);expect(validRecordsState(s)).toBe(true);expect(s.rng).toEqual(rng);}expect(s.phase).toBe('complete');expect(s.merit).toBe(good?8:0);expect(s.assisted).toBe(!good);}
 });
 it('rejects forged answers and unsupported content while accepting legacy checkpoints unchanged',()=>{
  let s=createRecords(19,false,'legacy');s=applyRecordsCommand(s,{type:'begin',commandId:'old',expectedRevision:0});expect(validRecordsState(s)).toBe(true);expect(s.experience).toBeUndefined();const n=action(createRecords(19));expect(validRecordsState({...n,diagnostic:'yes'})).toBe(false);expect(validRecordsState({...n,experience:'photos-v99'})).toBe(false);
 });
});
