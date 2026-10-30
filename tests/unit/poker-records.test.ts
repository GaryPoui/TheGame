import {describe,it,expect} from 'vitest';
import {createRecords,applyRecordsCommand,bestRecords,recordsChoices,validRecordsState,type RecordsState} from '../../src/core/tables/records';
import {pokerDeck,pokerMatches,pokerOdds} from '../../src/core/tables/poker-records';
import {createGame,saveGame,loadGame,type SaveStorage} from '../../src/core/game';
const advance=(s:RecordsState,good=true)=>applyRecordsCommand(s,{type:s.phase==='tutorial'?'begin':s.phase==='choose'?'choose':'next',choice:good||s.assisted?bestRecords(s)[0]:recordsChoices(s).find(c=>!bestRecords(s).includes(c))??bestRecords(s)[0],commandId:'cards-'+s.revision,expectedRevision:s.revision});
describe('Ada poker probabilities',()=>{
 it('enumerates the 52 distinct poker cards and counts the inclusive union without double counting',()=>{
  const deck=pokerDeck();expect(deck).toHaveLength(52);expect(new Set(deck.map(c=>c.suit+c.rank)).size).toBe(52);
  expect([0,1,2,3].map(r=>deck.filter(c=>pokerMatches(c,r)).length)).toEqual([26,13,12,28]);
 });
 it('compares proportions exactly, recognizes equal proportions with different pile sizes, then updates after removal',()=>{
  let s=createRecords(10);while(s.round!==1)s=advance(s);
  expect(pokerOdds(s,0)).toEqual({wins:2,total:4});expect(pokerOdds(s,1)).toEqual({wins:4,total:8});expect(bestRecords(s)).toEqual(['K','V']);
  const before=s;s=advance(s);expect(s.cards!.piles[0]).toHaveLength(3);expect(s.cards!.piles[1]).toHaveLength(8);
  const draw=s.cards!.last!;expect(before.cards!.piles[0]).toContainEqual(draw.card);expect(s.cards!.piles[0]).not.toContainEqual(draw.card);
  s=advance(s);expect(bestRecords(s)).toEqual(pokerMatches(draw.card,1)?['V']:['K']);
 });
 it('replays every checkpoint across seeds and finishes independently or after finite guided practice',()=>{
  for(const good of [true,false])for(const repeat of [true,false])for(let seed=1;seed<=24;seed++){
   let s=createRecords(seed,repeat);for(let i=0;i<27&&s.phase!=='complete';i++){
    const old=s;s=advance(s,good);expect(s).not.toBe(old);expect(validRecordsState(s)).toBe(true);
    const cards=s.cards!.piles.flat();expect(new Set(cards.map(c=>c.suit+c.rank)).size).toBe(cards.length);
   }
   expect(s.phase).toBe('complete');expect(s.assisted).toBe(!good);expect(s.history).toHaveLength(good?8:12);
  }
 });
 it('scores the choice independently of the random result and rejects duplicate, stale or tampered actions',()=>{
  const results=new Set<boolean>();for(let seed=1;seed<100;seed++){
   let s=advance(createRecords(seed));const command={type:'choose' as const,choice:bestRecords(s)[0]!,commandId:'one',expectedRevision:s.revision};
   const next=applyRecordsCommand(s,command);expect(next.merit).toBe(1);results.add(pokerMatches(next.cards!.last!.card,0));
   expect(applyRecordsCommand(next,command)).toBe(next);expect(validRecordsState({...next,merit:8})).toBe(false);
  }expect(results.size).toBe(2);
 });
 it('saves cards in a version-six envelope and still accepts version-five sessions',()=>{
  const data=new Map<string,string>(),store:SaveStorage={getItem:k=>data.get(k)??null,setItem:(k,v)=>{data.set(k,v);},removeItem:k=>{data.delete(k);}};
  const s=createGame(7);s.seals={urns:true,contracts:true};s.records=advance(createRecords(7));s.activeTable='records';
  expect(saveGame(s,store)).toBeNull();expect(JSON.parse(data.get('thegame.save.v1.current')!).schemaVersion).toBe(6);expect(loadGame(store).state).toEqual(s);
  s.records=createRecords(7,false,'photos-v2');data.set('thegame.save.v1.current',JSON.stringify({schemaVersion:5,contentVersion:'campaign-challenge-v5',state:s}));expect(loadGame(store).state).toEqual(s);
 });
});
