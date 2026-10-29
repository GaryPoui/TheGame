/** Explanations never expand the playing surface. Long readings use pages. */
const readings = new Map<string, { title: string; html: string }>();
let serial = 0;
export function replaceDisclosures(root: HTMLElement): void {
  for (const details of [...root.querySelectorAll('details')].reverse()) {
    const summary = details.querySelector(':scope > summary');
    if (!summary) continue;
    const title = summary.textContent ?? 'Más información';
    summary.remove();
    const id = String(++serial);
    readings.set(id, { title, html: details.innerHTML });
    const button = document.createElement('button');
    button.className = 'text-button info-trigger';
    button.dataset.info = id;
    button.textContent = title;
    details.replaceWith(button);
  }
}
export function installInfoDialogs(show: (title: string, html: string, kind: string) => HTMLDialogElement): void {
  document.addEventListener('click', event => {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>('[data-info]');
    const reading = trigger && readings.get(trigger.dataset.info!);
    if (!reading) return;
    const dialog = show(reading.title, `<div class="reading-pages">${reading.html}</div><nav class="reading-nav" aria-label="Páginas de la explicación"><button class="quiet" data-page="previous">Anterior</button><span role="status"></span><button class="quiet" data-page="next">Siguiente</button></nav>`, 'info-modal');
    const content = dialog.querySelector<HTMLElement>('.reading-pages')!;
    const items = [...content.children] as HTMLElement[];
    const pages: HTMLElement[][] = [[]];
    const limit = Math.max(140, window.innerHeight - 230);
    for (const item of items) {
      item.hidden = false;
      content.replaceChildren(...pages.at(-1)!, item);
      if (content.scrollHeight > limit && pages.at(-1)!.length) pages.push([]);
      pages.at(-1)!.push(item);
    }
    let page = 0;
    const draw = () => {
      content.replaceChildren(...pages[page]!);
      dialog.querySelector<HTMLElement>('.reading-nav')!.hidden = pages.length === 1;
      dialog.querySelector('[role=status]')!.textContent = `${page + 1} de ${pages.length}`;
      dialog.querySelector<HTMLButtonElement>('[data-page=previous]')!.disabled = page === 0;
      dialog.querySelector<HTMLButtonElement>('[data-page=next]')!.disabled = page === pages.length - 1;
    };
    dialog.addEventListener('click', e => {
      const direction = (e.target as HTMLElement).closest<HTMLElement>('[data-page]')?.dataset.page;
      if (direction) { page += direction === 'next' ? 1 : -1; draw(); }
    });
    draw();
  });
}
