import { CONTRACT_IDS, DICE_PAIRS, type ContractId, type DicePair } from '../math/dice';

type DiceCondition = 'any' | 'five-six-eight' | 'seven' | 'low-nine' | 'high-nine' | 'double';
type OfferSet = 0 | 1;
export type TableDice = readonly [number, number?];

export interface DuelOffer {
  id: ContractId;
  name: string;
  when: string;
  condition: DiceCondition;
  win: number;
  miss: number;
}

const offers: Record<OfferSet, readonly DuelOffer[]> = {
  0: [
    {id:'S', name:'Seguro', when:'Con cualquier tirada', condition:'any', win:2, miss:0},
    {id:'C', name:'Apostador', when:'Si suman 5, 6 u 8', condition:'five-six-eight', win:10, miss:0},
    {id:'J', name:'Arriesgado', when:'Si suman justo 7', condition:'seven', win:24, miss:0},
  ],
  1: [
    {id:'S', name:'Suma baja', when:'Si suman 9 o menos', condition:'low-nine', win:5, miss:-1},
    {id:'C', name:'Suma alta', when:'Si suman 9 o más', condition:'high-nine', win:6, miss:-2},
    {id:'J', name:'Dados iguales', when:'Si sale el mismo número en los dos', condition:'double', win:15, miss:-3},
  ],
};

export function diceDuelOffers(set: OfferSet): readonly DuelOffer[] { return offers[set]; }

export function diceDuelPoints(set: OfferSet, id: ContractId, [a,b]: DicePair): number {
  const offer = offers[set].find(o => o.id === id)!;
  const sum = a+b;
  const wins: Record<DiceCondition, boolean> = {
    any:true, 'five-six-eight':[5,6,8].includes(sum), seven:sum===7,
    'low-nine':sum<=9, 'high-nine':sum>=9, double:a===b,
  };
  return wins[offer.condition] ? offer.win : offer.miss;
}

/** Doble alternates between offers and considers only the die that both sides can see. */
export function doblePick(round: number, first: number | null): ContractId {
  if (round===7) return first!==null && first<=3 ? 'S' : 'J';
  return (['S','C','S','S','J','C','S'] as const)[round]!;
}

export function bestDuelDiceOffers(set: OfferSet, target: number, first: number | null): ContractId[] {
  const pairs = first===null ? DICE_PAIRS : DICE_PAIRS.filter(([a])=>a===first);
  const counts = CONTRACT_IDS.map(id=>pairs.filter(pair=>diceDuelPoints(set,id,pair)>=target).length);
  return CONTRACT_IDS.filter((_,i)=>counts[i]===Math.max(...counts));
}
