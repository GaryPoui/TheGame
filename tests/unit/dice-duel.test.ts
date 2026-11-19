import { describe, expect, it } from 'vitest';
import { checkpointCampaign, tableUnlocked } from '../../src/core/campaign/progression';
import { createGame, loadGame, saveGame, type SaveStorage } from '../../src/core/game';
import { bossDiceRule, bossMechanic, bossNeedsFirstDie } from '../../src/core/tables/boss';
import { applyContractCommand, createContracts, latestDobleVariant, validContractsState, type ContractCommand, type ContractsState } from '../../src/core/tables/contracts';
import { bestDobleAnswers, diceDuelPoints, doblePick, scoreDobleTurn } from '../../src/core/tables/dice-duel';
import { applyFinaleCommand, bestFinale, createFinale, finaleChoices, validFinaleState, type FinaleCommand } from '../../src/core/tables/finale';

function command(s:ContractsState,type:ContractCommand['type'],contract?:ContractCommand['contract']):ContractsState {
  return applyContractCommand(s,{type,expectedRevision:s.revision,commandId:`test-${s.revision}`,...(contract?{contract}:{})});
}

describe('Doble en ocho partidas',()=>{
  it('liquida por separado la guía y el acierto de la tarjeta',()=>{
    expect(scoreDobleTurn(2,10,true)).toEqual({playerPoints:2,rivalPoints:0});
    expect(scoreDobleTurn(-1,15,true)).toEqual({playerPoints:0,rivalPoints:0});
    expect(scoreDobleTurn(24,0,false)).toEqual({playerPoints:24,rivalPoints:1});
    expect(scoreDobleTurn(5,-3,false)).toEqual({playerPoints:5,rivalPoints:1});
    expect(scoreDobleTurn(10,24,false)).toEqual({playerPoints:10,rivalPoints:24});
    expect(scoreDobleTurn(-1,15,false)).toEqual({playerPoints:-1,rivalPoints:15});
  });

  it('Seguro paga dos y ocho aciertos dan exactamente un punto adicional',()=>{
    for(const seed of [1,3,10,31]){
      let s=command(createContracts(seed,latestDobleVariant),'begin');
      let total=0;
      for(let round=0;round<8;round++){
        if(s.phase==='first-die')s=command(s,'roll-first');
        const pick=bestDobleAnswers(round,s.duel!.first)[0]!;
        s=command(s,'sign',pick);
        const points=Math.max(0,diceDuelPoints(round<4?0:1,pick,s.pair!));
        total+=points;
        expect(s.duel!.rounds.at(-1)).toMatchObject({correct:true,playerPoints:points,rivalPoints:0});
        expect([s.merit,s.balance,s.duel!.rivalScore]).toEqual([round+1,total,0]);
        if(round===0)expect(s.balance).toBe(2);
        s=command(s,'next');
      }
      expect([s.phase,s.balance,s.rng.count]).toEqual(['complete',total+1,16]);
      expect(validContractsState(s)).toBe(true);
    }
  });

  it('premia ocho decisiones óptimas con un punto y un sello independientemente de los dados',()=>{
    expect([0,1,2,4,5,6].map(round=>bestDobleAnswers(round,null))).toEqual([['S'],['C'],['J'],['S'],['C'],['J']]);
    expect([1,2,3,4,5,6].map(first=>bestDobleAnswers(3,first))).toEqual([['J'],['C'],['C'],['C'],['J'],['J']]);
    expect([1,2,3,4,5,6].map(first=>bestDobleAnswers(7,first))).toEqual([['S'],['S'],['S'],['S'],['S'],['C']]);
    for(const seed of [1,3,10,31]){
      let s=command(createContracts(seed,'duel-probability'),'begin');
      for(let round=0;round<8;round++){
        if(s.phase==='first-die')s=command(s,'roll-first');
        s=command(s,'sign',bestDobleAnswers(round,s.duel!.first)[0]);
        expect(s.duel!.rounds.at(-1)).toMatchObject({correct:true,playerPoints:0,rivalPoints:0});
        expect([s.merit,s.balance,s.duel!.rivalScore]).toEqual([round+1,0,0]);
        expect(validContractsState(s)).toBe(true);
        s=command(s,'next');
      }
      expect([s.phase,s.balance,s.rng.count]).toEqual(['complete',1,16]);
      expect(validContractsState(s)).toBe(true);
      expect(tableUnlocked(checkpointCampaign({...createGame(),seals:{urns:true,contracts:false},contracts:s}),'records')).toBe(true);
    }
  });

  it('conserva el pago de la tirada al fallar y no da el punto final con siete aciertos',()=>{
    let s=command(createContracts(3,'duel-probability'),'begin');
    for(let round=0;round<8;round++){
      if(s.phase==='first-die')s=command(s,'roll-first');
      s=command(s,'sign',round===0?'C':bestDobleAnswers(round,s.duel!.first)[0]);
      s=command(s,'next');
    }
    const {pair}=s.duel!.rounds[0]!;
    expect(s.duel!.rounds[0]).toMatchObject({correct:false,playerPoints:diceDuelPoints(0,'C',pair),rivalPoints:2});
    expect(s.merit).toBe(7);
    expect(s.balance).toBe(diceDuelPoints(0,'C',pair));
    expect(s.phase).toBe(s.balance>2?'complete':'retry');
  });

  it('paga sólo las sumas pedidas y toma el 9 para las dos ofertas',()=>{
    for(const [a,b] of [[1,4],[2,4],[3,5]] as const)expect(diceDuelPoints(0,'C',[a,b])).toBe(10);
    expect(diceDuelPoints(0,'C',[3,4])).toBe(0);
    expect(diceDuelPoints(0,'J',[3,4])).toBe(24);
    expect(diceDuelPoints(0,'J',[4,4])).toBe(0);
    expect(diceDuelPoints(0,'S',[6,6])).toBe(2);
    expect(diceDuelPoints(1,'S',[3,6])).toBe(5);
    expect(diceDuelPoints(1,'C',[3,6])).toBe(6);
    expect(diceDuelPoints(1,'J',[3,6])).toBe(-3);
    expect(diceDuelPoints(1,'S',[5,5])).toBe(-1);
    expect(diceDuelPoints(1,'C',[2,2])).toBe(-2);
    expect(diceDuelPoints(1,'J',[2,2])).toBe(15);
  });

  it('exige el primer dado en 4 y 8 y guarda el resultado antes de elegir',()=>{
    const data=new Map<string,string>();
    const storage:SaveStorage={getItem:k=>data.get(k)??null,setItem:(k,v)=>{data.set(k,v);},removeItem:k=>{data.delete(k);}};
    let s=command(createContracts(31,'duel'),'begin');
    const game=createGame(4);
    game.seals={urns:true,contracts:false};
    for(let i=0;i<8;i++){
      const split=i===3||i===7;
      if(split){
        expect(s.phase).toBe('first-die');
        expect(command(s,'sign','C')).toBe(s);
        const before=s.rng.count;
        s=command(s,'roll-first');
        expect(s.rng.count).toBe(before+1);
        expect(s.pair).toBeNull();
        expect(command(s,'roll-first')).toBe(s);
        game.contracts=s;
        expect(saveGame(game,storage)).toBeNull();
        const loaded=loadGame(storage).state!.contracts!;
        expect(loaded).toEqual(s);
        const wrongFirst=loaded.duel!.first===6?1:6;
        expect(validContractsState({...loaded,duel:{...loaded.duel!,first:wrongFirst}})).toBe(false);
        s=loaded;
      }
      const before=s.rng.count,first=s.duel!.first;
      s=command(s,'sign','S');
      expect(s.rng.count).toBe(before+(split?1:2));
      if(split)expect(s.pair![0]).toBe(first);
      const result=s.duel!.rounds.at(-1)!;
      expect(result.pair).toEqual(s.pair);
      expect(result.rival).toBe(doblePick(i,first));
      expect(s.balance).toBe(s.duel!.rounds.reduce((sum,r)=>sum+r.playerPoints,0));
      expect(s.duel!.rivalScore).toBe(s.duel!.rounds.reduce((sum,r)=>sum+r.rivalPoints,0));
      s=command(s,'next');
    }
    expect(s.rng.count).toBe(16);
    expect(s.duel!.rounds).toHaveLength(8);
    expect(validContractsState(s)).toBe(true);
    expect(s.phase==='complete').toBe(s.balance>s.duel!.rivalScore);
    expect(tableUnlocked(checkpointCampaign({...game,contracts:s}),'records')).toBe(s.phase==='complete');
  });

  it('otorga el sello al ganar y pide revancha tras empatar o perder',()=>{
    const outcomes=new Set<string>();
    for(let seed=1;seed<=30;seed++){
      let s=command(createContracts(seed,'duel'),'begin');
      for(let i=0;i<8;i++){
        if(s.phase==='first-die')s=command(s,'roll-first');
        s=command(command(s,'sign',seed===1?doblePick(i,s.duel!.first):'S'),'next');
      }
      const score=s.balance-s.duel!.rivalScore;
      outcomes.add(score>0?'win':score===0?'tie':'loss');
      expect(s.phase).toBe(score>0?'complete':'retry');
      if(seed===1)expect(score).toBe(0);
    }
    expect([...outcomes].sort()).toEqual(['loss','tie','win']);
  });
});

