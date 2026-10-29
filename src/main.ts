import './style.css';
import './ui/contracts.css';
import './ui/table-experience.css';
import './ui/campaign.css';
import './ui/exploration.css';
import './ui/dialogue-dice.css';
import './ui/dialogue-polish.css';
import './ui/table-hosts.css';
import './ui/compact-dice.css';
import './ui/dice-table.css';
import './ui/doble-table-focus.css';
import './ui/ada-table.css';
import './ui/clear-ui.css';
import {learningReview, reviewButton, tutorialSummary, type LearningTopic} from './ui/learning';
import {createTutorial,advanceTutorial,requestHelp} from './core/tutorial/runner';
import {GameAudio} from './platform/audio';
import {INTRO} from './content/intro';
import {createDialogue,applyDialogue} from './core/dialogue/runner';
import {CameraController} from './presentation/camera-controller';
import {nearbyTable,ROOM_TABLES} from './presentation/interaction';
import {actionForKey,rebind,type InputAction} from './platform/input';
import {createRecords,applyRecordsCommand,recordsChoices,type RecordsChoice,type RecordsCommand} from './core/tables/records';
import {createFinale,applyFinaleCommand,finaleChoices,type FinaleChoice,type FinaleCommand} from './core/tables/finale';
import {tableUnlocked,checkpointCampaign} from './core/campaign/progression';
import {recordsView} from './ui/records';
import {endingView} from './ui/ending';
import { tokenTray, veraCoach, decisionTrack } from './ui/table-experience';
import { createContracts, applyContractCommand, type ContractCommand } from './core/tables/contracts';
import { CONTRACT_IDS, type ContractId } from './core/math/dice';
import { compareContracts, type ComparisonRun } from './core/math/simulation';
import { contractsTutorial, contractsView, contractsComplete } from './ui/contracts';
import {
  createGame, choose, advance, bestChoices, probability, loadGame, saveGame, defaultSettings,
  clearGame, type GameState, type Settings, type Urn,
} from './core/game';
import type { GameScene } from './presentation/scene';

