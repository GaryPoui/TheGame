import {it,expect} from 'vitest';
import {writeFileSync,mkdirSync} from 'node:fs';
import {dealHoldem,resolveHoldem,choosePrediction,evaluateHand,HANDS,compareHands} from '../../src/core/tables/holdem';
import {pokerDeck} from '../../src/core/tables/poker-records';
it('checks seven-card evaluation against all 21 five-card subsets',()=>{
 for(let seed=1;seed<=300;seed++){
  const d=dealHoldem({algorithm:'xorshift32-v1',state:seed,count:0}),r=resolveHoldem(d.table,d.rng,'pair');const cards=[...r.table.player,...r.table.board];
  const values=[];for(let a=0;a<7;a++)for(let b=a+1;b<7;b++)values.push(evaluateHand(cards.filter((_,i)=>i!==a&&i!==b)));
  const best=values.reduce((a,b)=>compareHands(a,b)>=0?a:b);expect(evaluateHand(cards)).toEqual(best);
 }
});
it('calibrates the 24-point goal with a policy using only public information',()=>{
 const lengths:number[]=[];
 for(let seed=1;seed<=300;seed++){
  let rng={algorithm:'xorshift32-v1' as const,state:seed,count:0},points=0,rounds=0;
  while(points<24&&rounds<200){const d=dealHoldem(rng),choice=choosePrediction(d.table.player,d.table.board),r=resolveHoldem(d.table,d.rng,choice);rng=r.rng;points+=r.table.result!.points;rounds++;}
  expect(points).toBeGreaterThanOrEqual(24);lengths.push(rounds);
 }
 lengths.sort((a,b)=>a-b);const result={seeds:300,policy:'maximize category probability times award, using own two and public four only; no opponent or future access',goal:24,meanHands:lengths.reduce((a,b)=>a+b,0)/lengths.length,medianHands:lengths[150],p10:lengths[30],p90:lengths[270],minimum:lengths[0],maximum:lengths.at(-1)};
 mkdirSync('docs/evidence/ada-holdem',{recursive:true});writeFileSync('docs/evidence/ada-holdem/balance.json',JSON.stringify(result,null,2)+'\n');console.log(result);
 expect(result.medianHands).toBeGreaterThanOrEqual(10);
},60000);
it('enumerates all five-card hands against the standard category totals',()=>{
 const deck=pokerDeck(),counts=HANDS.map(()=>0);
 for(let a=0;a<48;a++)for(let b=a+1;b<49;b++)for(let c=b+1;c<50;c++)for(let d=c+1;d<51;d++)for(let e=d+1;e<52;e++)counts[HANDS.indexOf(evaluateHand([deck[a]!,deck[b]!,deck[c]!,deck[d]!,deck[e]!]).category)]!++;
 expect(counts).toEqual([1302540,1098240,123552,54912,10200,5108,3744,624,40]);
},120000);
