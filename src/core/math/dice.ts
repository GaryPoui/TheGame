export type ContractId = 'S' | 'C' | 'J';
export type DicePair = readonly [number, number];
export type ObjectiveId = 'expected' | 'guarantee1' | 'atLeast1' | 'atLeast4' | 'atLeast10' | 'atLeast20' | 'range';
export const CONTRACT_IDS: readonly ContractId[] = ['S', 'C', 'J'];
export const CONTRACTS = {
  S: { name: 'Seguro', cost: 0, gross: 2, rule: 'Cobrás 2 con cualquier suma.', range: 0 },
  C: { name: 'Centro', cost: 1, gross: 6, rule: 'Cobrás 6 si suman 6, 7 u 8.', range: 6 },
  J: { name: 'Justo siete', cost: 1, gross: 24, rule: 'Cobrás 24 si suman 7.', range: 24 },
} as const;
export const OBJECTIVES: Record<ObjectiveId, { title: string; short: string; explanation: string }> = {
  expected: { title: 'Si jugás muchas veces, ¿cuál deja más fichas en promedio?', short: 'Mayor promedio', explanation: 'Imaginá muchas tiradas. Compará cuántas fichas te quedarían en promedio, después de pagar. En una sola tirada podés perder.' },
  guarantee1: { title: '¿Cuál te asegura ganar al menos una ficha?', short: 'Garantía de al menos 1', explanation: 'Necesitás que te quede al menos una ficha, salga lo que salga. Mirá también cuánto cuesta jugar.' },
  atLeast20: { title: 'Buscá la mayor chance de ganar al menos 20', short: 'Neto ≥ 20', explanation: 'Transferencia repetida: el objetivo ahora son veinte fichas netas. Revisá otra vez qué pagos alcanzan la meta.' },
  atLeast1: { title: 'Buscá la mayor chance de ganar al menos 1', short: 'Neto ≥ 1', explanation: '¿Con cuál es más fácil que te quede al menos una ficha? Primero descontá lo que cuesta jugar.' },
  atLeast4: { title: 'Buscá la mayor chance de ganar al menos 4', short: 'Neto ≥ 4', explanation: 'Necesitás que te queden cuatro fichas o más después de pagar. Un premio enorme puede ser más difícil de conseguir.' },
  atLeast10: { title: 'Buscá la mayor chance de ganar al menos 10', short: 'Neto ≥ 10', explanation: 'Ahora necesitás que te queden diez fichas o más. Mirá qué ofertas pueden darte esa cantidad.' },
  range: { title: '¿Cuál paga siempre lo mismo?', short: 'Menor rango', explanation: 'Buscá la oferta cuyo pago cambie menos entre una tirada y otra. Un pago fijo no tiene variación.' },
};
export const DICE_PAIRS: readonly DicePair[] = Array.from({ length: 36 }, (_, i) => [Math.floor(i / 6) + 1, i % 6 + 1] as const);
export function grossPayout(id: ContractId, pair: DicePair): number {
  const sum = pair[0] + pair[1];
  return id === 'S' ? 2 : id === 'C' ? (sum >= 6 && sum <= 8 ? 6 : 0) : sum === 7 ? 24 : 0;
}
export function netPayout(id: ContractId, pair: DicePair): number { return grossPayout(id, pair) - CONTRACTS[id].cost; }
export function expectedTotal(id: ContractId): number { return DICE_PAIRS.reduce((sum, pair) => sum + netPayout(id, pair), 0); }
export function favorableCount(id: ContractId, threshold: number): number { return DICE_PAIRS.filter(pair => netPayout(id, pair) >= threshold).length; }
export function objectiveUtility(id: ContractId, objective: ObjectiveId): number {
  if (objective === 'expected') return expectedTotal(id);
  if (objective === 'guarantee1') return DICE_PAIRS.every(pair => netPayout(id, pair) >= 1) ? 1 : 0;
  if (objective === 'range') return -CONTRACTS[id].range;
  return favorableCount(id, objectiveThreshold(objective));
}
export function bestContracts(objective: ObjectiveId): ContractId[] {
  const maximum = Math.max(...CONTRACT_IDS.map(id => objectiveUtility(id, objective)));
  return CONTRACT_IDS.filter(id => objectiveUtility(id, objective) === maximum);
}
export function supportsObjective(id: ContractId, pair: DicePair, objective: ObjectiveId): boolean {
  if (objective === 'expected' || objective === 'range') return grossPayout(id, pair) > 0;
  return netPayout(id, pair) >= (objectiveThreshold(objective));
}

export function objectiveThreshold(objective: ObjectiveId): number { return objective === 'atLeast1' || objective === 'guarantee1' ? 1 : objective === 'atLeast4' ? 4 : objective === 'atLeast20' ? 20 : 10; }
