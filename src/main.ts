import './style.css';
import {
  createGame, choose, advance, bestChoices, probability, loadGame, saveGame, defaultSettings,
  clearGame, type GameState, type Settings, type Urn,
} from './core/game';
import type { GameScene } from './presentation/scene';

declare global { interface Window { __THEGAME_READY__: boolean; __THEGAME_METRICS__?: () => unknown } }
type Screen = 'menu' | 'intro' | 'room' | 'tutorial' | 'table' | 'complete';
const app = document.querySelector<HTMLDivElement>('#app')!;
const overlay = document.querySelector<HTMLDivElement>('#overlay')!;
const announcer = document.querySelector<HTMLDivElement>('#announcer')!;
const restored = loadGame();
let state: GameState = restored.state ?? createGame();
let hasSave = restored.state !== null;
let warning = restored.warning;
let screen: Screen = 'menu';
let selected: 0 | 1 | null = null;
let introLine = 0;
let introPhase: 'dark' | 'reveal' | 'lit' = 'dark';
let introTimers: ReturnType<typeof setTimeout>[] = [];
function stopIntro(): void { introTimers.forEach(clearTimeout); introTimers = []; }
function renderIntroFrame(): void {
  const focus = document.activeElement?.getAttribute('data-testid') ?? undefined;
  render(overlay.querySelector('dialog[open]') ? undefined : focus);
}
function beginIntro(): void {
  stopIntro(); introPhase = 'dark';
  introTimers.push(setTimeout(() => {
    if(screen !== 'intro') return;
    introPhase = 'reveal'; renderIntroFrame();
    // A low card-like tone accompanies the appearance, always respecting mute.
    chime(false);
  }, settings.reducedMotion ? 200 : 1800));
  introTimers.push(setTimeout(() => {
    if(screen !== 'intro') return;
    introPhase = 'lit'; renderIntroFrame();
  }, settings.reducedMotion ? 400 : 3300));
}
let tutorialStep = 0;
let scene: GameScene | null = null;
let sceneWarning = '';
let settings: Settings = structuredClone(restored.state?.settings ?? defaultSettings);
let audio: AudioContext | null = null;
let helpOpen = false;
const chapterNames = ['El primer inventario', 'Todo vuelve a su sitio', 'Nada queda igual', 'Tu turno, sin pistas'];
const escapeText = (s: string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const symbol = (color: 'red' | 'blue') => color === 'red' ? '▲' : '●';
const colorName = (color: 'red' | 'blue') => color === 'red' ? 'roja' : 'azul';
const btn = (id: string, label: string, cls = '', disabled = false) => `<button data-testid="${id}" class="${cls}" ${disabled ? 'disabled' : ''}>${label}</button>`;
function chime(correct = true): void {
  if (settings.volume === 0) return;
  try {
    audio ??= new AudioContext();
    void audio.resume();
    const osc = audio.createOscillator(), gain = audio.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(correct ? 523.25 : 261.63, audio.currentTime);
    gain.gain.setValueAtTime(0, audio.currentTime); gain.gain.linearRampToValueAtTime(settings.volume * 0.09, audio.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.3);
    osc.connect(gain).connect(audio.destination); osc.start(); osc.stop(audio.currentTime + 0.32);
  } catch { /* The full experience remains understandable without audio. */ }
}
function persist(): void {
  state.settings = structuredClone(settings);
  const failure = saveGame(state);
  if (failure) warning = failure;
  else { hasSave = true; warning = null; }
}
function announce(message: string): void { announcer.textContent = message; }
function applySettings(): void {
  document.documentElement.style.setProperty('--text-scale', String(settings.textScale));
  document.body.classList.toggle('reduced-motion', settings.reducedMotion);
  scene?.setSettings({ reducedMotion: settings.reducedMotion, sensitivity: settings.sensitivity, fov: 65 });
}
const shortcutName = (key: string) => key.replace('Key','').replace('Digit','').replace('ArrowLeft','←').replace('ArrowRight','→');
function shortcutSelect(id: string, value: string): string {
  return `<select data-testid="${id}">${['KeyA','KeyD','KeyE','Digit1','Digit2','KeyJ','KeyK','KeyL','ArrowLeft','ArrowRight'].map(key => `<option value="${key}" ${key === value ? 'selected' : ''}>${shortcutName(key)}</option>`).join('')}</select>`;
}
function setScreen(next: Screen, focus?: string): void {
  if(next !== 'intro') stopIntro();
  screen = next; selected = null; helpOpen = false;
  scene?.setMode(next === 'menu' || next === 'intro' ? 'menu' : next === 'room' || next === 'complete' ? 'room' : 'table', settings.reducedMotion);
  render(focus);
}
function header(): string {
  return `<header class="topbar"><a href="#" class="brand" data-action="home" aria-label="Volver al inicio"><span class="brand-emblem" aria-hidden="true">◆</span><span>La Casa del Azar</span></a><span class="edition">El inventario de Vera <span class="edition-dot">/</span> Primer capítulo</span>${btn('settings-button', '<span aria-hidden="true">☷</span> Ajustes', 'quiet')}</header>`;
}
function badges(): string {
  return `<div class="scoreboard"><span><i aria-hidden="true">✧</i> Decisiones <strong data-testid="merit">${state.merit}/8</strong></span><span><i aria-hidden="true">◈</i> Fichas de azar <strong data-testid="chance-tokens">${state.tokens}</strong></span></div>`;
}
function menu(): string {
  return `<main class="menu-layout"><section class="menu-copy"><div class="fine-rule"></div><p class="eyebrow">Una invitación poco voluntaria</p><h1>La casa<br>del azar<span class="title-period">.</span></h1><p class="menu-tagline">La suerte reparte.<br>Vos decidís qué hacer con ella.</p><p class="menu-description">Una sala cerrada, dos urnas y una anfitriona que lleva todas las cuentas. Tu primera prueba empieza en la mesa.</p><div class="menu-actions">${hasSave ? btn('continue-game', 'Retomar mi partida <span aria-hidden="true">↗</span>', 'primary') : ''}${btn('new-game', hasSave ? 'Nueva partida' : 'Tomar asiento <span aria-hidden="true">↗</span>', hasSave ? 'secondary' : 'primary')}</div><p class="menu-note">Sin prisa. Sin dinero real. Con algo que aprender.</p></section><div class="scene-caption"><span class="caption-line"></span><span>Mesa I <b>El inventario de Vera</b></span></div></main><footer class="menu-footer"><span>Probabilidad, decisiones y una posible salida.</span><button data-action="credits" class="text-button">Acerca de este capítulo</button><span class="desktop-note">Para teclado y mouse</span></footer>`;
}
const intro = [
  ['El anfitrión', 'Una carta violeta se enciende en la oscuridad. El hombre del abrigo ya está frente a vos. «Ah… por fin. Tu libertad se juega acá. La suerte reparte; vos vas a tener que entender la mano».'],
  ['El anfitrión', '«Los grilletes se abren. Podés moverte; la puerta seguirá cerrada. Tres asistentes. Tres sellos. Después, una partida conmigo y la puerta se abre. Vera te espera en la primera mesa. Su contabilidad es terrible para las excusas».'],
  ['Vera', '«Acercate. En esta casa una buena decisión puede terminar mal. Eso no la convierte en una mala decisión. Te voy a mostrar por qué».'],
];
function introView(): string {
  const [speaker, line] = intro[introLine]!;
  const dark = introPhase === 'dark';
  return `<main class="intro-layout"><p class="context-note">${dark ? 'No ves nada. Alguien baraja muy cerca.' : introPhase === 'reveal' ? 'Una carta violeta. Una sonrisa. Ya no estás solo.' : 'La lámpara se enciende. La puerta sigue cerrada.'}</p><section class="dialogue-card" aria-label="Introducción"><span class="eyebrow">${dark ? 'Un momento antes…' : speaker}</span><h1>${dark ? 'Todas las luces están apagadas.' : introLine === 2 ? 'Vera lleva las cuentas.' : 'La casa te estaba esperando.'}</h1><p aria-live="polite">${dark ? 'Un roce de cartas. Después, silencio.' : line}</p><div class="dialogue-actions">${btn('intro-next', introLine === 2 ? 'Entrar a la sala' : 'Continuar', 'primary', dark)}${btn('skip-intro', 'Saltar introducción', 'quiet')}</div><span class="page-count">${introLine + 1} / 3</span></section></main>`;
}
function room(): string {
  return `<main class="room-layout"><section class="room-copy"><p class="eyebrow">La sala</p><h1>Cada mesa,<br>una forma de mirar.</h1><p>Tus manos están libres. La puerta, por ahora, no.</p></section><section class="table-directory" aria-label="Mesas de la sala"><button class="table-entry available" data-testid="enter-urns"><span class="table-number">I</span><span><small>Disponible · Vera</small><strong>El inventario</strong><span>Urnas, probabilidades y lo que cambia al elegir.</span></span><span class="entry-arrow" aria-hidden="true">↗</span></button><div class="table-entry locked"><span class="table-number">II</span><span><small>Próximo capítulo · Doble</small><strong>Los contratos</strong><span>Promedios, dados y decisiones con riesgo.</span></span><span aria-hidden="true">◇</span></div><div class="table-entry locked"><span class="table-number">III</span><span><small>Próximo capítulo · Ada</small><strong>El archivo</strong><span>Muestras, registros y preguntas incómodas.</span></span><span aria-hidden="true">◇</span></div><p class="development-note">Este MVP incluye la primera mesa completa. Los otros encuentros y la salida final pertenecen a la campaña en desarrollo.</p></section></main>`;
}
function tutorial(): string {
  const steps = [
    ['Primero, mirá lo que hay.', 'Buscamos una ficha roja ▲. U tiene 3 rojas y 2 azules: 3 de sus 5 fichas sirven. V tiene una de cada color: 1 de 2. Elegir U ofrece 60 % frente a 50 %.', 'Elegir U en la demostración'],
    ['Salió roja. Ahora falta una.', 'Esta extracción está preparada para enseñar. Quitamos una roja de U sin reponerla: quedan 2 rojas y 2 azules. La próxima roja ya no tiene 3/5 de probabilidad, sino 2/4.', 'Comparar las urnas otra vez'],
    ['Una decisión nueva con datos nuevos.', 'Ahora U y V ofrecen lo mismo: 1/2. Cualquiera de las dos es una buena elección. Las partidas normales no están preparadas: el azar puede darte una ficha que no buscabas.', 'Empezar la primera ronda'],
  ] as const;
  const [title, text, action] = steps[tutorialStep]!;
  return `<main class="table-layout"><section class="table-heading"><p class="eyebrow">Antes de jugar</p><h1>El inventario de Vera</h1></section><aside class="game-panel tutorial-panel"><span class="prepared-label">Demostración preparada · ${tutorialStep + 1}/3</span><h2>${title}</h2><p>${text}</p><div class="tutorial-odds"><span>Urna U <b>${tutorialStep === 0 ? '3/5 · 60 %' : '2/4 · 50 %'}</b></span><span>Urna V <b>1/2 · 50 %</b></span></div><blockquote>«Lo que sacaste ya no está adentro. Mi contabilidad suele ser así de radical».</blockquote>${btn('tutorial-next', action, 'primary full')}${btn('skip-tutorial', 'Ya entendí, ir a la partida', 'text-button full')}</aside><div class="table-bottom-note">Las fichas rojas son triángulos ▲. Las azules son círculos ●.</div></main>`;
}
function urnChoice(urn: Urn, index: 0 | 1): string {
  const p = probability(urn, state.event);
  const percent = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 }).format(100 * p.numerator / p.denominator);
  const choosing = state.phase === 'choose' || state.phase === 'guided';
  const hinted = state.assisted && bestChoices(state).includes(index);
  return `<button data-testid="urn-${index}" class="urn-option ${selected === index ? 'selected' : ''} ${hinted ? 'hinted' : ''}" aria-pressed="${selected === index}" ${!choosing ? 'disabled' : ''}><span class="urn-option-head"><strong>Urna ${index === 0 ? 'U' : 'V'}</strong><span>${selected === index ? '✓ Elegida' : hinted ? 'Elegí esta' : 'Elegir'}</span></span><span class="inventory"><span class="red-token">▲</span> ${urn.red} rojas <span class="blue-token">●</span> ${urn.blue} azules</span><span class="odds"><b>${p.numerator}/${p.denominator}</b><span>${state.round === 3 && !state.assisted && !helpOpen ? "Compará las fracciones" : `${percent} % de ${colorName(state.event)}`}</span></span></button>`;
}
function feedback(): string {
  const last = state.last;
  if (!last) return '';
  const success = last.color === state.event;
  const p = last.beforeProbability;
  const outcome = `Salió una ficha ${colorName(last.color)} ${symbol(last.color)}.`;
  const judgment = last.correct ? 'Buena decisión.' : 'Tu plan puede mejorar.';
  const why = last.correct ? (success ? 'Elegiste una de las urnas con mayor probabilidad del evento.' : 'Elegiste la mayor probabilidad. Eso no prometía certeza: esta vez el resultado no acompañó.') : (success ? 'La ficha ayudó, pero otra urna ofrecía una probabilidad mayor. La suerte y el razonamiento son cosas distintas.' : 'Otra urna ofrecía una probabilidad mayor. Mirá el número de fichas favorables y el total antes de elegir de nuevo.');
  return `<section class="result-card" data-testid="result-feedback"><span class="result-token ${last.color}-token" aria-hidden="true">${symbol(last.color)}</span><h2>${outcome}</h2><p class="decision-verdict">${judgment} ${state.assisted ? 'Práctica con ayuda.' : last.correct ? '+1 mérito.' : '+0 méritos.'}</p><p>${why}</p><p class="small-note">Antes de extraer: ${p.numerator}/${p.denominator}. ${state.replacement ? 'La ficha volvió a su urna: el inventario no cambia.' : 'La ficha queda afuera: el inventario ya está actualizado.'}</p></section>`;
}
function table(): string {
  const choosing = state.phase === 'choose' || state.phase === 'guided';
  const isSummary = state.phase === 'roundEnd';
  const title = state.assisted ? `Práctica guiada ${state.round + 1}/2` : chapterNames[state.round];
  return `<main class="table-layout"><section class="table-heading"><p class="eyebrow">Mesa I · Vera, la inventarista</p><h1>El inventario</h1><p class="round-context" data-testid="round-label">${state.assisted ? title : `Ronda ${state.round + 1} de 4 · ${title}`}</p>${badges()}</section><aside class="game-panel"><div class="round-progress" aria-label="${state.assisted ? 'Práctica guiada' : `Ronda ${state.round + 1} de cuatro`}">${[0,1,2,3].map(i => `<span class="${i <= state.round ? 'filled' : ''}"></span>`).join('')}</div><div class="objective-label">${state.assisted ? 'Demostración preparada · con ayuda' : `Extracción ${state.step + 1} de 2`}</div><h2 class="objective">Buscá una ficha <span class="${state.event}-token">${colorName(state.event)} ${symbol(state.event)}</span></h2><p class="rule-tag">${state.replacement ? '↻ Con reposición' : '↗ Sin reposición'} <span>${state.replacement ? 'Cada ficha vuelve a la urna.' : 'La ficha extraída queda afuera.'}</span></p>${choosing ? `<p class="decision-prompt">${state.step === 0 ? 'Mirá las proporciones. ¿De cuál preferís sacar?' : state.replacement ? 'El inventario se conserva. Volvé a comparar antes de decidir.' : 'El inventario cambió. Volvé a comparar antes de decidir.'}</p><div class="urn-options">${urnChoice(state.urns[0],0)}${urnChoice(state.urns[1],1)}</div>${btn('confirm-choice', selected === null ? 'Elegí una urna para continuar' : `Extraer de la urna ${selected === 0 ? 'U' : 'V'}`, 'primary full', selected === null)}<p class="small-note">${state.assisted ? 'La ayuda resalta una elección válida. Completá cuatro acciones para continuar.' : 'El mérito depende de tu elección; las fichas, del azar.'}</p>` : `${isSummary ? `<section class="round-summary"><span class="summary-mark" aria-hidden="true">✧</span><h2>Una ronda más clara.</h2><p>${state.assisted ? 'Terminaste este escenario preparado.' : state.round === 3 ? state.merit >= 6 ? 'Tus decisiones alcanzaron el sello de Vera.' : 'Te falta un poco de práctica. Vera preparó dos escenarios cortos para ayudarte.' : 'Los próximos inventarios empiezan de cero. Lo que aprendiste se queda con vos.'}</p>${badges()}</section>` : feedback()}${btn('next-step', isSummary ? state.round === 3 || (state.assisted && state.round === 1) ? 'Ver mi resultado' : 'Siguiente ronda' : state.step === 0 ? 'Volver a decidir' : 'Cerrar la ronda', 'primary full')}`}${helpOpen ? `<div class="help-note"><strong>La cuenta de Vera</strong><p>Probabilidad = fichas del color buscado / total de fichas. Compará proporciones, no sólo cantidades. Si ambas proporciones son iguales, ambas urnas sirven. ${state.replacement ? 'Con reposición, el inventario se conserva.' : 'Sin reposición, quitá la ficha que viste antes de volver a comparar.'}</p></div>` : ''}<div class="panel-footer">${btn('help-button', helpOpen ? 'Cerrar ayuda' : '¿Cómo comparo?', 'text-button')}${btn('back-room', 'Volver a la sala', 'text-button')}</div></aside><div class="table-bottom-note"><span class="speaker-dot"></span> Vera <span>«Una ficha no sabe nada de tus méritos».</span></div></main>`;
}
function complete(): string {
  return `<main class="completion-layout" data-testid="completion"><section class="completion-card"><div class="seal" aria-hidden="true">✧</div><p class="eyebrow">Mesa I completada</p><h1>Vera firma<br>tu inventario.</h1><p class="completion-quote">«El azar hizo su trabajo.<br>Ahora vos también sabés hacer el tuyo».</p>${badges()}<p>${state.assisted ? 'Completaste la práctica guiada. Tu sello indica «con ayuda»; podés volver a intentarlo para practicar sin pistas.' : 'Lograste el sello con tus decisiones. Incluso una buena elección puede tener un resultado desfavorable.'}</p><div class="learning-summary"><span>Práctica: comparar proporciones</span><span>Práctica: actualizar después de observar</span><span>Práctica: separar el plan de la suerte</span></div><p class="small-note">Este sello registra tus decisiones, no certifica dominio. Este es el final del primer capítulo disponible; los otros encuentros siguen en desarrollo.</p>${btn('practice-again', 'Volver a practicar', 'primary full')}${btn('back-room', 'Explorar la sala', 'text-button full')}</section></main>`;
}
function render(focusId?: string): void {
  document.body.dataset.screen = screen;
  document.body.dataset.introPhase = introPhase;
  document.body.dataset.speaker = screen === 'intro' && introLine === 2 ? 'vera' : 'captor';
  app.innerHTML = header() + ({ menu, intro: introView, room, tutorial, table, complete }[screen])() +
    (warning ? `<div class="save-warning" role="status">${escapeText(warning)}</div>` : '') +
    (sceneWarning ? `<div class="graphics-warning">${sceneWarning} ${btn('retry-graphics','Reintentar 3D','quiet')}</div>` : '');
  updateVisual();
  if (focusId) document.querySelector<HTMLButtonElement>(`[data-testid="${focusId}"]`)?.focus();
}
function updateVisual(): void {
  const urns: Urn[] = screen === 'tutorial' ? [{red:tutorialStep === 0 ? 3 : 2,blue:2},{red:1,blue:1}] : state.urns;
  scene?.updateUrns(urns, selected, screen === 'tutorial' && tutorialStep > 0 ? 'red' : state.phase === 'revealed' ? state.last?.color : undefined);
}
function commitSelection(index: 0 | 1): void {
  if (screen !== 'table' || !['choose','guided'].includes(state.phase)) return;
  selected = index; render(`urn-${index}`);
}
function startNew(): void {
  state = createGame(); state.settings = structuredClone(settings); persist(); introLine = 0;
  beginIntro(); setScreen('intro', 'skip-intro');
}
function enterTable(): void {
  if (state.phase === 'complete') { setScreen('complete', 'practice-again'); return; }
  if (!state.history.length) { tutorialStep = 0; setScreen('tutorial', 'tutorial-next'); }
  else setScreen('table', state.phase === 'revealed' || state.phase === 'roundEnd' ? 'next-step' : 'urn-0');
}
function showDialog(title: string, content: string): HTMLDialogElement {
  const previous = document.activeElement as HTMLElement | null;
  overlay.innerHTML = `<dialog class="modal"><div class="modal-heading"><h2>${title}</h2>${btn('close-dialog', 'Cerrar ✕', 'quiet')}</div>${content}</dialog>`;
  const dialog = overlay.querySelector('dialog')!;
  dialog.addEventListener('close', () => {
    // A closed dialog may already have been replaced by another one (reset/confirmation).
    if (!dialog.isConnected) return;
    dialog.remove(); previous?.focus();
  });
  dialog.showModal(); return dialog;
}
function showSettings(): void {
  showDialog('Hacé tuya la mesa', `<p>Podés ajustar la experiencia en cualquier momento. Ninguna decisión tiene límite de tiempo.</p><label class="setting-row"><span>Reducir movimiento<small>Cambios de cámara inmediatos y sin animación de reposo.</small></span><input type="checkbox" data-testid="reduced-motion" ${settings.reducedMotion ? 'checked' : ''}></label><label class="setting-row"><span>Tamaño de texto<small>Escala de interfaz, explicaciones y subtítulos.</small></span><select data-testid="text-scale">${[1,1.25,1.5,2].map(n => `<option value="${n}" ${settings.textScale===n?'selected':''}>${n*100} %</option>`).join('')}</select></label><label class="setting-row"><span>Volumen<small>Las instrucciones también se entienden en silencio.</small></span><input data-testid="volume" type="range" min="0" max="1" step="0.05" value="${settings.volume}" aria-label="Volumen"></label><div class="settings-info"><strong>Controles de mesa</strong><p>Tab para recorrer opciones. Enter o Espacio para activar. Escape para pausar o volver. También podés seleccionar las urnas en la escena.</p></div><div class="settings-actions">${btn('restore-settings', 'Restaurar ajustes', 'secondary')}${btn('delete-save', 'Borrar progreso…', 'text-button')}</div><p class="small-note">Guardado local en este navegador. Borrar sus datos borra el progreso.</p>`);
  const controls = document.createElement('div');
  controls.innerHTML = `<h3 class="controls-heading">Atajos reasignables</h3><p class="small-note">Además de Tab y Enter, estos atajos funcionan al elegir en la mesa.</p><label class="setting-row"><span>Elegir urna U</span>${shortcutSelect('bind-urn-u',settings.keys.left)}</label><label class="setting-row"><span>Elegir urna V</span>${shortcutSelect('bind-urn-v',settings.keys.right)}</label><label class="setting-row"><span>Confirmar extracción</span>${shortcutSelect('bind-confirm',settings.keys.interact)}</label><p data-testid="binding-warning" class="small-note" role="status"></p>`;
  overlay.querySelector('.settings-info')?.before(controls);
}
app.addEventListener('click', event => {
  const target = (event.target as HTMLElement).closest<HTMLElement>('button, [data-action]');
  if (!target) return;
  const id = target.dataset.testid;
  if (id === 'retry-graphics') { void initScene(); return; }
  if (id === 'settings-button') { showSettings(); return; }
  if (target.dataset.action === 'home') { event.preventDefault(); setScreen('menu'); return; }
  if (target.dataset.action === 'credits') {
    showDialog('Un primer capítulo', `<p>La Casa del Azar es un juego sobre probabilidad y decisiones. Este MVP incluye la mesa de urnas de Vera; la campaña completa sigue en desarrollo.</p><p>Nueva dirección de animación de los años treinta: sala y personajes ilustrados con generación de imágenes. Captor adaptado de las referencias de Gambito aportadas por el usuario; Cuphead es referencia estética. Sin afiliación con Marvel ni Studio MDHR. Mesa y urnas interactivas propias. Sonidos sintetizados. Babylon.js bajo Apache 2.0. Los recursos de juego se alojan junto a esta página.</p><p>La experiencia educativa y la diversión todavía deben evaluarse con jugadores.</p><a href="https://github.com/GaryPoui/TheGame" target="_blank" rel="noopener">Documentación, código y licencias</a>`); return;
  }
  if (id === 'new-game' || id === 'practice-again') {
    if (hasSave && state.history.length && id === 'new-game') { showDialog('¿Empezar de nuevo?', `<p>La nueva partida reemplaza tu progreso actual. Podés cerrar esta ventana para conservarlo.</p>${btn('confirm-new-game','Empezar de nuevo','primary full')}`); return; }
    startNew(); return;
  }
  if (id === 'continue-game') { setScreen(state.phase === 'complete' ? 'complete' : 'table', state.phase === 'choose' || state.phase === 'guided' ? 'urn-0' : 'next-step'); return; }
  if (id === 'skip-intro' || (id === 'intro-next' && introLine === 2)) { setScreen('room','enter-urns'); return; }
  if (id === 'intro-next') { stopIntro(); introPhase = 'lit'; introLine++; render('intro-next'); return; }
  if (id === 'enter-urns') { enterTable(); return; }
  if (id === 'tutorial-next') {
    if (tutorialStep < 2) { tutorialStep++; chime(); render('tutorial-next'); }
    else setScreen('table','urn-0');
    return;
  }
  if (id === 'skip-tutorial') { setScreen('table','urn-0'); return; }
  if (id === 'urn-0' || id === 'urn-1') { commitSelection(id === 'urn-0' ? 0 : 1); return; }
  if (id === 'confirm-choice' && selected !== null) {
    const next = choose(state,selected);
    if (next === state) { announce('La ayuda resalta una urna válida. Elegila para continuar.'); return; }
    state = next; selected = null; persist(); chime(state.last?.correct); render('next-step');
    announce(`Salió ${colorName(state.last!.color)}. ${state.last!.correct ? 'Buena decisión.' : 'Revisá las proporciones.'}`); return;
  }
  if (id === 'next-step') {
    state = advance(state); selected = null; persist();
    if (state.phase === 'complete') setScreen('complete','practice-again');
    else render(state.phase === 'roundEnd' ? 'next-step' : 'urn-0'); return;
  }
  if (id === 'back-room') { persist(); setScreen('room','enter-urns'); return; }
  if (id === 'help-button') { helpOpen = !helpOpen; render('help-button'); }
});
overlay.addEventListener('click', event => {
  const id = (event.target as HTMLElement).closest<HTMLElement>('button')?.dataset.testid;
  if (id === 'close-dialog' || id === 'resume-game') overlay.querySelector('dialog')?.close();
  if (id === 'confirm-new-game') { overlay.querySelector('dialog')?.close(); startNew(); }
  if (id === 'restore-settings') { settings = structuredClone(defaultSettings); applySettings(); if(hasSave)persist(); overlay.querySelector('dialog')?.close(); showSettings(); }
  if (id === 'delete-save') { overlay.querySelector('dialog')?.close(); showDialog('Borrar el progreso', `<p>Se eliminarán la partida y su copia de seguridad. Esta acción no se puede deshacer.</p>${btn('confirm-delete','Borrar el progreso','primary full')}`); }
  if (id === 'confirm-delete') { clearGame(); hasSave=false; warning=null; state=createGame(); settings=structuredClone(defaultSettings); applySettings(); overlay.querySelector('dialog')?.close(); setScreen('menu','new-game'); }
});
overlay.addEventListener('change', event => {
  const el = event.target as HTMLInputElement;
  if (el.dataset.testid === 'reduced-motion') settings.reducedMotion = el.checked;
  if (el.dataset.testid === 'text-scale') settings.textScale = Number(el.value);
  if (el.dataset.testid === 'volume') settings.volume = Number(el.value);
  const bindingMap: Record<string, 'left' | 'right' | 'interact'> = {'bind-urn-u':'left','bind-urn-v':'right','bind-confirm':'interact'};
  const action = bindingMap[el.dataset.testid ?? ''];
  if (action) {
    const otherKeys = (['left','right','interact'] as const).filter(k => k !== action).map(k => settings.keys[k]);
    const message = overlay.querySelector('[data-testid="binding-warning"]');
    if (otherKeys.includes(el.value)) {
      el.value = settings.keys[action];
      if (message) message.textContent = 'Esa tecla ya está asignada. Elegí otra para evitar un conflicto.';
      return;
    }
    settings.keys[action] = el.value;
    if (message) message.textContent = 'Atajo actualizado.';
  }
  applySettings(); if(hasSave)persist();
});
document.addEventListener('keydown', event => {
  if (!overlay.querySelector('dialog[open]') && screen === 'table' && ['choose','guided'].includes(state.phase) && !event.repeat) {
    if (event.code === settings.keys.left) { event.preventDefault(); commitSelection(0); return; }
    if (event.code === settings.keys.right) { event.preventDefault(); commitSelection(1); return; }
    if (event.code === settings.keys.interact && selected !== null) { event.preventDefault(); document.querySelector<HTMLButtonElement>('[data-testid="confirm-choice"]')?.click(); return; }
  }
  if (event.key !== 'Escape' || overlay.querySelector('dialog[open]')) return;
  if (screen === 'menu') return;
  showDialog('La casa puede esperar', `<p>La partida está en pausa. Tu decisión y el azar se quedan donde estaban.</p>${btn('resume-game','Seguir jugando','primary full')}<p class="small-note">Sin tiempo límite. Tomate lo que necesites.</p>`);
});
async function initScene(): Promise<void> {
  try {
    scene?.dispose(); scene = null;
    const module = await import('./presentation/scene');
    scene = new module.GameScene(document.querySelector<HTMLCanvasElement>('#scene')!, commitSelection);
    await scene.ready;
    window.__THEGAME_METRICS__ = () => scene?.metrics();
    sceneWarning = ''; applySettings();
    scene.setMode(screen === 'menu' || screen === 'intro' ? 'menu' : screen === 'room' || screen === 'complete' ? 'room' : 'table', true);
    updateVisual(); render();
  } catch {
    sceneWarning = 'La sala 3D no pudo iniciarse. Podés jugar con los controles de la página.';
    render();
  }
  window.__THEGAME_READY__ = true;
}
applySettings(); render();
await initScene();