it('el jefe nuevo usa las dos tandas, acepta un único primer dado y conserva el combo',()=>{
  let s=createFinale(3,'boss-v2');
  const send=(type:FinaleCommand['type'],choice?:FinaleCommand['choice'])=>
    applyFinaleCommand(s,{type,expectedRevision:s.revision,commandId:`boss-test-${s.revision}`,...(choice?{choice}:{})});
  s=send('begin');
  const sets=new Set<number>();
  let split=false;
  for(let i=0;i<60&&s.phase!=='complete'&&!s.boss!.needsHelp;i++){
    if(s.phase==='feedback'){s=send('next');continue;}
    if(bossMechanic(s)==='poker'){
      // Keep the duel open through multiple cycles by guessing a rare category.
      s=send('choose','straight-flush');continue;
    }
    if(bossMechanic(s)==='urns'){s=send('choose',bestFinale(s)[0]);continue;}
    if(bossNeedsFirstDie(s)){
      expect(finaleChoices(s)).toEqual([]);
      expect(send('choose','S')).toBe(s);
      const before=s.rng.count;
      s=send('roll-first');
      expect(s.rng.count).toBe(before+1);
      expect(send('roll-first')).toBe(s);
      expect(validFinaleState(s)).toBe(true);
      split=true;
    }
    const {set,first,target}=bossDiceRule(s);
    sets.add(set);
    const id=bestFinale(s)[0] as 'S'|'C'|'J';
    const before=s;
    s=send('choose',id);
    expect(s.rng.count-before.rng.count).toBe(first===null?2:1);
    if(first!==null)expect(s.pair![0]).toBe(first);
    const score=diceDuelPoints(set,id,s.pair!);
    expect(s.balance-before.balance).toBe(score);
    expect(s.boss!.charge).toBe(Math.min(6,before.boss!.charge+(score>=target?2:0)));
  }
  expect([...sets]).toEqual([0,1]);
  expect(split).toBe(true);
});
