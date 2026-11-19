import type { ContractId, DicePair } from '../core/math/dice';
import { bestDobleAnswers, diceDuelOffers, diceDuelPoints, doblePick, DOBLE_QUESTIONS, scoreDobleTurn } from '../core/tables/dice-duel';
import type { ShowGuide } from './game-guides';

const examples = [
  { round:1, first:null, pair:[3,4] as DicePair, reason:'Apostador paga al sumar 5, 6 u 8: 14 de 36 tiradas. Arriesgado paga con 7: 6 de 36. Seguro da 2.' },
  { round:3, first:2, pair:[2,3] as DicePair, reason:'Con un 2 visible quedan seis resultados. Apostador paga 30 en total: 5 en promedio. Arriesgado paga 24 en total: 4 en promedio. Seguro da 2.' },
] as const;

export function doblePayoutRules(): string {
  return `<p>La pregunta te orienta y podés elegir cualquier tarjeta. Acertás la tirada si sale lo que pide tu tarjeta. Seguro te da 2 puntos siempre.</p>
    <dl class="doble-payout-rules">
      <dt>Acertás la pregunta y la tirada</dt><dd>Cobrás vos. Doble suma 0.</dd>
      <dt>Acertás solo la pregunta</dt><dd>Los dos suman 0.</dd>
      <dt>Acertás solo la tirada</dt><dd>Ambos cobran. Doble suma al menos 1.</dd>
      <dt>No acertás ninguna</dt><dd>Se aplican los pagos de las tarjetas.</dd>
    </dl>
    <p>Ocho aciertos en las preguntas dan 1 punto extra al final y aseguran el sello.</p>`;
}

export function installDoblePractice(show: ShowGuide): void {
  document.addEventListener('click', event => {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>('[data-doble-practice]');
    if (!trigger) return;
    const payouts = trigger.dataset.doblePractice==='payouts';
    const dialog = show('Practicá con Doble', '<div class="doble-practice"></div>', 'guide-modal');
    const body = dialog.querySelector<HTMLElement>('.doble-practice')!;
    let step = 0;
    let choice: ContractId | undefined;

    function draw(): void {
      const example = examples[step];
      if (!example) {
        body.innerHTML = `<h3 tabindex="-1">Ocho aciertos, una victoria</h3>
          ${payouts?doblePayoutRules():`<p>Si elegís la mejor tarjeta, vos y Doble quedan en cero en esa ronda. Si elegís otra, cuenta el pago de la tirada para los dos.</p>
          <p>Con 8 de 8, sumás un punto al final y ganás 1 a 0.</p>`}
          <button class="primary full" data-doble-demo="finish">Terminar práctica</button>`;
        return;
      }

      const {round, first, reason} = example;
      const pair: DicePair = !payouts&&step===1?[2,5]:example.pair;
      const set = round < 4 ? 0 : 1;
      const heading = `<p class="guide-caption">Práctica sin puntos · ${step+1} de 2${first===null?'':` · Primer dado: ${first}`}</p>`;
      if (choice === undefined) {
        body.innerHTML = `${heading}<h3 tabindex="-1">${DOBLE_QUESTIONS[round]!.prompt}</h3>
          <div class="demo-choices">${diceDuelOffers(set).map(offer => `<button class="secondary" data-doble-demo="choose" data-card="${offer.id}">${offer.name}
            <small>${offer.when} · +${offer.win}${offer.condition==='any'?'':` · Si no, ${offer.miss}`}</small></button>`).join('')}</div>`;
        return;
      }

      const correct = bestDobleAnswers(round,first).includes(choice);
      const playerPayout = diceDuelPoints(set,choice,pair);
      const rivalPayout = diceDuelPoints(set,doblePick(round,first),pair);
      const {playerPoints,rivalPoints} = payouts ? scoreDobleTurn(playerPayout,rivalPayout,correct)
        : {playerPoints:correct?0:playerPayout,rivalPoints:correct?0:rivalPayout};
      body.innerHTML = `${heading}<section class="guide-result" role="status" tabindex="-1">
        <h3>${correct?'Elegiste la mejor tarjeta':'Había una tarjeta mejor'}</h3>
        <p>${reason}</p><p>Dados ${pair.join(' y ')} · Vos: ${playerPoints} · Doble: ${rivalPoints}</p></section>
        <nav class="reading-nav" aria-label="Práctica de Doble"><button class="secondary" data-doble-demo="retry">Probar otra tarjeta</button>
        <button class="primary" data-doble-demo="next">${step===0?'Siguiente ejemplo':'Ver cómo ganar'}</button></nav>`;
    }

    dialog.addEventListener('click', event => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-doble-demo]');
      if (!button) return;
      switch (button.dataset.dobleDemo) {
        case 'choose': choice = button.dataset.card as ContractId; break;
        case 'retry': choice = undefined; break;
        case 'next': step++; choice = undefined; break;
        case 'finish': dialog.close(); return;
      }
      draw();
      body.querySelector<HTMLElement>('[role="status"], h3')?.focus();
    });
    draw();
  });
}
