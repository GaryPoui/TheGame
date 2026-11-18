import {it,expect} from 'vitest';
import {createFinale,applyFinaleCommand,bestFinale,finaleChoices} from '../../src/core/tables/finale';
import {bossDamageParts} from '../../src/ui/boss-feedback';
import {pokerTiebreak} from '../../src/ui/poker-cards';
import type {HoldemTable} from '../../src/core/tables/holdem';
it('explains which value broke a tie and recognizes identical hands', () => {
 const result: NonNullable<HoldemTable['result']> = {
  choice: 'pair',
  player: { category: 'pair', tie: [2, 11, 9, 6] },
  opponent: { category: 'pair', tie: [2, 13, 11, 9] },
  winner: 'opponent',
  points: 0,
  opponentAward: 0,
 };
 expect(pokerTiebreak(result)).toContain('Desempate: perdiste con jota frente a rey');
 expect(pokerTiebreak({ ...result, winner: 'tie', opponent: result.player }))
  .toContain('Coinciden todos los valores');
});
it('damage explanation adds up to the actual saved damage for good and inferior decisions',()=>{
 let seenPokerHit=false;
 for(let seed=1;seed<=12;seed++){
  let s=createFinale(seed,'boss-v1');s=applyFinaleCommand(s,{type:'begin',commandId:'begin',expectedRevision:s.revision});
  for(let i=0;i<60&&s.phase!=='complete'&&!s.boss!.needsHelp;i++){
   const choices=finaleChoices(s),best=bestFinale(s),choice=i%7===3?choices.find(c=>!best.includes(c))??best[0]:best[0];
   s=applyFinaleCommand(s,{type:s.phase==='choose'?'choose':'next',choice,commandId:'step'+s.revision,expectedRevision:s.revision});
   if(s.phase==='feedback'){
    const before=JSON.stringify(s),parts=bossDamageParts(s);expect(parts.reduce((n,p)=>n+p.amount,0)).toBe(s.boss!.last!.damage);expect(JSON.stringify(s)).toBe(before);if(parts.some(p=>p.label==='Tu mano'))seenPokerHit=true;
   }
  }
 }
 expect(seenPokerHit).toBe(true);
});