declare global { interface Window { __THEGAME_READY__: boolean; __THEGAME_METRICS__?: () => unknown } }
type Screen = 'menu' | 'intro' | 'room' | 'tutorial' | 'table' | 'complete' | 'contracts' | 'records' | 'finale' | 'outside' | 'street';
const app = document.querySelector<HTMLDivElement>('#app')!;
const overlay = document.querySelector<HTMLDivElement>('#overlay')!;
const announcer = document.querySelector<HTMLDivElement>('#announcer')!;
const restored = loadGame();
let state: GameState = restored.state ?? createGame();
let hasSave = restored.state !== null;
let warning = restored.warning;
let screen: Screen = 'menu';
let selected: 0 | 1 | null = null;
let cardsVisible = false;
let selectedRecord: RecordsChoice|null=null;
let selectedFinale: FinaleChoice|null=null;
let storageConflict=false;
let introLine = Math.max(0,INTRO.nodes.findIndex(n=>n.id===state.intro?.node));
const cameraController=new CameraController();
if(state.roomPosition)cameraController.position={...state.roomPosition};
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
let tutorialFlow=createTutorial();
let demoChoice: 0 | 1 | null = null;
let demoCardsVisible=false;
let dobleTutorialStep = 0;
let selectedContract: ContractId | null = null;
let comparisonResult: ComparisonRun | null = null;
let rehearsalPair: [number, number] = [2, 2];
let diceRolling = false;
let diceCombinationsVisible = false;
let diceRollTimer: ReturnType<typeof setTimeout> | undefined;
let scene: GameScene | null = null;
let sceneWarning = '';
window.addEventListener('blur',()=>gameAudio.suspend());
document.querySelector('#scene')?.addEventListener('webglcontextlost',event=>{event.preventDefault();sceneWarning='Se interrumpió la sala 3D. Tu progreso sigue disponible en los controles de la página.';render();});
document.querySelector('#scene')?.addEventListener('webglcontextrestored',()=>{sceneWarning='';render();});
let settings: Settings = structuredClone(restored.state?.settings ?? defaultSettings);
const gameAudio=new GameAudio();
let helpOpen = false;
const chapterNames = ['Elegí dónde sacar', 'La ficha vuelve', 'La ficha queda afuera', 'Probá sin pistas'];
const escapeText = (s: string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const symbol = (color: 'red' | 'blue') => color === 'red' ? '▲' : '●';
const colorName = (color: 'red' | 'blue') => color === 'red' ? 'roja' : 'azul';
const btn = (id: string, label: string, cls = '', disabled = false) => `<button data-testid="${id}" class="${cls}" ${disabled ? 'disabled' : ''}>${label}</button>`;
function chime(correct=true):void {gameAudio.setVolume(settings.volume);gameAudio.tone(correct);}
function urnsSealed(): boolean { return state.seals?.urns === true || state.phase === 'complete'; }
function persist(): void {
  state=checkpointCampaign(state);
  if(storageConflict) {warning='Otra pestaña cambió el progreso. Esta partida sigue en memoria. Recargá para retomar el guardado más reciente.';return;}
  state.settings = structuredClone(settings);
  const failure = saveGame(state);
  if (failure) warning = failure;
  else { hasSave = true; warning = null; }
}
function announce(message: string): void { announcer.textContent = message; }
function applySettings(): void {
  gameAudio.setVolume(settings.volume);
  document.documentElement.style.setProperty('--text-scale', String(settings.textScale));
  document.body.classList.toggle('enlarged-text', settings.textScale > 1);
  document.body.classList.toggle('reduced-motion', settings.reducedMotion);
  scene?.setSettings({ reducedMotion: settings.reducedMotion, sensitivity: settings.sensitivity, fov: 65 });
}
const shortcutName = (key: string) => key.replace('Key','').replace('Digit','').replace('ArrowLeft','←').replace('ArrowRight','→');
function shortcutSelect(id: string, value: string): string {
  return `<select data-testid="${id}">${['KeyW','KeyS','KeyA','KeyD','KeyE','Digit1','Digit2','KeyJ','KeyK','KeyL','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].map(key => `<option value="${key}" ${key === value ? 'selected' : ''}>${shortcutName(key)}</option>`).join('')}</select>`;
}
function setScreen(next: Screen, focus?: string): void {
  if(next !== 'intro') stopIntro();
  if(next!=='contracts'){clearTimeout(diceRollTimer);diceRolling=false;scene?.stopDiceRoll();}
  cameraController.setMode(next==='room'?'exploration':next==='intro'?'dialogue':['table','contracts','records','finale','tutorial'].includes(next)?'table':'cinematic');
  gameAudio.setAmbience(next==='intro'||next==='room'||next==='finale'||next==='street');
  screen = next; selected = null; selectedContract = null; selectedRecord=null; selectedFinale=null; helpOpen = false; cardsVisible = false;
  scene?.setMode(next === 'menu' || next === 'intro' ? 'menu' : next === 'room' || next === 'complete' ? 'room' : 'table', settings.reducedMotion);
  render(focus);
  window.scrollTo({top:0,left:0,behavior:'instant'});
}
function header(): string {
  return `<header class="topbar" aria-label="Opciones del juego">${btn('settings-button', 'Ajustes', 'quiet')}</header>`;
}
function badges(): string {
  return `<div class="scoreboard"><span><i aria-hidden="true">✧</i> Decisiones <strong data-testid="merit">${state.merit}/8</strong></span><span><i aria-hidden="true">◈</i> Fichas ganadas <strong data-testid="chance-tokens">${state.tokens}</strong></span></div>`;
}
function menu(): string {
  return `<main class="menu-layout"><section class="menu-copy"><div class="fine-rule"></div><p class="eyebrow">Una invitación poco voluntaria</p><h1>La casa<br>del azar</h1><p class="menu-tagline">La suerte reparte y vos decidís qué hacer con ella.</p><p class="menu-description">Vera cuenta fichas. Doble vende contratos. Ada muestra sus fotos. Tres sellos y una última mesa para volver a la calle.</p><div class="menu-actions">${hasSave ? btn('continue-game', 'Reanudar partida <span aria-hidden="true">↗</span>', 'primary') : ''}${btn('new-game', hasSave ? 'Nueva partida' : 'Tomar asiento <span aria-hidden="true">↗</span>', hasSave ? 'secondary' : 'primary')}</div><p class="menu-note">Sin prisa. Sin dinero real. Con algo que aprender.</p></section><div class="scene-caption"><span class="caption-line"></span><span>Mesa I <b>Las urnas de Vera</b></span></div></main><footer class="menu-footer"><span>Probabilidad, decisiones y una posible salida.</span><button data-action="credits" class="text-button">Acerca de este capítulo</button><span class="desktop-note">Para teclado y mouse</span></footer>`;
}
const intro = INTRO.nodes.map(n=>[n.speaker,INTRO.strings[n.lineId]!] as const);
function introView(): string {
  const [speaker, line] = intro[introLine]!;
  const dark = introPhase === 'dark';
  return `<main class="intro-layout"><p class="context-note">${dark ? 'No ves nada. Alguien baraja muy cerca.' : introPhase === 'reveal' ? 'Una carta violeta. Una sonrisa. Ya no estás solo.' : 'La lámpara se enciende. La puerta sigue cerrada.'}</p><section class="dialogue-card" aria-label="Introducción"><div class="dialogue-heading"><span class="speaker-tag"><span class="speaker-emblem" aria-hidden="true">${dark?'◇':speaker==='Vera'?'V':'A'}</span>${dark ? 'Un momento antes…' : speaker}</span><span class="dialogue-progress" aria-label="Intervención ${introLine+1} de 3">${introLine+1} de 3</span></div><h1>${dark ? 'Todas las luces están apagadas.' : introLine === 2 ? 'Vera lleva las cuentas.' : 'La casa te estaba esperando.'}</h1><p aria-live="polite">${dark ? 'Un roce de cartas. Después, silencio.' : line}</p><div class="dialogue-actions">${btn('intro-next', introLine === 2 ? 'Entrar a la sala' : 'Continuar', 'primary', dark)}${btn('skip-intro', 'Saltar introducción', 'quiet')}${btn('intro-history','Volver a leer','dialogue-utility')}${introLine===0&&!dark?btn('remember-street','Recordar cómo llegaste','text-button'):''}</div></section></main>`;
}
function room(): string {
  const entries = [
    ['urns','I','Vera','Las urnas','Contá las chances y mirá qué cambia.','Disponible'],
    ['contracts','II','Doble','Los contratos','Elegí entre promedio, garantía y riesgo.','Necesitás el sello de Vera'],
    ['records','III','Ada','Las fotos tramposas','Descubrí las fotos que Ada dejó afuera.','Necesitás el sello de Doble'],
    ['finale','IV','El anfitrión','El contrato de salida','Usá lo aprendido para abrir la puerta.','Necesitás los tres sellos'],
  ] as const;
  return `<main class="room-layout"><section class="room-copy"><p class="eyebrow">La sala</p><h1>Cada mesa,<br>una forma de mirar.</h1><p>Tus manos están libres. ${state.freed?'La puerta también. Podés volver a practicar.':'Tres sellos y una última partida te separan de la salida.'}</p>${state.freed?btn('exit-house','Volver a la calle','primary'):''}${roomWalk()}</section><section class="table-directory" aria-label="Mesas de la sala">${entries.map(([id,n,name,title,description,requirement])=>{
    const unlocked=tableUnlocked(state,id),sealed=id==='finale'?state.freed:id==='urns'?urnsSealed():state.seals?.[id];
    return `<button class="table-entry ${unlocked?'available':'locked'}" data-testid="enter-${id}" ${unlocked?'':'aria-disabled="true"'}><span class="table-number">${n}</span><span><small>${unlocked?sealed?'Completada · '+name:'Disponible · '+name:requirement}</small><strong>${title}</strong><span>${description}</span></span><span aria-hidden="true">${unlocked?'↗':'◇'}</span></button>`;
  }).join('')}</section></main>`;
}
function demoInventory():[Urn,Urn]{
 const urns:[Urn,Urn]=[{red:tutorialStep===0?3:2,blue:2},{red:1,blue:1}];
 if(tutorialStep===3&&demoChoice!==null)urns[demoChoice].blue--;
 return urns;
}
function tutorial(): string {
 const review=tutorialStep===1||tutorialStep===3;
 const cardUrns:[Urn,Urn]=tutorialStep<=1?[{red:3,blue:2},{red:1,blue:1}]:[{red:2,blue:2},{red:1,blue:1}];
 const text=tutorialStep===0?demoChoice===1?'En la urna 2, la mitad es roja; en la urna 1, más de la mitad. Elegí la urna 1.':demoChoice===0?'Elegiste la urna 1: 3 de sus 5 fichas son rojas. Sacá una ficha para ver qué cambia.':'Buscá una roja. Compará las rojas con el total: urna 1, 3 de 5; urna 2, 1 de 2. ¿En cuál ocupan una parte mayor?':tutorialStep===1?'Sacamos una roja de la urna 1 y quedó afuera: ahora hay dos rojas de cuatro fichas. Hay que volver a contar.':tutorialStep===2?'Ahora ambas tienen la mitad roja: 2 de 4 y 1 de 2. Las dos ofrecen la misma posibilidad; elegí cualquiera.':'Salió azul, pero elegiste bien: ambas urnas daban la misma posibilidad. Una buena decisión no garantiza el color buscado.';
 const ready=review||tutorialStep===0&&demoChoice===0||tutorialStep===2&&demoChoice!==null;
 const visible=demoCardsVisible||review;
 return `<main class="table-layout tutorial-table"><section class="table-heading"><p class="eyebrow">Mesa I · Vera te acompaña</p><h1>Las urnas</h1><p class="round-context">Demostración preparada · ${tutorialStep+1} de 4 · sin puntos</p></section><aside class="game-panel"><div class="objective-label">${tutorialStep<2?'Primera extracción':'Segunda extracción'}</div><h2 class="objective">Buscá una ficha <span class="red-token">roja ▲</span></h2><p class="rule-tag">↗ La ficha queda afuera</p><div class="tutorial-coach" role="status"><strong>Vera</strong><p>${text}</p></div>${review?`<p class="review-label">Antes de sacar · compará tu elección</p>`:`<button class="cards-toggle" data-testid="toggle-cards" aria-expanded="${visible}" aria-controls="demo-cards">${visible?'Ocultar tarjetas':'Ver tarjetas de las urnas'}</button>`}<div id="demo-cards" class="urn-options" ${visible?'':'hidden'}>${urnChoice(cardUrns[0],0,true)}${urnChoice(cardUrns[1],1,true)}</div>${review?`<section class="result-card"><span class="result-token ${tutorialStep===1?'red':'blue'}-token" aria-hidden="true">${tutorialStep===1?'▲':'●'}</span><h2>${tutorialStep===1?'Salió una roja.':'Salió una azul.'}</h2><p>Resultado preparado para aprender. No cambia tu partida.</p></section>`:''}${tutorialStep===3?`<details class="tutorial-recap"><summary>Volver a leer el tutorial</summary>${tutorialSummary}</details>`:''}${btn('tutorial-next',review?tutorialStep===1?'Volver a decidir':'Empezar partida al azar':demoChoice===null?'Elegí una urna para continuar':`Sacar una ficha de la urna ${demoChoice===0?'1':'2'}`,'primary full',!ready)}${!review?btn('skip-tutorial','Saltar tutorial y jugar','text-button full'):''}</aside></main>`;
}
function urnChoice(urn: Urn, index: 0 | 1, demo=false): string {
  const event=demo?'red':state.event;
  const p = probability(urn, event);
  const percent = p.denominator === 0 ? '0' : new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 }).format(100 * p.numerator / p.denominator);
  const choosing = demo?(tutorialStep===0||tutorialStep===2):state.phase === 'choose' || state.phase === 'guided';
  const hinted = !demo && choosing && state.assisted && bestChoices(state).includes(index);
  const reviewing = demo?(tutorialStep===1||tutorialStep===3):state.phase === 'revealed' && state.last !== null;
  const picked = demo?demoChoice===index:choosing ? selected === index : reviewing && state.last!.urn === index;
  const correct = reviewing && (demo?tutorialStep===3||index===0:state.last!.optimal.includes(index));
  const verdict = reviewing ? correct ? '✓ Correcta' : '✕ Menos posibilidades' : hinted ? 'Elegí esta' : picked ? '✓ Elegida' : 'Elegir';
  const colorPlural = event === 'red' ? 'rojas' : 'azules';
  return `<button data-testid="${demo?'demo-urn-':'urn-'}${index}" class="urn-option ${picked ? 'selected' : ''} ${hinted ? 'hinted' : ''} ${reviewing ? correct ? 'answer-correct' : 'answer-incorrect' : ''}" aria-pressed="${picked}" ${!choosing ? 'disabled' : ''}><span class="urn-option-head"><strong>Urna ${index === 0 ? '1' : '2'}</strong><span>${verdict}</span></span>${reviewing&&picked ? '<span class="choice-caption">Tu elección</span>' : ''}<span class="inventory"><span class="red-token">▲</span> ${urn.red} ${urn.red === 1 ? 'roja' : 'rojas'} <span class="blue-token">●</span> ${urn.blue} ${urn.blue === 1 ? 'azul' : 'azules'}</span><span class="odds"><b>${p.numerator} de ${p.denominator} fichas ${p.numerator === 1 ? 'es' : 'son'} ${p.numerator === 1 ? colorName(event) : colorPlural}</b><span>${!demo && state.round === 3 && !state.assisted && !helpOpen && !reviewing ? 'Compará cuánto hay del color que buscás' : `${percent} % de posibilidades de sacar ${colorName(event)}`}</span></span></button>`;
}
function urnCards(): string {
  const reviewing = state.phase === 'revealed';
  const urns = structuredClone(state.urns);
  if (reviewing && state.last && !state.replacement) urns[state.last.urn][state.last.color]++;
  const visible = cardsVisible || reviewing;
  return `${reviewing ? '<p class="review-label">Antes de sacar · tu elección</p>' : `<button data-testid="toggle-cards" class="cards-toggle" aria-expanded="${visible}" aria-controls="urn-cards" ${reviewing ? 'disabled' : ''}>${visible ? 'Ocultar tarjetas' : 'Ver tarjetas de las urnas'}</button>`}<div id="urn-cards" class="urn-options" ${visible ? '' : 'hidden'}>${urnChoice(urns[0],0)}${urnChoice(urns[1],1)}</div>`;
}
function feedback(): string {
  const last = state.last;
  if (!last) return '';
  const success = last.color === state.event;
  const p = last.beforeProbability;

  const outcome = `Salió una ficha ${colorName(last.color)} ${symbol(last.color)}.`;
  const judgment = last.correct ? '¡Elegiste bien!' : 'Había una opción mejor.';
  const why = last.correct ? (last.optimal.length === 2 ? 'Las dos urnas daban las mismas posibilidades. Cualquiera servía.' : success ? 'Elegiste la urna con más posibilidades y salió el color que buscabas.' : 'Elegiste la urna con más posibilidades. Esta vez salió otro color: eso puede pasar aunque elijas bien.') : (success ? 'Salió el color que buscabas, pero la otra urna daba más posibilidades. Esta vez tuviste suerte.' : 'La otra urna daba más posibilidades de sacar el color que buscabas. Mirá la tarjeta verde para comparar.');
  return `<section class="result-card ${last.correct ? 'choice-right' : 'choice-wrong'}" data-testid="result-feedback"><span class="result-token ${last.color}-token" aria-hidden="true">${symbol(last.color)}</span><h2>${outcome}</h2><p class="decision-verdict">${judgment} ${state.assisted ? 'Práctica con ayuda.' : last.correct ? '+1 punto.' : '+0 puntos.'}</p><p>${why}</p>${!last.correct?reviewButton('urns'):''}<details class="result-details"><summary>Qué cambió en la urna</summary><p class="small-note">Tu urna tenía ${p.numerator} ${p.numerator === 1 ? 'ficha' : 'fichas'} del color buscado entre ${p.denominator} en total. ${state.replacement ? 'Devolvimos la ficha: las cantidades no cambian.' : 'La ficha quedó afuera. Las urnas ya muestran lo que queda.'}</p></details></section>`;
}
function table(): string {
  const choosing = state.phase === 'choose' || state.phase === 'guided';
  const isSummary = state.phase === 'roundEnd';
  const title = state.assisted ? `Práctica guiada ${state.round + 1}/2` : chapterNames[state.round];
  return `<main class="table-layout"><section class="table-heading"><p class="eyebrow">Mesa I · Vera, la inventarista</p><h1>Las urnas</h1><p class="round-context" data-testid="round-label">${state.assisted ? title : `Ronda ${state.round + 1} de 4 · ${title}`}</p>${badges()}</section><aside class="game-panel"><div class="round-progress" aria-label="${state.assisted ? 'Práctica guiada' : `Ronda ${state.round + 1} de cuatro`}">${[0,1,2,3].map(i => `<span class="${i <= state.round ? 'filled' : ''}"></span>`).join('')}</div><div class="objective-label">${state.assisted ? 'Demostración preparada · con ayuda' : `Extracción ${state.step + 1} de 2`}</div><h2 class="objective">Buscá una ficha <span class="${state.event}-token">${colorName(state.event)} ${symbol(state.event)}</span></h2><p class="rule-tag">${state.replacement ? '↻ La ficha vuelve' : '↗ La ficha queda afuera'} <span>${state.replacement ? 'Cada ficha vuelve a la urna.' : 'La ficha extraída queda afuera.'}</span></p>${choosing ? `<p class="decision-prompt">${state.step === 0 ? '¿Qué urna te da más posibilidades? Tocá una urna o mostrá sus tarjetas.' : state.replacement ? 'Devolvimos la ficha. Las cantidades siguen iguales: elegí otra vez.' : 'Hay una ficha menos. Mirá lo que queda y elegí otra vez.'}</p>${urnCards()}${btn('confirm-choice', selected === null ? 'Elegí una urna para continuar' : `Sacar una ficha de la urna ${selected === 0 ? '1' : '2'}`, 'primary full', selected === null)}<p class="small-note">${state.assisted ? 'La ayuda resalta una elección válida. Completá cuatro acciones para continuar.' : 'Ganás un punto por elegir bien, aunque salga otro color.'}</p>` : `${isSummary ? `<section class="round-summary"><span class="summary-mark" aria-hidden="true">✧</span><h2>Una ronda más clara.</h2><p>${state.assisted ? 'Terminaste este escenario preparado.' : state.round === 3 ? state.merit >= 6 ? 'Tus decisiones alcanzaron el sello de Vera.' : 'Te falta un poco de práctica. Vera preparó dos escenarios cortos para ayudarte.' : 'La próxima ronda empieza con fichas nuevas. Podés usar lo que aprendiste.'}</p>${badges()}${!state.assisted&&state.round===3&&state.merit<6?reviewButton('urns'):''}</section>` : urnCards() + feedback()}${btn('next-step', isSummary ? state.round === 3 || (state.assisted && state.round === 1) ? 'Ver mi resultado' : 'Siguiente ronda' : state.step === 0 ? 'Volver a decidir' : 'Cerrar la ronda', 'primary full')}`}${helpOpen ? `<div class="help-note"><strong>La cuenta de Vera</strong><p>Contá las fichas del color que buscás y todas las fichas de la urna. Por ejemplo: 3 rojas entre 5 fichas significa 3 de 5. Elegí la urna donde ese color ocupe una parte mayor. Si la parte es igual en ambas, las dos sirven. ${state.replacement ? 'Si devolvés la ficha, las cantidades no cambian.' : 'Si la ficha queda afuera, contá sólo las que quedan.'}</p></div>` : ''}<details class="panel-tools" data-keep-open="urn-tools"><summary>Ayuda y opciones</summary><div class="panel-footer">${btn('help-button', helpOpen ? 'Cerrar ayuda' : '¿Cómo comparo?', 'text-button')}${btn('repeat-tutorial','Repetir demostración','text-button')}${btn('back-room', 'Volver a la sala', 'text-button')}</div></details></aside><div class="table-bottom-note"><span class="speaker-dot"></span> Vera <span>«Una ficha no sabe nada de tus méritos».</span></div></main>`;
}
function complete(): string {
  return `<main class="completion-layout" data-testid="completion"><section class="completion-card"><div class="seal" aria-hidden="true">✧</div><p class="eyebrow">Mesa I completada</p><h1>Vera firma<br>tu inventario.</h1><p class="completion-quote">«El azar hizo su trabajo.<br>Ahora vos también sabés hacer el tuyo».</p>${badges()}<p>${state.assisted ? 'Completaste la práctica guiada. Tu sello indica «con ayuda»; podés volver a intentarlo para practicar sin pistas.' : 'Lograste el sello con tus decisiones. Incluso una buena elección puede tener un resultado desfavorable.'}</p><div class="learning-summary"><span>Práctica: comparar proporciones</span><span>Práctica: actualizar después de observar</span><span>Práctica: separar el plan de la suerte</span></div><p class="small-note">Este sello registra tus decisiones, no certifica dominio. Doble ya abrió su correduría: el próximo encargo usa dados y contratos.</p>${btn('enter-contracts', 'Llevar el sello a Doble', 'primary full')}${btn('practice-again', 'Volver a practicar urnas · conservar sellos', 'text-button full')}${btn('back-room', 'Explorar la sala', 'text-button full')}</section></main>`;
}
function dobleScreen(): string {
  const c = state.contracts;
  if (!c) return room();
  return c.phase === 'tutorial' ? contractsTutorial(c, dobleTutorialStep) : c.phase === 'complete' ? contractsComplete(c) : contractsView(c, selectedContract, comparisonResult, rehearsalPair, diceRolling, diceCombinationsVisible);
}
function render(focusId?: string): void {
  // Preserve the one WebGL canvas when replacing the surrounding HTML.
  const canvas=document.querySelector<HTMLCanvasElement>('#scene');
  if(canvas&&app.contains(canvas))document.body.prepend(canvas);
  const expanded = [...app.querySelectorAll<HTMLDetailsElement>('details[data-keep-open][open]')].map(el => el.dataset.keepOpen);
  document.body.dataset.screen = screen;
  document.documentElement.style.setProperty('--street-progress',String(state.streetPosition??0));
  document.body.dataset.cameraMode=cameraController.mode;
  document.documentElement.style.setProperty('--room-pan',String(cameraController.position.x*-1.2)+'%');
  document.body.dataset.doblePhase = state.contracts?.phase ?? 'tutorial';
  document.body.dataset.introPhase = introPhase;
  document.body.dataset.speaker = screen === 'intro' && introLine === 2 ? 'vera' : 'captor';
  app.innerHTML = header() + ({ menu, intro: introView, room, tutorial, table, complete, contracts: dobleScreen, records:()=>state.records?recordsView(state.records,selectedRecord):room(), finale:()=>state.finale?endingView(state.finale,selectedFinale,state.freed===true):room(), outside:outsideView, street:streetView }[screen])() +
    (warning ? `<div class="save-warning" role="status">${escapeText(warning)}</div>` : '') +
    (sceneWarning ? `<div class="graphics-warning">${sceneWarning} ${btn('retry-graphics','Reintentar 3D','quiet')}</div>` : '');
  for(const name of expanded) app.querySelector<HTMLDetailsElement>(`details[data-keep-open="${name}"]`)?.setAttribute('open','');
  updateVisual();
  if (focusId) document.querySelector<HTMLButtonElement>(`[data-testid="${focusId}"]`)?.focus({preventScroll:true});
}
function updateVisual(): void {
  const canvas=document.querySelector<HTMLCanvasElement>('#scene');
  const viewport=app.querySelector<HTMLElement>('.dice-viewport,.ada-viewport');
  if(canvas&&viewport){viewport.append(canvas);scene?.resizeCanvas();}
  else scene?.resizeCanvas();
  const playingAda=screen==='records'&&!!app.querySelector('.ada-viewport');
  scene?.setRendering(playingAda||screen==='table'||screen==='tutorial'||screen==='contracts'&&state.contracts?.phase!=='tutorial'&&state.contracts?.phase!=='complete');
  const playingContracts = screen === 'contracts' && state.contracts?.phase !== 'complete';
  scene?.setContractMode(playingContracts||playingAda, playingContracts ? state.contracts?.pair ?? null : null,playingAda?'ada':'doble');
  if (playingContracts||screen==='records'||screen==='finale'||screen==='outside') return;
  const urns: Urn[] = screen === 'tutorial' ? demoInventory() : state.urns;
  scene?.updateUrns(urns, screen==='tutorial'?demoChoice:screen === 'table' && state.phase === 'revealed' ? state.last?.urn ?? null : selected, screen === 'tutorial' ? tutorialStep===1?'red':tutorialStep===3?'blue':undefined : state.phase === 'revealed' ? state.last?.color : undefined);
}
function selectDemo(index:0|1):void {
 if(screen!=='tutorial'||![0,2].includes(tutorialStep))return;
 demoChoice=index;demoCardsVisible=true;
 if(tutorialStep===0&&tutorialFlow.phase==='predict'||tutorialStep===2&&tutorialFlow.phase==='explain')tutorialFlow=advanceTutorial(tutorialFlow);
 render('demo-urn-'+index);
}
function commitSelection(index: 0 | 1): void {
  if(screen==='tutorial'){selectDemo(index);return;}
  if (screen !== 'table' || !['choose','guided'].includes(state.phase)) return;
  selected = index; cardsVisible = true; render(`urn-${index}`);
}
function startNew(preserveCampaign = false): void {
  const prior = state;
  state = createGame();
  if(preserveCampaign) {
    state.urnVariant='repeat';
    state.seals = { ...prior.seals, urns: prior.seals?.urns === true || prior.phase === 'complete', contracts: prior.seals?.contracts === true };
    if(prior.contracts) state.contracts = prior.contracts;
    if(prior.intro)state.intro=prior.intro;
    if(prior.records)state.records=prior.records;if(prior.finale)state.finale=prior.finale;if(prior.freed!==undefined)state.freed=prior.freed;if(prior.freedomMethod)state.freedomMethod=prior.freedomMethod;
    state.activeTable = 'urns';
  } else state.intro=createDialogue(INTRO); state.settings = structuredClone(settings); persist(); introLine = 0;
  if(preserveCampaign) { setScreen('table','urn-0'); return; }
  beginIntro(); setScreen('intro', 'skip-intro');
}
function enterTable(): void {
  state.activeTable = 'urns'; persist();
  if (state.phase === 'complete') { setScreen('complete', 'practice-again'); return; }
  if (!state.history.length) { tutorialStep = 0; tutorialFlow=createTutorial(); demoChoice = null;demoCardsVisible=false; setScreen('tutorial', 'toggle-cards'); }
  else setScreen('table', state.phase === 'revealed' || state.phase === 'roundEnd' ? 'next-step' : 'toggle-cards');
}
function finishIntro(skip:boolean):void{
 state.intro??=createDialogue(INTRO);state.intro=applyDialogue(INTRO,state.intro,{id:'intro-'+state.intro.revision,revision:state.intro.revision,type:skip?'skip':'next'});persist();setScreen('room','enter-urns');
}
function roomWalk():string {
 const p=cameraController.position,near=nearbyTable(p);
 return `<details class="room-walk" data-keep-open="room-walk"><summary>Recorrer la sala</summary><p>Movete con ${shortcutName(settings.keys.forward)}, ${shortcutName(settings.keys.backward)}, ${shortcutName(settings.keys.left)} y ${shortcutName(settings.keys.right)}. ${shortcutName(settings.keys.interact)} para acercarte a la mesa indicada. También podés usar la lista.</p><div class="room-map" aria-label="Plano de sala">${ROOM_TABLES.map(t=>`<span style="left:${(t.x+3)/6*100}%;top:${(t.z+3)/6*100}%">${t.name}</span>`).join('')}<b class="room-player" style="left:${(p.x+3)/6*100}%;top:${(p.z+3)/6*100}%" aria-label="Tu posición">◆</b></div><p role="status">${near?`Cerca de ${near.name}. ${tableUnlocked(state,near.id)?'Podés entrar.':'Falta el sello indicado en la lista.'}`:'Acercate a una mesa o elegila en la lista.'}</p><div class="walk-buttons">${(['forward','left','backward','right','interact'] as const).map(a=>btn('walk-'+a,({forward:'↑ Avanzar',backward:'↓ Retroceder',left:'← Izquierda',right:'→ Derecha',interact:'Entrar'})[a],'quiet')).join('')}</div></details>`;
}
function moveRoom(action:InputAction):void {
 if(screen!=='room'||overlay.querySelector('dialog[open]'))return;
 if(action==='interact'){const t=nearbyTable(cameraController.position);if(t&&tableUnlocked(state,t.id)){document.querySelector<HTMLButtonElement>('[data-testid=enter-'+t.id+']')?.click();}else announce('Acercate a una mesa disponible o usá la lista.');return;}
 const [dx,dz]=action==='left'?[-.5,0]:action==='right'?[.5,0]:action==='forward'?[0,-.5]:[0,.5];
 cameraController.move(dx!,dz!);state.roomPosition={...cameraController.position};persist();render('walk-'+action);
}
function streetScenery(dawn:boolean):string {
 return `<div class="street-set ${dawn?'street-dawn':''}" aria-hidden="true"><div class="street-houses"></div><div class="street-lamp">✧</div><div class="street-road"></div></div>`;
}
function streetView():string {
 const position=state.streetPosition??0;
 return `<main class="street-layout">${streetScenery(false)}<section class="dialogue-card"><p class="eyebrow">Un recuerdo · un momento antes</p><h1>${position<8?'Sólo faltaba una cuadra.':'Un paso detrás. Después, oscuridad.'}</h1><p>${position<8?'Una calle tranquila. La lámpara titila. Podés avanzar unos pasos; alguien camina detrás de vos.':'No hubo una pelea. Un roce de cartas, la luz se apaga y despertás en la casa. El recuerdo termina acá.'}</p><p>Camino ${position} de 8 · ${shortcutName(settings.keys.forward)} para avanzar</p>${btn('street-forward','Dar un paso','primary',position>=8)}${btn('street-return',position>=8?'Volver al despertar':'Saltar el recuerdo','quiet')}</section></main>`;
}
function outsideView():string {
 return `<main class="outside-layout">${streetScenery(true)}<section class="completion-card"><p class="eyebrow">La calle · amanecer</p><h1>Esta vez, vos elegís.</h1><p>La puerta se cierra a tus espaldas. Llevás tres sellos, un contrato cumplido y una idea: una buena decisión no necesita que la suerte le dé la razón.</p><p>Tu libertad queda guardada. Podés visitar las mesas otra vez sin perderla.</p>${btn('back-room','Volver a practicar en la casa','primary full')}</section></main>`;
}
function enterRecords():void {
 if(!tableUnlocked(state,'records'))return;
 state.records??=createRecords();state.activeTable='records';persist();setScreen('records',state.records.phase==='tutorial'?state.records.experience?.startsWith('photos-')&&state.records.diagnostic===null?'records-diagnostic-yes':'records-begin':state.records.phase==='feedback'?'records-next':state.records.phase==='complete'?'enter-finale':'records-'+recordsChoices(state.records)[0]);
}
function enterFinale():void {
 if(!tableUnlocked(state,'finale'))return;
 state.finale??=createFinale();state.activeTable='finale';persist();setScreen('finale',state.finale.phase==='complete'?'exit-house':state.finale.phase==='feedback'?'finale-next':'finale-'+finaleChoices(state.finale)[0]);
}
function handleCampaignClick(target:HTMLElement):boolean {
 const id=target.dataset.testid;
 if(id==='exit-house'&&state.freed){state.activeTable='outside';persist();setScreen('outside','back-room');return true;}
 if(id==='transfer-a'||id==='transfer-b'){const el=app.querySelector('[data-testid="transfer-feedback"]');if(el)el.textContent=id==='transfer-a'?'✓ 4 de 5 es 80 %, más que 2 de 4 (50 %).':'Revisá: 4 de 5 es 80 % y 2 de 4 es 50 %.';return true;}
 if(id==='transfer-safe'||id==='transfer-risk'){const el=app.querySelector('[data-testid="transfer-risk-feedback"]');if(el)el.textContent=id==='transfer-safe'?'✓ El pago fijo garantiza al menos 1.':'Un promedio de 3 puede incluir pérdidas. Para una garantía, elegí el pago fijo.';return true;}
 if((id==='records-replay'||id==='records-upgrade')&&state.records){state.records=createRecords(Date.now(),true);persist();selectedRecord=null;setScreen('records','records-diagnostic-yes');return true;}
 if(id==='finale-replay'&&state.finale){state.finale=createFinale();persist();setScreen('finale','finale-U');return true;}
 if(screen==='records'&&state.records){
   const current=state.records;
   if(id==='records-diagnostic-yes'||id==='records-diagnostic-no'){
     const next=applyRecordsCommand(current,{type:'diagnose',choice:id.endsWith('yes')?'yes':'no',expectedRevision:Number(target.dataset.revision),commandId:'ada-diagnostic-'+target.dataset.revision});
     if(next!==current){state.records=next;persist();render('records-begin');}return true;
   }
   if(id?.startsWith('records-')&&current.phase==='choose'&&recordsChoices(current).includes(id.slice(8) as RecordsChoice)){selectedRecord=id.slice(8) as RecordsChoice;render(id);return true;}
   if(['records-begin','records-confirm','records-next'].includes(id??'')){
     const command:RecordsCommand={type:id==='records-begin'?'begin':id==='records-confirm'?'choose':'next',...(selectedRecord?{choice:selectedRecord}:{}),expectedRevision:Number(target.dataset.revision),commandId:'ada-'+target.dataset.revision+'-'+id};
     const next=applyRecordsCommand(current,command);if(next===current){announce('Seguí la opción indicada por la ayuda.');return true;}
     state.records=next;selectedRecord=null;persist();render(next.phase==='feedback'?'records-next':next.phase==='complete'?'enter-finale':'records-'+recordsChoices(next)[0]);if(current.phase==='tutorial'||next.phase==='choose'||next.phase==='complete')window.scrollTo({top:0,behavior:'instant'});chime(next.history.at(-1)?.correct);return true;
   }
 }
 if(screen==='finale'&&state.finale){
   const current=state.finale;
   if(id?.startsWith('finale-')&&current.phase==='choose'&&finaleChoices(current).includes(id.slice(7) as FinaleChoice)){selectedFinale=id.slice(7) as FinaleChoice;render(id);return true;}
   if(id==='finale-confirm'||id==='finale-next'){
     const command:FinaleCommand={type:id==='finale-confirm'?'choose':'next',...(selectedFinale?{choice:selectedFinale}:{}),expectedRevision:Number(target.dataset.revision),commandId:'host-'+target.dataset.revision+'-'+id};
     const next=applyFinaleCommand(current,command);if(next===current){announce('Revisá los datos e intentá otra respuesta.');return true;}
     state.finale=next;selectedFinale=null;persist();render(next.phase==='feedback'?'finale-next':next.phase==='complete'?'exit-house':'finale-'+finaleChoices(next)[0]);if(next.phase==='choose'||next.phase==='complete')window.scrollTo({top:0,behavior:'instant'});chime(next.history.at(-1)?.correct);return true;
   }
 }
 return false;
}
window.addEventListener('storage',event=>{if(event.key==='thegame.save.v1.current'&&event.newValue!==event.oldValue){storageConflict=true;warning='Otra pestaña cambió el progreso. Esta partida sigue en memoria. Recargá para cargar el guardado más reciente.';render();}});
function showDialog(title: string, content: string, kind=''): HTMLDialogElement {
  const previous = document.activeElement as HTMLElement | null;
  overlay.innerHTML = `<dialog class="modal ${kind}" aria-labelledby="modal-title"><div class="modal-heading"><h2 id="modal-title">${title}</h2>${btn('close-dialog', 'Cerrar <span aria-hidden="true">×</span>', 'quiet modal-close')}</div><div class="modal-body">${content}</div></dialog>`;
  const dialog = overlay.querySelector('dialog')!;
  dialog.addEventListener('close', () => {
    // A closed dialog may already have been replaced by another one (reset/confirmation).
    if (!dialog.isConnected) return;
    const restore=document.activeElement===document.body||dialog.contains(document.activeElement);
    dialog.remove(); if(restore)previous?.focus({preventScroll:true});
  });
  dialog.showModal(); return dialog;
}
function showSettings(): void {
  showDialog('Ajustes', `<p class="settings-intro">Los cambios se guardan al instante.</p><div class="settings-tabs" role="tablist" aria-label="Tipo de ajuste">${[['display','Pantalla'],['sound','Sonido'],['controls','Controles']].map(([id,label],i)=>`<button role="tab" id="settings-tab-${id}" aria-selected="${i===0}" aria-controls="settings-${id}" data-settings-tab="${id}">${label}</button>`).join('')}</div><section id="settings-display" role="tabpanel" aria-labelledby="settings-tab-display"><label class="setting-row"><span>Tamaño de texto<small>Incluye explicaciones y subtítulos.</small></span><select data-testid="text-scale">${[1,1.25,1.5,2].map(n=>`<option value="${n}" ${settings.textScale===n?'selected':''}>${n*100} %</option>`).join('')}</select></label><label class="setting-row"><span>Reducir movimiento<small>Sin movimientos de cámara ni animaciones de reposo.</small></span><input type="checkbox" data-testid="reduced-motion" ${settings.reducedMotion?'checked':''}></label><p class="small-note">No hay límite de tiempo para elegir.</p></section><section id="settings-sound" role="tabpanel" aria-labelledby="settings-tab-sound" hidden><label class="setting-row"><span>Volumen<small>En cero, el juego queda en silencio.</small></span><input data-testid="volume" type="range" min="0" max="1" step="0.05" value="${settings.volume}" aria-label="Volumen"></label><p>Las instrucciones también se pueden leer.</p></section><section id="settings-controls" role="tabpanel" aria-labelledby="settings-tab-controls" hidden><p class="small-note">Tab recorre opciones; Enter confirma y Escape pausa.</p>${[['forward','Avanzar',settings.keys.forward],['backward','Retroceder',settings.keys.backward],['urn-u','Urna 1 / oferta anterior',settings.keys.left],['urn-v','Urna 2 / oferta siguiente',settings.keys.right],['confirm','Confirmar',settings.keys.interact]].map(([id,label,value])=>`<label class="setting-row"><span>${label}</span>${shortcutSelect('bind-'+id,value!)}</label>`).join('')}<p data-testid="binding-warning" class="small-note" role="status"></p></section><div class="settings-actions">${btn('restore-settings','Restaurar ajustes','secondary')}${btn('delete-save','Borrar progreso…','text-button')}</div>`, 'settings-modal');
}

