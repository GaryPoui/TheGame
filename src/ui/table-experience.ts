import { probability, type GameState, type Urn } from '../core/game';
import { CONTRACTS, DICE_PAIRS, expectedTotal, favorableCount, netPayout, objectiveThreshold, type ContractId, type ObjectiveId } from '../core/math/dice';

/** Presentation only: counting and rehearsal never consume campaign randomness. */
export function tokenTray(urn: Urn, event: GameState['event']): string {
  return `<span class="token-tray" aria-hidden="true">${(['red','blue'] as const).map(color => Array.from({length:urn[color]}, () => `<i class="counting-token ${color} ${event === color ? 'wanted' : ''}">${color === 'red' ? '▲' : '●'}</i>`).join('')).join('')}</span>`;
}

export function veraCoach(state: GameState, selected: 0 | 1 | null): string {
  if (selected === null) return state.step === 0
    ? 'Tocá una urna. Las fichas marcadas son las que buscás; compará qué parte del total representan.'
    : state.replacement ? 'La ficha volvió. ¿Cambió alguna proporción? Elegí mirando lo que hay ahora.'
    : 'Una ficha quedó afuera. Contá otra vez antes de repetir tu elección.';
  const p = probability(state.urns[selected],state.event);
  const name = selected === 0 ? 'U' : 'V';
  return `En ${name}, ${p.numerator} de ${p.denominator} fichas sirven. ${p.numerator === p.denominator ? 'Todas sirven: esta urna sí da certeza.' : p.numerator === 0 ? 'Ninguna sirve para el color pedido.' : `Las otras ${p.denominator-p.numerator} también pueden salir.`} ¿La otra urna ofrece una proporción mayor?`;
}

export function decisionTrack(correct: readonly boolean[], total: number): string {
  return `<div class="decision-track" role="img" aria-label="${correct.length} de ${total} decisiones realizadas; ${correct.filter(Boolean).length} acertadas">${Array.from({length:total},(_,i)=>`<span class="${i < correct.length ? correct[i] ? 'earned' : 'attempted' : 'pending'}" aria-hidden="true">${i < correct.length ? correct[i] ? '✓' : '·' : i+1}</span>`).join('')}</div>`;
}

export function contractPreview(id: ContractId, objective: ObjectiveId): string {
  const threshold = objectiveThreshold(objective);
  const count = favorableCount(id, threshold);
  const wins = DICE_PAIRS.filter(pair => netPayout(id,pair) > 0).length;
  const metric = objective === 'expected' ? `${expectedTotal(id)}/36 = ${(expectedTotal(id)/36).toLocaleString('es-AR',{maximumFractionDigits:2})} de promedio`
    : objective === 'range' ? `${CONTRACTS[id].range} de distancia entre extremos`
    : `${count} de 36 pares alcanzan ${threshold} ${threshold === 1 ? 'ficha neta' : 'fichas netas'}`;
  const detail = objective === 'expected' ? 'Sumá los 36 pagos netos y dividí por 36. El promedio no es el pago de esta tirada.'
    : objective === 'range' ? `Peor neto ${id === 'S' ? '+2' : '−1'}; mejor neto +${id === 'S' ? 2 : id === 'C' ? 5 : 23}. Restá mejor menos peor.`
    : objective === 'guarantee1' ? 'Para garantizar la meta deben servir los 36 pares. Una sola excepción rompe la garantía.'
    : 'Cada punto es un par posible. Los marcados llegan a la meta después de pagar el coste.';
  return `<section class="live-calculation" aria-label="Cuenta del contrato elegido"><strong>${id} · ${metric}</strong><div class="outcome-dots" role="img" aria-label="${objective === 'expected' || objective === 'range' ? wins : count} de 36 pares con ${objective === 'expected' || objective === 'range' ? 'neto positivo' : 'la meta alcanzada'}">${DICE_PAIRS.map(pair=>`<i class="${netPayout(id,pair) >= (objective === 'expected' || objective === 'range' ? 1 : threshold) ? 'hit' : ''}"></i>`).join('')}</div><p>${detail}</p></section>`;
}

export function contractRehearsal(pair: readonly [number,number], selected: ContractId | null): string {
  const ids: ContractId[] = ['S','C','J'];
  return `<details class="rehearsal" data-keep-open="rehearsal"><summary>Ensayar un par antes de firmar</summary><p>Mové los dados de ensayo y mirá qué cobrarías. No predicen la tirada real ni modifican tu partida.</p><div class="rehearsal-controls">${pair.map((n,i)=>`<button class="rehearsal-die" data-testid="rehearse-die-${i}" aria-label="Dado de ensayo ${i+1}: ${n}. Cambiar al siguiente valor">${n}<small>Cambiar dado ${i+1}</small></button>`).join('')}<strong>Suma ${pair[0]+pair[1]}</strong></div><div class="rehearsal-payments">${ids.map(id=>`<span class="${selected===id?'active':''}">${id}<b>${netPayout(id,pair)>0?'+':''}${netPayout(id,pair)}</b><small>neto</small></span>`).join('')}</div></details>`;
}
