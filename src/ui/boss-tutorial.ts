import type { ShowGuide } from './game-guides';

const meters = {
  resistance: {
    title: 'Resistencia',
    text: 'Es lo que le queda al anfitrión. Empieza en 36. La mejor elección le quita 2, incluso si después la suerte no te acompaña. Si llega a 0, ganás.',
    action: 'Probar una buena elección',
    before: '36/36',
    after: '34/36',
    result: 'Tu decisión le quitó 2 de resistencia.',
  },
  defences: {
    title: 'Defensas',
    text: 'Son tus oportunidades. Empezás con 6 y perdés una si había una opción mejor. Si elegís bien y sale un mal resultado, tus defensas quedan igual. Si se agotan, podés reintentar o seguir con ayuda.',
    action: 'Probar una elección que no conviene',
    before: '6/6',
    after: '5/6',
    result: 'Gastaste una defensa. Si te quedás sin defensas, podés reintentar o seguir con ayuda.',
  },
  combo: {
    title: 'Combo',
    text: 'Es un extra para el próximo golpe de póker. Una ficha del color pedido carga 1 y cumplir la meta de dados carga 2. Podés guardar hasta 6. La carga se gasta al resolver el póker, aunque no aciertes.',
    action: 'Usar el combo en una pareja ganadora',
    before: '3/6',
    after: '0/6',
    result: 'Acertaste la pareja y ganaste la mano. Hiciste 4 de daño por la pareja y 3 más por el combo.',
  },
};

type Meter = keyof typeof meters;
const steps: readonly Meter[] = ['resistance', 'defences', 'combo'];
const storageKey = 'thegame.boss-meter-guide.v1';
const read = new Set<Meter>();
try {
  const saved = localStorage.getItem(storageKey)?.split(',') ?? [];
  for (const meter of steps) if (saved.includes(meter)) read.add(meter);
} catch { /* Tips still work in this tab when storage is unavailable. */ }

export function bossMeterAttrs(meter: Meter): string {
  return `data-boss-meter="${meter}" data-unread="${!read.has(meter)}" aria-haspopup="dialog"`;
}

function markRead(meter: Meter): void {
  read.add(meter);
  for (const button of document.querySelectorAll<HTMLElement>(`[data-boss-meter="${meter}"]`)) {
    button.dataset.unread = 'false';
  }
  try { localStorage.setItem(storageKey, [...read].join(',')); } catch { /* Session state is enough. */ }
}

export function installBossTutorial(show: ShowGuide): void {
  document.addEventListener('click', event => {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>('[data-boss-meter], [data-boss-practice]');
    if (!trigger) return;
    const meter = steps.find(step => step === trigger.dataset.bossMeter);
    if (meter) {
      const lesson = meters[meter];
      const example = meter==='combo' ? '<p>Por ejemplo, una pareja acertada que gana hace 4 de daño. Con 3 de combo, el golpe hace 7.</p>' : '';
      const dialog = show(lesson.title, `<p>${lesson.text}</p>${example}<button class="primary full" data-meter-done>Entendí</button>`, 'guide-modal');
      dialog.addEventListener('click', e => {
        if ((e.target as HTMLElement).closest('[data-meter-done]')) dialog.close();
      });
      dialog.addEventListener('close', () => markRead(meter), { once: true });
      return;
    }

    const dialog = show('Practicá el duelo', '<div class="boss-practice"></div>', 'guide-modal');
    const body = dialog.querySelector<HTMLElement>('.boss-practice')!;
    let step = 0;
    let tried = false;
    const draw = () => {
      const lesson = meters[steps[step]!];
      body.innerHTML = `<p class="guide-caption">Ejemplo preparado · Paso ${step+1} de ${steps.length}</p>
        <h3 tabindex="-1">${lesson.title}</h3><p>${lesson.text}</p>
        <p class="boss-practice-counter" role="status">${lesson.title} <strong>${tried?lesson.after:lesson.before}</strong></p>
        ${tried
          ? `<p class="guide-result" tabindex="-1">${lesson.result}</p><button class="primary full" data-boss-demo="next">${step===steps.length-1?'Terminar práctica':'Siguiente paso'}</button>`
          : `<button class="primary full" data-boss-demo="try">${lesson.action}</button>`}`;
    };
    dialog.addEventListener('click', e => {
      const action = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-boss-demo]')?.dataset.bossDemo;
      if (action==='try') {
        tried = true;
        markRead(steps[step]!);
        draw();
        body.querySelector<HTMLElement>('.guide-result')?.focus();
      } else if (action==='next' && tried) {
        if (step === steps.length-1) { dialog.close(); return; }
        step++;
        tried = false;
        draw();
        body.querySelector<HTMLElement>('h3')?.focus();
      }
    });
    draw();
  });
}
