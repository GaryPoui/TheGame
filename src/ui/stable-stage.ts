/** Keep the WebGL surface mounted in the same viewport across a turn's UI updates. */
export function renderSurface(root:HTMLElement,html:string,screen:string):void {
 const canvas=document.querySelector<HTMLCanvasElement>('#scene');
 const oldViewport=canvas?.closest<HTMLElement>('.dice-viewport,.ada-viewport');
 const template=document.createElement('template');template.innerHTML=html;
 const nextViewport=template.content.querySelector<HTMLElement>('.dice-viewport,.ada-viewport');
 if(canvas&&oldViewport&&nextViewport&&root.dataset.surfaceScreen===screen&&oldViewport.className===nextViewport.className){
  // Refresh HTML fallback content while preserving the canvas and viewport identities.
  for(const child of [...oldViewport.childNodes])if(child!==canvas)child.remove();
  oldViewport.prepend(...nextViewport.childNodes);
  nextViewport.replaceWith(oldViewport);
 }else if(canvas){
  if(nextViewport)nextViewport.append(canvas);
  else if(canvas.parentElement!==document.body)document.body.prepend(canvas);
 }
 root.replaceChildren(template.content);root.dataset.surfaceScreen=screen;root.scrollTop=0;
}
