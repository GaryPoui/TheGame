import {it,expect} from 'vitest';
import {createFinale,applyFinaleCommand,bestFinale,finaleChoices,validFinaleState} from '../../src/core/tables/finale';
import {bossMechanic} from '../../src/core/tables/boss';
import {createGame,saveGame,loadGame,type SaveStorage} from '../../src/core/game';
it('recounts an urn after its first draw instead of replacing the token',()=>{
 let s=createFinale(3,'boss-v1');s=applyFinaleCommand(s,{type:'begin',commandId:'b',expectedRevision:0});
 s=applyFinaleCommand(s,{type:'choose',choice:bestFinale(s)[0],commandId:'draw',expectedRevision:s.revision});
 const rng=s.rng;s=applyFinaleCommand(s,{type:'next',commandId:'next',expectedRevision:s.revision});
 expect(s.urns.reduce((n,u)=>n+u.red+u.blue,0)).toBe(10);expect(s.boss!.urnDraws).toBe(1);expect(bossMechanic(s)).toBe('urns');expect(s.rng).toEqual(rng);
});
it('combines all three mechanics, varies order and reaches a finite independent victory',()=>{
 const orders=new Set<string>();
 for(let seed=1;seed<=20;seed++){
  let s=createFinale(seed,'boss-v1');s=applyFinaleCommand(s,{type:'begin',commandId:'start',expectedRevision:0});const seen:string[]=[];
  for(let i=0;i<50&&s.phase!=='complete';i++){
   if(s.phase==='choose')seen.push(bossMechanic(s));
   s=applyFinaleCommand(s,{type:s.phase==='choose'?'choose':'next',choice:bestFinale(s)[0],commandId:'step'+s.revision,expectedRevision:s.revision});
   expect(validFinaleState(s)).toBe(true);
  }
  expect(s.phase).toBe('complete');expect(s.assisted).toBe(false);expect(new Set(seen)).toEqual(new Set(['urns','dice','poker']));orders.add(seen.slice(0,3).join(','));
 }
 expect(orders.size).toBeGreaterThan(1);
});
it('rejects duplicate/stale attacks, preserves revealed results and detects tampering',()=>{
 let s=createFinale(8,'boss-v1');s=applyFinaleCommand(s,{type:'begin',commandId:'start',expectedRevision:0});
 const c={type:'choose' as const,choice:bestFinale(s)[0],commandId:'attack',expectedRevision:s.revision};const n=applyFinaleCommand(s,c);
 expect(applyFinaleCommand(n,c)).toBe(n);expect(s.phase).toBe('choose');expect(n.phase).toBe('feedback');expect(validFinaleState({...n,boss:{...n.boss!,health:999}})).toBe(false);
});
it('offers finite help after inferior choices without erasing campaign history',()=>{
 let s=createFinale(5,'boss-v1');s=applyFinaleCommand(s,{type:'begin',commandId:'begin',expectedRevision:0});
 for(let i=0;i<50&&!s.boss!.needsHelp;i++)s=applyFinaleCommand(s,{type:s.phase==='choose'?'choose':'next',choice:finaleChoices(s).find(c=>!bestFinale(s).includes(c))??bestFinale(s)[0],commandId:'bad'+s.revision,expectedRevision:s.revision});
 expect(s.boss!.needsHelp).toBe(true);s=applyFinaleCommand(s,{type:'assist',commandId:'help',expectedRevision:s.revision});
 for(let i=0;i<6&&s.phase!=='complete';i++)s=applyFinaleCommand(s,{type:s.phase==='choose'?'choose':'next',choice:bestFinale(s)[0],commandId:'guided'+s.revision,expectedRevision:s.revision});
 expect(s.phase).toBe('complete');expect(s.assisted).toBe(true);expect(validFinaleState(s)).toBe(true);
});
it('saves the boss in version eight while retaining version seven legacy finales',()=>{
 const map=new Map<string,string>(),storage:SaveStorage={getItem:k=>map.get(k)??null,setItem:(k,v)=>{map.set(k,v);},removeItem:k=>{map.delete(k);}};
 const s=createGame(4);s.seals={urns:true,contracts:true,records:true};s.finale=createFinale(3,'boss-v1');s.activeTable='finale';
 expect(saveGame(s,storage)).toBeNull();expect(JSON.parse(map.get('thegame.save.v1.current')!).schemaVersion).toBe(8);expect(loadGame(storage).state).toEqual(s);
 s.finale=createFinale(6);map.set('thegame.save.v1.current',JSON.stringify({schemaVersion:7,contentVersion:'campaign-holdem-v7',state:s}));expect(loadGame(storage).state).toEqual(s);
});
