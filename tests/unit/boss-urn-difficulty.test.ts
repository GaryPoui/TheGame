import { expect, it } from 'vitest';
import { applyFinaleCommand, bestFinale, createFinale, validFinaleState, type FinaleCommand, type FinaleState } from '../../src/core/tables/finale';

function send(state:FinaleState,type:FinaleCommand['type'],choice?:FinaleCommand['choice']){
 return applyFinaleCommand(state,{type,expectedRevision:state.revision,commandId:`urn-test-${state.revision}`,...(choice?{choice}:{})});
}

it('compares close proportions and can change the best urn after a draw',()=>{
 const initial=send(createFinale(3,'boss-v3'),'begin');
 expect(initial.urns).toEqual([{red:4,blue:3},{red:3,blue:2}]);
 expect(bestFinale(initial)).toEqual(['V']);
 const first=send(initial,'choose','V');
 expect(first.rng.count).toBe(initial.rng.count+1);
 expect(first.lastColor).toBe('red');
 expect(first.urns).toEqual([{red:4,blue:3},{red:2,blue:2}]);
 expect(first.boss).toMatchObject({charge:1,health:34,defences:6});
 const second=send(first,'next');
 expect(bestFinale(second)).toEqual(['U']);
 expect(validFinaleState(second)).toBe(true);
});

it('keeps the earlier boss urn state replayable',()=>{
 const initial=send(createFinale(3,'boss-v2'),'begin');
 expect(initial.urns).toEqual([{red:4,blue:2},{red:2,blue:3}]);
 expect(bestFinale(initial)).toEqual(['U']);
 expect(validFinaleState(send(initial,'choose','U'))).toBe(true);
});
