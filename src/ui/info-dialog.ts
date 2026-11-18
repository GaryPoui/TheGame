/** Explanations never expand the playing surface. Long readings use pages. */
const readings = new Map<string, { title: string; html: string }>();
let serial = 0;
export function replaceDisclosures(root: HTMLElement): void {
  if(!document.querySelector('dialog[open]'))readings.clear();
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
type Show=(title:string,html:string,kind:string)=>HTMLDialogElement;
/** Split a long paragraph without discarding emphasis, links or other inline markup. */
function splitParagraph(item:HTMLElement,content:HTMLElement,limit:number):HTMLElement[] {
  const pieces:HTMLElement[]=[];
  const walker=document.createTreeWalker(item,NodeFilter.SHOW_TEXT);
  const ends:{node:Node;offset:number}[]=[];
  while(walker.nextNode())for(const match of walker.currentNode.textContent!.matchAll(/\S+\s*/g))ends.push({node:walker.currentNode,offset:match.index!+match[0].length});
  let startNode:Node=item,startOffset=0,current=item.cloneNode(false) as HTMLElement;
  for(let i=0;i<ends.length;i++){
    const end=ends[i]!,range=document.createRange();range.setStart(startNode,startOffset);range.setEnd(end.node,end.offset);
    current.replaceChildren(range.cloneContents());content.replaceChildren(current);
    if(content.scrollHeight>limit&&i>0){
      const before=ends[i-1]!;range.setEnd(before.node,before.offset);current.replaceChildren(range.cloneContents());pieces.push(current);
      startNode=before.node;startOffset=before.offset;current=item.cloneNode(false) as HTMLElement;
      range.setStart(startNode,startOffset);range.setEnd(end.node,end.offset);current.replaceChildren(range.cloneContents());
    }
  }
  if(current.textContent?.trim())pieces.push(current);
  return pieces.length?pieces:[item];
}
export function showReading(show:Show,title:string,html:string):HTMLDialogElement {
    const dialog = show(title, `<div class="reading-pages" tabindex="-1">${html}</div><nav class="reading-nav" aria-label="Páginas de la explicación"><button class="quiet" data-page="previous">Anterior</button><span role="status"></span><button class="quiet" data-page="next">Siguiente</button></nav>`, 'info-modal');
    const content = dialog.querySelector<HTMLElement>('.reading-pages')!;
    const originals=[...content.children] as HTMLElement[];
    let pages:HTMLElement[][]=[[]],page=0;
    const nav=dialog.querySelector<HTMLElement>('.reading-nav')!;
    const draw = () => {
      content.replaceChildren(...pages[page]!);
      nav.hidden = pages.length === 1;
      nav.querySelector('[role=status]')!.textContent = `${page + 1} de ${pages.length}`;
      dialog.querySelector<HTMLButtonElement>('[data-page=previous]')!.disabled = page === 0;
      dialog.querySelector<HTMLButtonElement>('[data-page=next]')!.disabled = page === pages.length - 1;
    };
    const paginate=()=>{
      nav.hidden=false;pages=[[]];
      const style=getComputedStyle(dialog.querySelector('.modal-body')!);
      const limit=Math.max(100,window.innerHeight-28-dialog.querySelector<HTMLElement>('.modal-heading')!.offsetHeight-nav.offsetHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom)-24);
      for(const original of originals){
        const item=original.cloneNode(true) as HTMLElement;item.hidden=false;content.replaceChildren(item);
        const pieces=item.tagName==='P'&&content.scrollHeight>limit?splitParagraph(item,content,limit):[item];
        for(const piece of pieces){
          content.replaceChildren(...pages.at(-1)!,piece);
          if(content.scrollHeight>limit&&pages.at(-1)!.length)pages.push([]);
          pages.at(-1)!.push(piece);
        }
      }
      page=Math.min(page,pages.length-1);draw();
    };
    dialog.addEventListener('click', e => {
      const button=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-page]');
      const direction=button?.dataset.page;
      if (direction&&!button!.disabled) {page=Math.max(0,Math.min(pages.length-1,page+(direction==='next'?1:-1)));draw();content.focus({preventScroll:true});}
    });
    window.addEventListener('resize',paginate);dialog.addEventListener('close',()=>window.removeEventListener('resize',paginate),{once:true});
    paginate();return dialog;
}
export function installInfoDialogs(show:Show): void {
  document.addEventListener('click', event => {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>('[data-info]');
    const reading = trigger && readings.get(trigger.dataset.info!);
    if (reading)showReading(show,reading.title,reading.html);
  });
}
