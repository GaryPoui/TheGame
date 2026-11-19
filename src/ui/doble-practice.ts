import type { ContractId, DicePair } from '../core/math/dice';
import { bestDobleAnswers, diceDuelOffers, diceDuelPoints, doblePick, DOBLE_QUESTIONS } from '../core/tables/dice-duel';
import type { ShowGuide } from './game-guides';

const examples = [
  { round:1, first:null, pair:[3,4] as DicePair, reason:'Apostador paga al sumar 5, 6 u 8: 14 de 36 tiradas. Arriesgado paga con 7: 6 de 36. Seguro da 2.' },
  { round:3, first:2, pair:[2,5] as DicePair, reason:'Con un 2 visible quedan seis resultados. Apostador paga 30 en total: 5 en promedio. Arriesgado paga 24 en total: 4 en promedio. Seguro da 2.' },
] as const;

export function installDoblePractice(show: ShowGuide): void {
  document.addEventListener('click', event => {
    if (!(event.target as HTMLElement).closest('[data-doble-practice]')) return;
    const dialog = show('Practicá con Doble', '<div class="doble-practice"></div>', 'guide-modal');
    const body = dialog.querySelector<HTMLElement>('.doble-practice')!;
    let step = 0;
    let choice: ContractId | undefined;

    function draw(): void {
      const example = examples[step];
      if (!example) {
        body.innerHTML = `<h3 tabindex="-1">Ocho aciertos, una victoria</h3>
          <p>Si elegís la mejor tarjeta, vos y Doble quedan en cero en esa ronda. Si elegís otra, cuenta el pago de la tirada para los dos.</p>
          <p>Con 8 de 8, sumás un punto al final y ganás 1 a 0.</p>
          <button class="primary full" data-doble-demo="finish">Terminar práctica</button>`;
        return;
      }

      const {round, first, pair, reason} = example;
      const set = round < 4 ? 0 : 1;
      const heading = `<p class="guide-caption">Práctica sin puntos · ${step+1} de 2${first===null?'':` · Primer dado: ${first}`}</p>`;
      if (choice === undefined) {
        body.innerHTML = `${heading}<h3 tabindex="-1">${DOBLE_QUESTIONS[round]!.prompt}</h3>
          <div class="demo-choices">${diceDuelOffers(set).map(offer => `<button class="secondary" data-doble-demo="choose" data-card="${offer.id}">${offer.name}
            <small>${offer.when} · +${offer.win}${offer.condition==='any'?'':` · Si no, ${offer.miss}`}</small></button>`).join('')}</div>`;
        return;
      }

      const correct = bestDobleAnswers(round,first).includes(choice);
      const player = correct ? 0 : diceDuelPoints(set,choice,pair);
      const rival = correct ? 0 : diceDuelPoints(set,doblePick(round,first),pair);
      body.innerHTML = `${heading}<section class="guide-result" role="status" tabindex="-1">
        <h3>${correct?'Elegiste la mejor tarjeta':'Había una tarjeta mejor'}</h3>
        <p>${reason}</p><p>Dados ${pair.join(' y ')} · Vos: ${player} · Doble: ${rival}</p></section>
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
