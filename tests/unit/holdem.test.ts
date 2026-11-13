import {it,expect} from 'vitest';
import {evaluateHand,compareHands,handOdds,dealHoldem,resolveHoldem,HAND_POINTS,bestFive} from '../../src/core/tables/holdem';
import {pokerDeck,type PokerCard} from '../../src/core/tables/poker-records';
import {createRecords,applyRecordsCommand,validRecordsState,bestRecords} from '../../src/core/tables/records';
const cards=(r:number[],s='hearts')=>r.map(rank=>({rank,suit:s} as PokerCard));
it('ranks the best five, ace-low straights, two triples and board ties',()=>{
 expect(evaluateHand(cards([1,2,3,4,5])).category).toBe('straight-flush');
 expect(evaluateHand(cards([1,2,3,4,5])).tie).toEqual([5]);
 expect(evaluateHand([...cards([13,13,13],'clubs'),...cards([12,12,12],'spades'),...cards([1])]).category).toBe('full-house');
 const board=cards([10,11,12,13,1]);expect(compareHands(evaluateHand([...board,...cards([2,3],'clubs')]),evaluateHand([...board,...cards([8,9],'spades')]))).toBe(0);
 expect(compareHands(evaluateHand([...cards([9,9],'clubs'),...cards([1,13,8,4,2],'spades')]),evaluateHand([...cards([9,9],'clubs'),...cards([1,12,8,4,2],'spades')]))).toBeGreaterThan(0);
});
it('counts all 46 unseen rivers without consulting the opponent and deals distinct cards',()=>{
 const rng={algorithm:'xorshift32-v1' as const,state:123,count:0};const deal=dealHoldem(rng);
 expect(new Set([...deal.table.player,...deal.table.opponent,...deal.table.board,...deal.table.deck].map(c=>c.suit+c.rank)).size).toBe(52);
 const odds=handOdds(deal.table.player,deal.table.board);expect(odds.reduce((n,o)=>n+o.count,0)).toBe(46);
 expect(deal.table.board).toHaveLength(4);expect(deal.table.deck).toHaveLength(44);
 expect(pokerDeck()).toHaveLength(52);
});
it('highlights five real cards whose value matches the evaluated seven-card hand',()=>{
 for(let seed=1;seed<=80;seed++){
  const deal=dealHoldem({algorithm:'xorshift32-v1',state:seed*7789,count:0}),r=resolveHoldem(deal.table,deal.rng,'pair');
  for(const hole of [r.table.player,r.table.opponent]){const seven=[...hole,...r.table.board],five=bestFive(seven);expect(five).toHaveLength(5);expect(new Set(five.map(c=>c.suit+c.rank)).size).toBe(5);expect(evaluateHand(five)).toEqual(evaluateHand(seven));}
 }
});
it('requires a correct category AND a strictly winning poker hand to score',()=>{
 const t=dealHoldem({algorithm:'xorshift32-v1',state:22,count:0});
 const result=resolveHoldem(t.table,t.rng,'pair');
 expect(result.table.result!.points).toBe(result.table.result!.player.category==='pair'&&result.table.result!.winner==='player'?HAND_POINTS.pair:0);
 expect(result.table.board).toHaveLength(5);
 const board=[...cards([2,7],'hearts'),...cards([9],'diamonds'),...cards([11],'clubs')];
 const prepared={...t.table,player:cards([1],'hearts').concat(cards([1],'diamonds')),opponent:cards([13],'hearts').concat(cards([13],'diamonds')),board,deck:cards([4],'spades'),opponentChoice:'pair' as const};
 expect(resolveHoldem(prepared,t.rng,'pair').table.result!.points).toBe(4);
 expect(resolveHoldem(prepared,t.rng,'two-pair').table.result!.points).toBe(0);
 const loses={...prepared,player:prepared.opponent,opponent:prepared.player};
 expect(resolveHoldem(loses,t.rng,'pair').table.result!.points).toBe(0);
 expect(resolveHoldem(loses,t.rng,'pair').table.result!.opponentAward).toBe(4);
 const tied={...prepared,board:cards([10,11,12,13]),deck:cards([1]),player:cards([2,3],'clubs'),opponent:cards([7,8],'spades')};
 expect(resolveHoldem(tied,t.rng,'straight-flush').table.result!.points).toBe(0);
});
it('persists reveals and rejects duplicate actions without rerolling',()=>{
 let s=createRecords(55,false,'holdem-v1');expect(validRecordsState(s)).toBe(true);
 s=applyRecordsCommand(s,{type:'begin',commandId:'begin',expectedRevision:s.revision});
 const c={type:'choose' as const,choice:'pair' as const,commandId:'reveal',expectedRevision:s.revision};
 s=applyRecordsCommand(s,c);expect(s.phase).toBe('feedback');expect(validRecordsState(s)).toBe(true);
 expect(applyRecordsCommand(s,c)).toBe(s);expect(validRecordsState({...s,merit:999})).toBe(false);
});
it('awards the independent seal only after reaching 24 and acknowledging the result',()=>{
 let s=createRecords(71);
 for(let i=0;i<401&&s.phase!=='complete';i++){
  const previous=s;s=applyRecordsCommand(s,{type:s.phase==='tutorial'?'begin':s.phase==='choose'?'choose':'next',choice:bestRecords(s)[0],expectedRevision:s.revision,commandId:'goal-'+s.revision});
  if(s.phase==='complete')expect(previous.merit).toBeGreaterThanOrEqual(24);
 }
 expect(s.phase).toBe('complete');expect(s.merit).toBeGreaterThanOrEqual(24);expect(s.assisted).toBe(false);expect(validRecordsState(s)).toBe(true);
});
