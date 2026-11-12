import type {Settings} from '../core/game';

export type SettingsSection='display'|'sound'|'session';
export function syncSettingSteps(root:ParentNode):void {
 for(const button of root.querySelectorAll<HTMLButtonElement>('[data-setting-step]')){
  const control=root.querySelector<HTMLInputElement|HTMLSelectElement>(`[data-testid="${button.dataset.settingStep}"]`);
  if(!control)continue;
  const previous=Number(button.dataset.delta)<0;
  button.disabled=control instanceof HTMLSelectElement
   ? previous?control.selectedIndex===0:control.selectedIndex===control.options.length-1
   : previous?Number(control.value)<=Number(control.min):Number(control.value)>=Number(control.max);
 }
}
export function menuIcon(name:'display'|'sound'|'session'|'back'|'next'|'lock'|'check'):string {
 const paths={display:'M3 4h18v12H3z M8 21h8 M12 16v5',sound:'M4 9h4l5-4v14l-5-4H4z M17 8c3 2 3 6 0 8 M20 5c5 4 5 10 0 14',session:'M5 3h14v18H5z M9 8h6 M9 12h6 M9 16h3',back:'m15 5-7 7 7 7',next:'m9 5 7 7-7 7',lock:'M6 10h12v11H6z M8 10V7a4 4 0 0 1 8 0v3',check:'m5 12 4 4 10-10'};
 return `<svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${paths[name]}"/></svg>`;
}
const step=(name:string,delta:number,label:string)=>`<button type="button" class="setting-step" data-setting-step="${name}" data-delta="${delta}" aria-label="${label}">${menuIcon(delta<0?'back':'next')}</button>`;
export function settingsMenu(settings:Settings,section:SettingsSection,inGame:boolean):string {
 const volume=Math.round(settings.volume*100);
 const tab=(id:SettingsSection,label:string)=>`<button role="tab" id="settings-tab-${id}" aria-selected="${section===id}" tabindex="${section===id?0:-1}" aria-controls="settings-${id}" data-settings-tab="${id}">${menuIcon(id)}<span>${label}</span></button>`;
 return `<div class="settings-shell"><nav class="settings-tabs" role="tablist" aria-label="Categorías de ajustes" aria-orientation="vertical">${tab('display','Pantalla')}${tab('sound','Sonido')}${tab('session','Partida')}</nav>
 <div class="settings-content">
 <section id="settings-display" role="tabpanel" aria-labelledby="settings-tab-display" ${section==='display'?'':'hidden'}><h3>Pantalla</h3>
 <div class="setting-row"><div class="setting-label"><span id="text-scale-label">Tamaño de texto</span><small id="text-scale-description">Incluye explicaciones y subtítulos.</small></div><div class="setting-select setting-carousel">${step('text-scale',-1,'Reducir tamaño de texto')}<select data-testid="text-scale" aria-labelledby="text-scale-label" aria-describedby="text-scale-description">${[1,1.25,1.5,2].map(n=>`<option value="${n}" ${settings.textScale===n?'selected':''}>${n*100} %</option>`).join('')}</select>${step('text-scale',1,'Aumentar tamaño de texto')}</div></div>
 <label class="setting-row"><span class="setting-label"><span id="motion-label">Reducir movimiento</span><small id="motion-description">Sin movimientos de cámara ni animaciones de reposo.</small></span><span class="setting-switch"><input type="checkbox" role="switch" data-testid="reduced-motion" aria-labelledby="motion-label" aria-describedby="motion-description" ${settings.reducedMotion?'checked':''}><span class="setting-switch-track" aria-hidden="true"></span><span class="setting-switch-state" data-testid="motion-state" aria-hidden="true">${settings.reducedMotion?'Activado':'Desactivado'}</span></span></label>
 </section>
 <section id="settings-sound" role="tabpanel" aria-labelledby="settings-tab-sound" ${section==='sound'?'':'hidden'}><h3>Sonido</h3>
 <div class="setting-row sound-row"><div class="setting-label"><span id="volume-label">Volumen</span><small id="volume-description">En cero, el juego queda en silencio.</small></div><div class="setting-volume-control"><output for="settings-volume" data-testid="volume-value" aria-hidden="true">${volume} %</output><div class="volume-slider">${step('volume',-1,'Bajar volumen')}<input id="settings-volume" data-testid="volume" type="range" min="0" max="1" step="0.05" value="${settings.volume}" aria-labelledby="volume-label" aria-describedby="volume-description" aria-valuetext="${volume} %" style="--range-progress:${volume}%">${step('volume',1,'Subir volumen')}</div></div></div>
 <p class="settings-hint">Las instrucciones también se pueden leer.</p></section>
 <section id="settings-session" role="tabpanel" aria-labelledby="settings-tab-session" ${section==='session'?'':'hidden'}><h3>Partida</h3><div class="session-actions">
 ${inGame?'<button class="secondary full" data-testid="return-main-menu">Guardar y volver al inicio</button>':''}<button class="secondary full" data-testid="restore-settings">Restaurar ajustes</button><button class="text-button danger-action" data-testid="delete-save">Borrar progreso</button></div><p class="settings-hint">Borrar el progreso requiere confirmación.</p></section>
 </div><footer class="settings-bottom"><span class="settings-save-state" role="status">Los cambios se guardan al instante</span><button class="primary" data-testid="settings-return">${menuIcon('back')}${inGame?'Volver al juego':'Volver al inicio'}</button></footer></div>`;
}