function enterContracts(): void {
  if(!urnsSealed()) return;
  if(!state.contracts) state.contracts = createContracts();
  state.activeTable = 'contracts'; persist();
  setScreen('contracts', state.contracts.phase === 'tutorial' ? 'doble-tutorial-next' : state.contracts.phase === 'offer' || state.contracts.phase === 'order' ? 'contract-S' : state.contracts.phase === 'complete' ? 'back-room' : 'doble-next');
}
function revealFeedback(selector: string): void {
  if(settings.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  app.querySelector(selector)?.animate([{opacity:.65,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'cubic-bezier(0.23,1,0.32,1)'});
}
function commandDoble(type: ContractCommand['type'], revision: number, pointerFeedback = false): void {
  if(screen !== 'contracts' || !state.contracts) return;
  if(diceRolling)return;
  const command: ContractCommand = { type, expectedRevision: revision, commandId: `doble-${revision}-${type}` };
  if(type === 'sign' && selectedContract) command.contract = selectedContract;
  const next = applyContractCommand(state.contracts, command);
  if(next === state.contracts) { announce('Elegí el contrato indicado por la ayuda o revisá el encargo actual.'); return; }
  const throwsDice=type==='sign'&&state.contracts.phase==='offer'&&next.phase==='result';
  diceRolling=throwsDice&&!settings.reducedMotion&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
  state.contracts = next; selectedContract = null; persist();
  if(!diceRolling)chime(next.history.at(-1)?.correct ?? true);
  render(next.phase === 'offer' || next.phase === 'order' ? 'contract-S' : next.phase === 'complete' ? 'back-room' : 'doble-next');
  if(type==='begin'||next.phase==='offer'||next.phase==='complete')window.scrollTo({top:0,behavior:'instant'});
  if(diceRolling){scene?.rollDice();diceRollTimer=setTimeout(finishDiceRoll,900);}
  if(throwsDice)app.querySelector('.dice-table')?.scrollIntoView({block:'center',behavior:'instant'});
  if(pointerFeedback && next.phase === 'result'&&!throwsDice) revealFeedback('.dice-table-caption');
  announce(diceRolling?'Tirando los dados…':next.phase === 'result' ? `Dados ${next.pair![0]} y ${next.pair![1]}. Suma ${next.pair![0]+next.pair![1]}. Saldo ${next.balance}.` : next.phase === 'order' ? 'Nuevo encargo hipotético. Sin otra tirada.' : next.phase === 'complete' ? 'Sello de Doble obtenido.' : 'Encargo actualizado.');
}
function finishDiceRoll():void {
  clearTimeout(diceRollTimer);diceRolling=false;scene?.stopDiceRoll();
  if(screen!=='contracts'||state.contracts?.phase!=='result')return;
  chime(state.contracts.history.at(-1)?.correct??true);
  render(overlay.querySelector('dialog[open]')?undefined:'doble-next');
  const pair=state.contracts.pair!;
  announce(`Dados ${pair[0]} y ${pair[1]}. Suma ${pair[0]+pair[1]}. Saldo ${state.contracts.balance}.`);
}
app.addEventListener('click', event => {
  const target = (event.target as HTMLElement).closest<HTMLElement>('button, [data-action]');
  if (!target) return;
  const id = target.dataset.testid;
  if(target.dataset.review){showDialog('Repasar conceptos',learningReview(target.dataset.review as LearningTopic),'learning-modal');return;}

  if(id === 'enter-records') {enterRecords();return;}
  if(id === 'enter-finale') {enterFinale();return;}
  if(handleCampaignClick(target))return;
  if(id === 'enter-contracts') { enterContracts(); return; }
  if(screen === 'contracts' && state.contracts) {
    if(id==='toggle-dice-combinations'){diceCombinationsVisible=!diceCombinationsVisible;render('toggle-dice-combinations');return;}
    if(id === 'rehearse-die-0' || id === 'rehearse-die-1') {
      const die = id === 'rehearse-die-0' ? 0 : 1;
      rehearsalPair[die] = rehearsalPair[die] % 6 + 1; render(id);
      announce(`Ensayo: ${rehearsalPair[0]} y ${rehearsalPair[1]}. No cambia la partida.`); return;
    }
    if(id?.startsWith('contract-') && CONTRACT_IDS.includes(id.slice(9) as ContractId) && ['offer','order'].includes(state.contracts.phase)) {
      selectedContract = id.slice(9) as ContractId; render(id); return;
    }
    if(id === 'doble-tutorial-next' && state.contracts.phase === 'tutorial' && dobleTutorialStep < 2) { dobleTutorialStep++; render(id); return; }
    if(id === 'doble-begin' || id === 'doble-tutorial-next') { commandDoble('begin',Number(target.dataset.revision)); return; }
    if(id === 'doble-sign' || id === 'doble-next') { commandDoble(id === 'doble-sign' ? 'sign' : 'next',Number(target.dataset.revision),event.detail > 0); return; }
    if(id === 'doble-replay') { state.contracts = createContracts(Date.now(), 'repeat'); dobleTutorialStep = 0; comparisonResult = null; persist(); render('doble-tutorial-next'); return; }
    if(id === 'simulate-1' || id === 'simulate-100') {
      const seed = Number(document.querySelector<HTMLInputElement>('#simulation-seed')?.value);
      try { comparisonResult = compareContracts(seed,id === 'simulate-1' ? 1 : 100); render(id); announce('Comparación terminada. La campaña no cambió.'); }
      catch { announce('Usá una semilla entera entre 1 y 4294967295.'); document.querySelector<HTMLInputElement>('#simulation-seed')?.reportValidity(); }
      return;
    }
  }
  if(id==='intro-history'){showDialog('Lo que dijeron',`<p class="conversation-lead">Podés volver a leer lo que escuchaste hasta ahora.</p><ol class="conversation-list">${intro.slice(0,introLine+1).map(([speaker,line],i)=>`<li><article class="conversation-entry"><header><span class="speaker-emblem" aria-hidden="true">${speaker==='Vera'?'V':'A'}</span><h3>${escapeText(speaker)}</h3><span class="conversation-order">${i+1} de ${introLine+1}</span></header><p>${escapeText(line)}</p></article></li>`).join('')}</ol>`,'conversation-modal');return;}
  if(id==='remember-street'){stopIntro();setScreen('street','street-forward');return;}
  if(id==='street-forward'){state.streetPosition=Math.min(8,(state.streetPosition??0)+1);chime();persist();render('street-forward');return;}
  if(id==='street-return'){beginIntro();setScreen('intro','skip-intro');return;}
  if(id?.startsWith('walk-')){moveRoom(id.slice(5) as InputAction);return;}
  if (id === 'retry-graphics') { void initScene(); return; }
  if (id === 'settings-button') { showSettings(); return; }
  if (target.dataset.action === 'home') { event.preventDefault(); setScreen('menu'); return; }
  if (target.dataset.action === 'credits') {
    showDialog('Un primer capítulo', `<p>La Casa del Azar es un juego sobre probabilidad y decisiones. Esta versión incluye las urnas de Vera, los contratos de Doble, las fotos tramposas de Ada y el contrato de salida del anfitrión.</p><p>Nueva dirección de animación de los años treinta: sala y personajes ilustrados con generación de imágenes. Captor adaptado de las referencias de Gambito aportadas por el usuario; Cuphead es referencia estética. Sin afiliación con Marvel ni Studio MDHR. Mesa y urnas interactivas propias. Sonidos sintetizados. Babylon.js bajo Apache 2.0. Los recursos de juego se alojan junto a esta página.</p><p>La experiencia educativa y la diversión todavía deben evaluarse con jugadores.</p><a href="https://github.com/GaryPoui/TheGame" target="_blank" rel="noopener">Documentación, código y licencias</a>`); return;
  }
  if (id === 'new-game' || id === 'practice-again') {
    if (hasSave && state.history.length && id === 'new-game') { showDialog('¿Empezar de nuevo?', `<p>La nueva partida reemplaza tu progreso actual. Podés cerrar esta ventana para conservarlo.</p>${btn('confirm-new-game','Empezar de nuevo','primary full')}`); return; }
    startNew(id === 'practice-again'); return;
  }
  if (id === 'continue-game') { if(state.intro?.ended&&!state.activeTable&&!state.history.length){setScreen('room','enter-urns');return;} if(state.intro&&!state.intro.ended&&!state.activeTable&&!state.history.length){introLine=Math.max(0,INTRO.nodes.findIndex(n=>n.id===state.intro!.node));if(introLine===0)beginIntro();else introPhase='lit';setScreen('intro','skip-intro');return;} if(state.activeTable==='outside'&&state.freed){setScreen('outside','back-room');return;} if(state.activeTable==='records'){enterRecords();return;} if(state.activeTable==='finale'){enterFinale();return;} if(state.activeTable === 'contracts' && state.contracts) { enterContracts(); return; } setScreen(state.phase === 'complete' ? 'complete' : 'table', state.phase === 'choose' || state.phase === 'guided' ? 'toggle-cards' : 'next-step'); return; }
  if (id === 'skip-intro' || (id === 'intro-next' && introLine === 2)) {finishIntro(id==='skip-intro');return;}
  if (id === 'intro-next') { stopIntro();introPhase='lit';state.intro??=createDialogue(INTRO);state.intro=applyDialogue(INTRO,state.intro,{id:'intro-'+state.intro.revision,revision:state.intro.revision,type:'next'});introLine=Math.max(0,INTRO.nodes.findIndex(n=>n.id===state.intro!.node));persist();render('intro-next');return;}
  if (id === 'enter-urns') { enterTable(); return; }
  if (id === 'demo-urn-0' || id === 'demo-urn-1') {selectDemo(id==='demo-urn-0'?0:1);return;}
  if (id === 'tutorial-next') {
    if(screen!=='tutorial'||tutorialStep===0&&demoChoice!==0||tutorialStep===2&&demoChoice===null)return;
    if(tutorialStep<3){tutorialStep++;tutorialFlow=advanceTutorial(tutorialFlow);if(tutorialStep===2){demoChoice=null;demoCardsVisible=false;}chime();render(tutorialStep===2?'toggle-cards':'tutorial-next');}
    else setScreen('table','toggle-cards');
    return;
  }
  if (id === 'skip-tutorial') { setScreen('table','toggle-cards'); return; }
  if (id === 'toggle-cards'&&screen==='tutorial'){demoCardsVisible=!demoCardsVisible;render('toggle-cards');return;}
  if (id === 'toggle-cards') { cardsVisible = !cardsVisible; render('toggle-cards'); return; }
  if (id === 'urn-0' || id === 'urn-1') { commitSelection(id === 'urn-0' ? 0 : 1); return; }
  if (id === 'confirm-choice' && selected !== null) {
    const next = choose(state,selected);
    if (next === state) { announce('La ayuda resalta una urna válida. Elegila para continuar.'); return; }
    state = next; selected = null; persist(); chime(state.last?.correct); render('next-step');
    if(event.detail > 0) revealFeedback('.result-token');
    announce(`Salió ${colorName(state.last!.color)}. ${state.last!.correct ? 'Buena decisión.' : 'Revisá las proporciones.'}`); return;
  }
  if (id === 'next-step') {
    state = advance(state); selected = null; cardsVisible = false; persist();
    if (state.phase === 'complete') setScreen('complete','practice-again');
    else render(state.phase === 'roundEnd' ? 'next-step' : 'toggle-cards'); return;
  }
  if (id === 'back-room') {const table=state.activeTable;persist();setScreen('room',table==='contracts'||table==='records'||table==='finale'?'enter-'+table:'enter-urns');return;}
  if(id==='repeat-tutorial'){tutorialStep=0;demoChoice=null;demoCardsVisible=false;tutorialFlow=createTutorial();setScreen('tutorial','toggle-cards');return;}
  if (id === 'help-button') {helpOpen=!helpOpen;if(helpOpen){tutorialFlow=requestHelp(tutorialFlow,'urns-'+state.round+'-'+state.step);state.helpHistory??=[];const id='urns-'+state.round+'-'+state.step;if(!state.helpHistory.includes(id))state.helpHistory.push(id);persist();}render('help-button');}
});
overlay.addEventListener('click', event => {
  const tab=(event.target as HTMLElement).closest<HTMLElement>('[data-settings-tab]')?.dataset.settingsTab;
  if(tab){
    overlay.querySelectorAll<HTMLElement>('[data-settings-tab]').forEach(el=>el.setAttribute('aria-selected',String(el.dataset.settingsTab===tab)));
    overlay.querySelectorAll<HTMLElement>('[role="tabpanel"]').forEach(el=>el.hidden=el.id!=='settings-'+tab);
    return;
  }
  const id = (event.target as HTMLElement).closest<HTMLElement>('button')?.dataset.testid;
  if (id === 'close-dialog' || id === 'resume-game') overlay.querySelector('dialog')?.close();
  if (id === 'confirm-new-game') { overlay.querySelector('dialog')?.close(); startNew(); }
  if (id === 'restore-settings') { settings = structuredClone(defaultSettings); applySettings(); if(hasSave)persist(); overlay.querySelector('dialog')?.close(); showSettings(); }
  if (id === 'delete-save') { overlay.querySelector('dialog')?.close(); showDialog('Borrar el progreso', `<p>Se eliminarán la partida y su copia de seguridad. Esta acción no se puede deshacer.</p>${btn('confirm-delete','Borrar el progreso','primary full')}`); }
  if (id === 'confirm-delete') { clearGame(); storageConflict=false; hasSave=false; warning=null; state=createGame(); settings=structuredClone(defaultSettings); applySettings(); overlay.querySelector('dialog')?.close(); setScreen('menu','new-game'); }
});
overlay.addEventListener('change', event => {
  const el = event.target as HTMLInputElement;
  if (el.dataset.testid === 'reduced-motion') settings.reducedMotion = el.checked;
  if (el.dataset.testid === 'text-scale') settings.textScale = Number(el.value);
  if (el.dataset.testid === 'volume') settings.volume = Number(el.value);
  const bindingMap: Record<string, InputAction> = {'bind-forward':'forward','bind-backward':'backward','bind-urn-u':'left','bind-urn-v':'right','bind-confirm':'interact'};
  const action = bindingMap[el.dataset.testid ?? ''];
  if (action) {
    const rebound=rebind(settings.keys,action,el.value);
    const message=overlay.querySelector('[data-testid="binding-warning"]');
    if(!rebound){el.value=settings.keys[action];if(message)message.textContent='Esa tecla ya está asignada. Elegí otra para evitar un conflicto.';return;}
    settings.keys=rebound;
    if (message) message.textContent = 'Atajo actualizado.';
  }
  applySettings(); if(hasSave)persist();
});
document.addEventListener('keydown', event => {
  const settingsTab=(event.target as HTMLElement).closest<HTMLButtonElement>('[data-settings-tab]');
  if(settingsTab&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
    const tabs=[...overlay.querySelectorAll<HTMLButtonElement>('[data-settings-tab]')];
    const index=event.key==='Home'?0:event.key==='End'?tabs.length-1:(tabs.indexOf(settingsTab)+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length;
    event.preventDefault();tabs[index]?.click();tabs[index]?.focus();return;
  }
  if(screen==='tutorial'&&!overlay.querySelector('dialog[open]')&&!event.repeat){if(event.code===settings.keys.left||event.code===settings.keys.right){event.preventDefault();selectDemo(event.code===settings.keys.left?0:1);return;}if(event.code===settings.keys.interact){event.preventDefault();document.querySelector<HTMLButtonElement>('[data-testid=tutorial-next]')?.click();return;}}
  if(screen==='room'&&!overlay.querySelector('dialog[open]')&&!(event.target instanceof HTMLInputElement)&&!(event.target instanceof HTMLSelectElement)){const action=actionForKey(settings.keys,event.code);if(action){event.preventDefault();moveRoom(action);return;}}
  if(screen==='street'&&!overlay.querySelector('dialog[open]')&&event.code===settings.keys.forward){event.preventDefault();document.querySelector<HTMLButtonElement>('[data-testid=street-forward]')?.click();return;}
  if(screen === 'contracts' && state.contracts && ['offer','order'].includes(state.contracts.phase) && !overlay.querySelector('dialog[open]') && !event.repeat && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLSelectElement)) {
    if(event.code === settings.keys.left || event.code === settings.keys.right) {
      event.preventDefault(); const index = selectedContract ? CONTRACT_IDS.indexOf(selectedContract) : -1;
      selectedContract = CONTRACT_IDS[(index + (event.code === settings.keys.left ? 2 : 1) + 3) % 3]!; render(`contract-${selectedContract}`); return;
    }
    if(event.code === settings.keys.interact && selectedContract) { event.preventDefault(); document.querySelector<HTMLButtonElement>('[data-testid=doble-sign]')?.click(); return; }
  }
  if (!overlay.querySelector('dialog[open]') && screen === 'table' && ['choose','guided'].includes(state.phase) && !event.repeat) {
    if (event.code === settings.keys.left) { event.preventDefault(); commitSelection(0); return; }
    if (event.code === settings.keys.right) { event.preventDefault(); commitSelection(1); return; }
    if (event.code === settings.keys.interact && selected !== null) { event.preventDefault(); document.querySelector<HTMLButtonElement>('[data-testid="confirm-choice"]')?.click(); return; }
  }
  if (event.key !== 'Escape' || overlay.querySelector('dialog[open]')) return;
  if (screen === 'menu') return;
  event.preventDefault();
  showDialog('La casa puede esperar', `<p>La partida está en pausa. Tu decisión y el azar se quedan donde estaban.</p>${btn('resume-game','Reanudar partida','primary full')}<p class="small-note">Sin tiempo límite. Tomate lo que necesites.</p>`);
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
