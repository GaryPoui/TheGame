import {urnChoiceCard} from './ui/urn-choice';
import {bossMechanic,bossNeedsFirstDie} from './core/tables/boss';
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
import './ui/quiet-desktop.css';
import './ui/game-menus.css';
import './ui/combat-polish.css';
import {settingsMenu,menuIcon,syncSettingSteps,type SettingsSection} from './ui/game-menus';
import {cleanHeadingPeriods} from './ui/headings';
import {replaceDisclosures,installInfoDialogs,showReading} from './ui/info-dialog';
import {installGameGuides,guideButton} from './ui/game-guides';
import {renderSurface} from './ui/stable-stage';
import {learningReview, reviewButton, tutorialSummary, type LearningTopic} from './ui/learning';
import {installBossTutorial} from './ui/boss-tutorial';
import {createTutorial,advanceTutorial,requestHelp} from './core/tutorial/runner';
import {GameAudio} from './platform/audio';
import {loadPreferences,savePreferences,resetPreferences} from './platform/preferences';
import {INTRO} from './content/intro';
import {createDialogue,applyDialogue} from './core/dialogue/runner';
import {CameraController} from './presentation/camera-controller';
import {nearbyTable} from './presentation/interaction';
import {actionForKey,rebind,type InputAction} from './platform/input';
import {createRecords,applyRecordsCommand,recordsChoices,type RecordsChoice,type RecordsCommand} from './core/tables/records';
import {createFinale,applyFinaleCommand,finaleChoices,type FinaleChoice,type FinaleCommand} from './core/tables/finale';
import {tableUnlocked,checkpointCampaign} from './core/campaign/progression';
import {recordsView} from './ui/records';
import {endingView} from './ui/ending';
import { tokenTray, veraCoach, decisionTrack, urnTutorialHelp } from './ui/table-experience';
import { createContracts, applyContractCommand, type ContractCommand, type ContractsState } from './core/tables/contracts';
import { CONTRACT_IDS, type ContractId } from './core/math/dice';
import { compareContracts, type ComparisonRun } from './core/math/simulation';
import { contractsTutorial, contractsView, contractsComplete,contractCombinationsGuide } from './ui/contracts';
import {dobleDuelTutorial,dobleDuelView,type DobleRollStart} from './ui/doble-duel';
import {
  createGame, choose, advance, bestChoices, probability, loadGame, saveGame, defaultSettings,
  clearGame, VERA_SEAL_TARGET, type Fraction, type GameState, type Settings, type Urn,
} from './core/game';
import './ui/boss-focus.css';
import './ui/urns-zoom.css';
import './ui/table-props.css';
import './ui/casino-finale.css';
import {escapeView,victoryCard} from './ui/victory';
import {ESCAPE_DURATION} from './presentation/escape-path';
import type { GameScene } from './presentation/scene';

declare global { interface Window { __THEGAME_READY__: boolean; __THEGAME_METRICS__?: () => unknown } }
type Screen = 'menu' | 'intro' | 'room' | 'tutorial' | 'table' | 'complete' | 'contracts' | 'records' | 'finale' | 'outside' | 'street' | 'escape';
const app = document.querySelector<HTMLDivElement>('#app')!;
const overlay = document.querySelector<HTMLDivElement>('#overlay')!;
const announcer = document.querySelector<HTMLDivElement>('#announcer')!;
const restored = loadGame();
let state: GameState = restored.state ?? createGame();
let hasSave = restored.state !== null;
let warning = restored.warning;
let screen: Screen = 'menu';
let escapeTimer:ReturnType<typeof setTimeout>|undefined;
function beginEscape():void {
 state.activeTable='outside';persist();
 if(settings.reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches||!scene){setScreen('outside','back-room');return;}
 setScreen('escape','skip-escape');escapeTimer=setTimeout(()=>{if(screen==='escape')setScreen('outside','back-room');},ESCAPE_DURATION);
}
let selected: 0 | 1 | null = null;
let cardsVisible = false;
let selectedRecord: RecordsChoice|null=null;
let adaTutorialStep=0;
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
let tutorialHelpPage = 0;
let tutorialView: 'choice' | 'help' = 'choice';
let tutorialFlow=createTutorial();
let demoChoice: 0 | 1 | null = null;
let demoCardsVisible=false;
let dobleTutorialStep = 0;
let selectedContract: ContractId | null = null;
let comparisonResult: ComparisonRun | null = null;
let rehearsalPair: [number, number] = [2, 2];
let diceRollStart: DobleRollStart | undefined;
let diceCombinationsVisible = false;
let diceRollTimer: ReturnType<typeof setTimeout> | undefined;
let scene: GameScene | null = null;
let sceneWarning = '';
window.addEventListener('blur',()=>gameAudio.suspend());
document.querySelector('#scene')?.addEventListener('webglcontextlost',event=>{event.preventDefault();sceneWarning='Se interrumpió la sala 3D. Tu progreso sigue disponible en los controles de la página.';render();});
document.querySelector('#scene')?.addEventListener('webglcontextrestored',()=>{sceneWarning='';render();});
let settings: Settings = loadPreferences(restored.state?.settings ?? defaultSettings);
let preferencesSaved=true;
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
  announce('');
  if(next !== 'intro') stopIntro();
  if(next!=='escape'){clearTimeout(escapeTimer);escapeTimer=undefined;}
  if(next!=='contracts'){clearTimeout(diceRollTimer);diceRollStart=undefined;scene?.stopDiceRoll();}
  cameraController.setMode(next==='room'?'exploration':next==='intro'?'dialogue':['table','contracts','records','finale','tutorial'].includes(next)?'table':'cinematic');
  gameAudio.setAmbience(next==='intro'||next==='room'||next==='finale'||next==='street');
  screen = next; selected = null; selectedContract = null; selectedRecord=null; selectedFinale=null; helpOpen = false; cardsVisible = false;
  scene?.setMode(next === 'menu' || next === 'intro' ? 'menu' : next === 'room' || next === 'complete' ? 'room' : 'table', settings.reducedMotion);
  render(focus);
  window.scrollTo({top:0,left:0,behavior:'instant'});
}
function header(): string {
  if(screen==='menu'||screen==='escape')return '<header class="topbar menu-topbar" aria-hidden="true"></header>';
  const contracts=state.contracts;
  const showDobleUpgrade=screen==='contracts'&&contracts&&contracts.variant!=='duel'&&contracts.phase!=='complete';
  return `<header class="topbar" aria-label="Opciones del juego">${showDobleUpgrade?btn('doble-upgrade','Jugar al duelo nuevo','quiet'):''}${btn('settings-button','Ajustes','quiet')}</header>`;
}
function badges(): string {
  return `<div class="scoreboard"><span><i aria-hidden="true">✧</i> Decisiones <strong data-testid="merit">${state.merit}/8</strong></span><span><i aria-hidden="true">◈</i> Fichas ganadas <strong data-testid="chance-tokens">${state.tokens}</strong></span></div>`;
}
function menu(): string {
  return `<main class="menu-layout game-start"><section class="menu-copy"><h1>La casa<br>del azar</h1><p class="menu-tagline">La suerte reparte y vos decidís qué hacer con ella.</p><nav class="menu-actions" aria-label="Menú principal">${hasSave?btn('continue-game',`Reanudar partida ${menuIcon('next')}`,'menu-item menu-item-main'):''}${btn('new-game',`Nueva partida ${menuIcon('next')}`,hasSave?'menu-item':'menu-item menu-item-main')}${btn('settings-button',`Opciones ${menuIcon('next')}`,'menu-item')}<button data-action="credits" class="menu-item">Créditos ${menuIcon('next')}</button></nav></section></main>`;
}

const intro = INTRO.nodes.map(n=>[n.speaker,INTRO.strings[n.lineId]!] as const);
function introView(): string {
  const [speaker, line] = intro[introLine]!;
  const dark = introPhase === 'dark';
  return `<main class="intro-layout"><p class="context-note">${dark ? 'No ves nada. Alguien baraja muy cerca.' : introPhase === 'reveal' ? 'Una carta violeta. Una sonrisa. Ya no estás solo.' : 'La lámpara se enciende. La puerta sigue cerrada.'}</p><section class="dialogue-card" aria-label="Introducción"><div class="dialogue-heading"><span class="speaker-tag"><span class="speaker-emblem" aria-hidden="true">${dark?'◇':speaker==='Vera'?'V':'A'}</span>${dark ? 'Un momento antes…' : speaker}</span><span class="dialogue-progress" aria-label="Intervención ${introLine+1} de ${intro.length}">${introLine+1} de ${intro.length}</span></div><h1>${dark ? 'Todas las luces están apagadas.' : introLine === 2 ? 'Vera lleva las cuentas.' : 'La casa te estaba esperando.'}</h1><p class="intro-line" aria-live="polite">${dark ? 'Un roce de cartas. Después, silencio.' : line}</p><nav class="dialogue-actions intro-navigation" aria-label="Navegación de la historia">${btn('intro-back', 'Atrás', 'quiet')}${btn('intro-next', introLine === intro.length - 1 ? 'Entrar a la sala' : 'Continuar', 'primary', dark)}</nav></section></main>`;
}
function room(): string {
  const entries = [
    ['urns','I','Vera','Las urnas','Contá las chances y mirá qué cambia.','Disponible'],
    ['contracts','II','Doble','El duelo de dados','Elegí tarjetas y ganale en ocho partidas.','Necesitás el sello de Vera'],
    ['records','III','Ada','Las cartas de Ada','Compará las chances de una baraja.','Necesitás el sello de Doble'],
    ['finale','IV','El anfitrión','El último duelo','Combiná urnas, dados y póker.','Necesitás los tres sellos'],
  ] as const;
  return `<main class="room-layout"><section class="room-copy"><h1>Elegí una mesa</h1><p>Tus manos están libres. ${state.freed?'La puerta también. Podés volver a practicar.':'Tres sellos y una última partida te separan de la salida.'}</p>${state.freed?btn('exit-house','Volver a la calle','primary'):''}<button class="menu-back text-button" data-action="home">${menuIcon('back')}Volver al inicio</button></section><section class="table-directory" aria-label="Mesas de la sala">${entries.map(([id,n,name,title,description,requirement])=>{
    const unlocked=tableUnlocked(state,id),sealed=id==='finale'?state.freed:id==='urns'?urnsSealed():state.seals?.[id];
    return `<button class="table-entry ${unlocked?'available':'locked'}" data-testid="enter-${id}" ${unlocked?'':'aria-disabled="true"'}><span class="table-number">${n}</span><span><small>${unlocked?sealed?'Completada · '+name:'Disponible · '+name:requirement}</small><strong>${title}</strong><span>${description}</span></span><span class="table-entry-state">${menuIcon(!unlocked?'lock':sealed?'check':'next')}</span><span class="table-entry-art" aria-hidden="true"><img src="${import.meta.env.BASE_URL}art/${id==='urns'?'vera-v3.png':id==='contracts'?'doble-v2.png':id==='records'?'ada-v1.png':'captor-v3.png'}" alt=""></span></button>`;
  }).join('')}</section></main>`;
}
function demoInventory():[Urn,Urn]{
 const urns:[Urn,Urn]=[{red:tutorialStep===0?3:2,blue:2},{red:1,blue:1}];
 if(tutorialStep===3&&demoChoice!==null)urns[demoChoice].blue--;
 return urns;
}
function tutorial(): string {
 const review=tutorialStep===1||tutorialStep===3;
 const cardUrns=demoInventory();
 const beforeUrns:[Urn,Urn]=tutorialStep<=1?[{red:3,blue:2},{red:1,blue:1}]:[{red:2,blue:2},{red:1,blue:1}];
 const text=tutorialStep===0?demoChoice===1?'La urna 2 da 50 % de sacar roja. No es imposible, pero la urna 1 da 60 %. Como 60 es mayor que 50, conviene la urna 1.':demoChoice===0?'La urna 1 es mejor: 60 % frente a 50 %. Todavía hay 40 % de sacar azul. Elegir bien mejora tus chances, pero no asegura el resultado.':'Buscá una roja. La urna 1 tiene 3 de 5: 60 %. La urna 2 tiene 1 de 2: 50 %. Mirá las cuentas y elegí la que ofrece más posibilidades.':tutorialStep===1?'Sacamos una roja de la urna 1 y quedó afuera: ahora hay dos rojas de cuatro fichas. Restamos una roja y una ficha al total: (3 − 1) ÷ (5 − 1) = 2 ÷ 4 = 50 %.':tutorialStep===2?'La urna 1 da 2 ÷ 4 = 50 % y la urna 2 da 1 ÷ 2 = 50 %. Las dos tienen la mitad roja: tener más fichas no da ventaja. Cualquiera es una buena elección.':'Salió azul, pero elegiste bien: antes de sacar, ambas daban 50 % de roja y 50 % de azul. Que salga azul no demuestra que tu decisión fuera mala.';
 const ready=review||tutorialStep===0&&demoChoice===0||tutorialStep===2&&demoChoice!==null;
 const visible=demoCardsVisible||review;
 const summary=tutorialStep===0?demoChoice===1?'Conviene la 1: 60 % frente a 50 %.':'60 % frente a 50 %.':tutorialStep===1?'Ahora: dos rojas de cuatro.':tutorialStep===2?'50 % frente a 50 %: empate.':'Antes: 50 % de roja y 50 % de azul.';
 return `<main class="table-layout tutorial-table" data-tutorial-view="${tutorialView}">
  <header class="tutorial-heading"><h1 class="tutorial-badge">Tutorial</h1><p>Las urnas · <span class="tutorial-step">Paso ${tutorialStep+1} de 4</span></p></header>
  <nav class="tutorial-view-tabs" aria-label="Vista del tutorial"><button data-testid="tutorial-view-choice" class="${tutorialView==='choice'?'active':''}" aria-pressed="${tutorialView==='choice'}">Elegir</button><button data-testid="tutorial-view-help" class="${tutorialView==='help'?'active':''}" aria-pressed="${tutorialView==='help'}">Las cuentas</button></nav>
  <section class="tutorial-workspace">${urnTutorialHelp(beforeUrns,review?cardUrns:undefined,text,tutorialHelpPage)}</section>
  <div class="vera-viewport tutorial-viewport" aria-label="Mesa de Vera y urnas del ejemplo"></div><div class="tutorial-controls"><aside class="game-panel">
   ${review?`<section class="result-card"><h2>${tutorialStep===1?'Salió una roja':'Salió una azul'}</h2></section>`:'<h2 class="objective">Buscá <span class="red-token">roja ▲</span></h2>'}
   <div class="tutorial-coach" role="status"><p>${summary}</p></div>
   ${review?'':`<button class="cards-toggle" data-testid="toggle-cards" aria-expanded="${visible}" aria-controls="demo-cards">${visible?'Ocultar urnas':'Ver urnas'}</button>`}
   <div id="demo-cards" class="urn-options" ${visible?'':'hidden'}>${urnChoice(cardUrns[0],0,true)}${urnChoice(cardUrns[1],1,true)}</div>
   ${btn('tutorial-next',review?tutorialStep===1?'Volver a elegir':'Empezar partida':demoChoice===null?'Elegí una urna':'Sacar ficha','primary full',!ready)}
  </aside></div>
  <footer class="tutorial-footer"><p>Ejemplo preparado · sin puntos</p>${btn('skip-tutorial','Saltar tutorial','primary')}</footer>
 </main>`;
}
function urnChoice(urn: Urn, index: 0 | 1, demo=false): string {
  const event=demo?'red':state.event;
  const p = probability(urn, event);
  const percent = p.denominator === 0 ? '0' : new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 }).format(100 * p.numerator / p.denominator);
  if(demo) {
    const reviewing=tutorialStep===1||tutorialStep===3;
    const correct=reviewing&&(tutorialStep===3||index===0);
    const redLabel = p.numerator === 1 ? 'roja' : 'rojas';
    return `<button data-testid="demo-urn-${index}" class="urn-option tutorial-urn ${demoChoice===index?'selected':''}" aria-label="Urna ${index+1}: ${p.numerator} ${redLabel} de ${p.denominator} ${p.denominator === 1 ? 'ficha' : 'fichas'}, ${percent} %" aria-pressed="${demoChoice===index}" ${reviewing?'disabled':''}><span class="urn-option-head"><strong>Urna ${index+1}</strong></span><span class="tutorial-urn-count">${reviewing?'Ahora: ':''}${p.numerator}/${p.denominator} ${redLabel}</span><strong class="tutorial-urn-percent">${percent} %</strong></button>`;
  }
  const choosing = demo?(tutorialStep===0||tutorialStep===2):state.phase === 'choose' || state.phase === 'guided';
  const hinted = !demo && choosing && state.assisted && bestChoices(state).includes(index);
  const reviewing = demo?(tutorialStep===1||tutorialStep===3):state.phase === 'revealed' && state.last !== null;
  const picked = demo?demoChoice===index:choosing ? selected === index : reviewing && state.last!.urn === index;
  const correct = reviewing && (demo?tutorialStep===3||index===0:state.last!.optimal.includes(index));
  return urnChoiceCard({urn,index,event,testId:`urn-${index}`,selected:picked,disabled:!choosing,review:reviewing,correct,hinted,showProbability:false});
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
  const before = last.beforeProbability;
  const after = probability(state.urns[last.urn], state.event);
  const percent = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 });
  const countAndChance = ({ numerator, denominator }: Fraction) => {
    if (!denominator) return 'la urna quedó vacía';
    const color = numerator === 1 ? colorName(state.event) : state.event === 'red' ? 'rojas' : 'azules';
    return `${numerator} ${color} de ${denominator} ${denominator === 1 ? 'ficha' : 'fichas'} (${percent.format(100 * numerator / denominator)} %)`;
  };

  const outcome = `Salió una ficha ${colorName(last.color)} ${symbol(last.color)}.`;
  const judgment = last.correct ? '¡Elegiste bien!' : 'Había una opción mejor.';
  const why = last.correct ? (last.optimal.length === 2 ? 'Las dos urnas daban las mismas posibilidades. Cualquiera servía.' : success ? 'Elegiste la urna con más posibilidades y salió el color que buscabas.' : 'Elegiste la urna con más posibilidades. Esta vez salió otro color: eso puede pasar aunque elijas bien.') : (success ? 'Salió el color que buscabas, pero la otra urna daba más posibilidades. Esta vez tuviste suerte.' : 'La otra urna daba más posibilidades de sacar el color que buscabas. Mirá la tarjeta verde para comparar.');
  return `<section class="result-card ${last.correct ? 'choice-right' : 'choice-wrong'}" data-testid="result-feedback"><span class="result-token ${last.color}-token" aria-hidden="true">${symbol(last.color)}</span><h2>${outcome}</h2><p class="decision-verdict">${judgment} ${state.assisted ? 'Práctica con ayuda.' : last.correct ? '+1 punto.' : '+0 puntos.'}</p><p>${why}</p>${!last.correct||!success?reviewButton('urns'):''}<details class="result-details"><summary>Qué cambió en la urna</summary><p class="small-note">Antes: ${countAndChance(before)}.<br>Después: ${countAndChance(after)}.<br>${state.replacement ? 'La ficha volvió a la urna y las cantidades se mantienen.' : 'La ficha quedó afuera de la urna.'}</p></details></section>`;
}
function table(): string {
  const choosing = state.phase === 'choose' || state.phase === 'guided';
  const isSummary = state.phase === 'roundEnd';
  const title = state.assisted ? `Práctica guiada ${state.round + 1}/2` : chapterNames[state.round];
  return `<main class="table-layout vera-layout"><section class="vera-floor"><section class="table-heading"><p class="eyebrow">Mesa I · Vera, la inventarista</p><h1>Las urnas</h1><p class="round-context" data-testid="round-label">${state.assisted ? title : `Ronda ${state.round + 1} de 4 · ${title}`}</p>${badges()}${state.assisted ? '' : `<p class="vera-seal-goal">Sello de Vera: ${VERA_SEAL_TARGET} de 8 decisiones correctas.</p>`}</section><div class="vera-viewport" aria-label="Mesa de Vera y sus dos urnas"></div></section><aside class="game-panel"><div class="round-progress" aria-label="${state.assisted ? 'Práctica guiada' : `Ronda ${state.round + 1} de cuatro`}">${[0,1,2,3].map(i => `<span class="${i <= state.round ? 'filled' : ''}"></span>`).join('')}</div><div class="objective-label">${state.assisted ? 'Demostración preparada · con ayuda' : `Extracción ${state.step + 1} de 2`}</div><h2 class="objective">Buscá una ficha <span class="${state.event}-token">${colorName(state.event)} ${symbol(state.event)}</span></h2><p class="rule-tag">${state.replacement ? '↻ La ficha vuelve' : '↗ La ficha queda afuera'} <span>${state.replacement ? 'Cada ficha vuelve a la urna.' : 'La ficha extraída queda afuera.'}</span></p>${choosing ? `<p class="decision-prompt">${state.step === 0 ? '¿Qué urna te da más posibilidades? Tocá una urna o mostrá sus tarjetas.' : state.replacement ? 'Devolvimos la ficha. Las cantidades siguen iguales: elegí otra vez.' : 'Hay una ficha menos. Mirá lo que queda y elegí otra vez.'}</p>${urnCards()}${btn('confirm-choice', selected === null ? 'Elegí una urna para continuar' : `Sacar una ficha de la urna ${selected === 0 ? '1' : '2'}`, 'primary full', selected === null)}<p class="small-note">${state.assisted ? 'La ayuda resalta una elección válida. Completá cuatro acciones para continuar.' : 'Ganás un punto por elegir bien, aunque salga otro color.'}</p>` : `${isSummary ? `<section class="round-summary"><span class="summary-mark" aria-hidden="true">✧</span><h2>Una ronda más clara.</h2><p>${state.assisted ? 'Terminaste este escenario preparado.' : state.round === 3 ? state.merit >= VERA_SEAL_TARGET ? 'Tus decisiones alcanzaron el sello de Vera.' : 'Te falta un poco de práctica. Vera preparó dos escenarios cortos para ayudarte.' : 'La próxima ronda empieza con fichas nuevas. Podés usar lo que aprendiste.'}</p>${badges()}${!state.assisted&&state.round===3&&state.merit<VERA_SEAL_TARGET?reviewButton('urns'):''}</section>` : urnCards() + feedback()}${btn('next-step', isSummary ? state.round === 3 || (state.assisted && state.round === 1) ? 'Ver mi resultado' : 'Siguiente ronda' : state.step === 0 ? 'Volver a decidir' : 'Cerrar la ronda', 'primary full')}`}${helpOpen ? `<div class="help-note"><strong>La cuenta de Vera</strong><p>Contá las fichas del color que buscás y todas las fichas de la urna. Por ejemplo: 3 rojas entre 5 fichas significa 3 de 5. Elegí la urna donde ese color ocupe una parte mayor. Si la parte es igual en ambas, las dos sirven. ${state.replacement ? 'Si devolvés la ficha, las cantidades no cambian.' : 'Si la ficha queda afuera, contá sólo las que quedan.'}</p></div>` : ''}<details class="panel-tools" data-keep-open="urn-tools"><summary>Ayuda y opciones</summary>${guideButton('urns','Repasar cómo jugar')}<div class="panel-footer">${btn('help-button', helpOpen ? 'Cerrar ayuda' : '¿Cómo comparo?', 'text-button')}${btn('repeat-tutorial','Repetir demostración','text-button')}${btn('back-room', 'Volver a la sala', 'text-button')}</div></details></aside><div class="table-bottom-note"><span class="speaker-dot"></span> Vera <span>«Una ficha no sabe nada de tus méritos».</span></div></main>`;
}
function complete(): string {
  return `<main class="completion-layout" data-testid="completion"><section class="completion-card"><div class="seal" aria-hidden="true">✧</div><h1>Vera te entrega su sello.</h1>${badges()}<p>${state.assisted ? 'Completaste los ejemplos con ayuda.' : 'Lograste el sello con tus decisiones.'}</p><p>La próxima mesa usa dados y contratos.</p>${btn('enter-contracts', 'Jugar con Doble', 'primary full')}${btn('practice-again', 'Volver a jugar con Vera', 'text-button full')}${btn('back-room', 'Volver a la sala', 'text-button full')}</section></main>`;
}

function dobleScreen(): string {
  const c = state.contracts;
  if (!c) return room();
  if(c.variant==='duel')return c.phase==='tutorial'?dobleDuelTutorial(c,dobleTutorialStep):dobleDuelView(c,selectedContract,diceRollStart);
  return c.phase === 'tutorial' ? contractsTutorial(c, dobleTutorialStep) : c.phase === 'complete' ? contractsComplete(c) : contractsView(c, selectedContract, comparisonResult, rehearsalPair, diceRollStart, diceCombinationsVisible);
}
function render(focusId?: string): void {
  const expanded = [...app.querySelectorAll<HTMLDetailsElement>('details[data-keep-open][open]')].map(el => el.dataset.keepOpen);
  document.body.dataset.screen = screen;
  document.documentElement.style.setProperty('--street-progress',String(state.streetPosition??0));
  document.body.dataset.cameraMode=cameraController.mode;
  document.documentElement.style.setProperty('--room-pan',String(cameraController.position.x*-1.2)+'%');
  document.body.dataset.doblePhase = state.contracts?.phase ?? 'tutorial';
  document.body.dataset.introPhase = introPhase;
  document.body.dataset.speaker = screen === 'intro' && introLine === 2 ? 'vera' : 'captor';
  renderSurface(app,header() + ({ menu, intro: introView, room, tutorial, table, complete, contracts: dobleScreen, records:()=>state.records?recordsView(state.records,selectedRecord,adaTutorialStep):room(), finale:()=>state.finale?endingView(state.finale,selectedFinale,state.freed===true):room(), outside:outsideView, street:streetView, escape:escapeView }[screen])() +
    (warning ? `<div class="save-warning" role="status">${escapeText(warning)}</div>` : '') +
    (sceneWarning ? `<div class="graphics-warning">${sceneWarning} ${btn('retry-graphics','Reintentar 3D','quiet')}</div>` : ''),screen);
  for(const name of expanded) app.querySelector<HTMLDetailsElement>(`details[data-keep-open="${name}"]`)?.setAttribute('open','');
  cleanHeadingPeriods(app);
  replaceDisclosures(app);
  updateVisual();
  if (focusId) document.querySelector<HTMLButtonElement>(`[data-testid="${focusId}"]`)?.focus({preventScroll:true});
}
function updateVisual(): void {
  if(screen==='escape'){scene?.setEscapeMode(true);scene?.setRendering(true);return;}
  scene?.setEscapeMode(false);
  const canvas=document.querySelector<HTMLCanvasElement>('#scene');
  const viewport=app.querySelector<HTMLElement>('.dice-viewport,.ada-viewport,.vera-viewport');
  if(canvas&&viewport){if(canvas.parentElement!==viewport)viewport.append(canvas);scene?.resizeCanvas();}
  else scene?.resizeCanvas();
  const playingBoss=screen==='finale'&&!!app.querySelector('.boss-layout .ada-viewport');
  const bossUrns=playingBoss&&state.finale?.boss&&bossMechanic(state.finale)==='urns';
  const playingAda=screen==='records'&&!!app.querySelector('.ada-viewport');
  const contracts=screen==='contracts'?state.contracts:undefined;
  const playingContracts=!!contracts&&!['tutorial','complete','retry'].includes(contracts.phase);
  scene?.setRendering(playingBoss||playingAda||playingContracts||screen==='table'||screen==='tutorial');
  const host=playingBoss?state.finale:undefined;
  const pair=playingContracts?contracts?.pair:host?.pair;
  const first=playingContracts?contracts?.duel?.first:host?.boss?.firstDie;
  const firstOnly=contracts?.phase==='first-die'||(!!host&&bossNeedsFirstDie(host))||(!pair&&first!=null);
  scene?.setContractMode(playingBoss||playingContracts||playingAda,pair??(first==null?null:[first]),playingBoss?'captor':playingAda?'ada':'doble',host?.boss?bossMechanic(host):playingAda?'poker':'dice',firstOnly);
  scene?.setPokerTable(playingBoss&&state.finale?.boss&&bossMechanic(state.finale)==='poker'?state.finale.boss.poker??null:playingAda?state.records?.holdem??null:null,playingAda?state.records?.phase==='feedback':state.finale?.phase==='feedback');
  if(bossUrns&&state.finale){const f=state.finale,review=f.phase==='feedback',last=f.history.at(-1);scene?.updateUrns(f.urns,review?last?.choice==='U'?0:1:selectedFinale==='U'?0:selectedFinale==='V'?1:null,review?f.lastColor??undefined:undefined);return;}
  if (playingContracts||screen==='records'||screen==='finale'||screen==='outside') return;
  const urns: Urn[] = screen === 'tutorial' ? demoInventory() : state.urns;
  scene?.updateUrns(urns, screen==='tutorial'?demoChoice:screen === 'table' && state.phase === 'revealed' ? state.last?.urn ?? null : selected, screen === 'tutorial' ? tutorialStep===1?'red':tutorialStep===3?'blue':undefined : state.phase === 'revealed' ? state.last?.color : undefined);
}
function selectDemo(index:0|1):void {
 if(screen!=='tutorial'||![0,2].includes(tutorialStep))return;
 demoChoice=index;demoCardsVisible=true;tutorialHelpPage=0;tutorialView='choice';
 if(tutorialStep===0&&tutorialFlow.phase==='predict'||tutorialStep===2&&tutorialFlow.phase==='explain')tutorialFlow=advanceTutorial(tutorialFlow);
 render('demo-urn-'+index);
}
function commitSelection(index: 0 | 1): void {
  if(screen==='tutorial'){selectDemo(index);return;}
  if(screen==='finale'&&state.finale?.boss?.started&&state.finale.phase==='choose'&&!state.finale.boss.needsHelp&&bossMechanic(state.finale)==='urns'){selectedFinale=index===0?'U':'V';render('finale-'+selectedFinale);return;}
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
  beginIntro(); setScreen('intro', 'intro-back');
}
function enterTable(): void {
  state.activeTable = 'urns'; persist();
  if (state.phase === 'complete') { setScreen('complete', 'practice-again'); return; }
  if (!state.history.length) { tutorialStep = 0; tutorialHelpPage=0;tutorialView='choice';tutorialFlow=createTutorial(); demoChoice = null;demoCardsVisible=false; setScreen('tutorial', 'toggle-cards'); }
  else setScreen('table', state.phase === 'revealed' || state.phase === 'roundEnd' ? 'next-step' : 'toggle-cards');
}
function finishIntro(skip:boolean):void{
 state.intro??=createDialogue(INTRO);state.intro=applyDialogue(INTRO,state.intro,{id:'intro-'+state.intro.revision,revision:state.intro.revision,type:skip?'skip':'next'});persist();setScreen('room','enter-urns');
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
 return `<main class="street-layout">${streetScenery(false)}<section class="dialogue-card"><p class="eyebrow">Un recuerdo · un momento antes</p><h1>${position<8?'Sólo faltaba una cuadra.':'Un paso detrás. Después, oscuridad.'}</h1><p>${position<8?'Una calle tranquila. La lámpara titila. Podés avanzar unos pasos; alguien camina detrás de vos.':'No hubo una pelea. Un roce de cartas, la luz se apaga y despertás en la casa. El recuerdo termina acá.'}</p><p>Camino ${position} de 8</p>${btn('street-forward','Dar un paso','primary',position>=8)}${btn('street-return',position>=8?'Volver al despertar':'Saltar el recuerdo','quiet')}</section></main>`;
}
function outsideView():string {
 return `<main class="outside-layout victory-layout">${streetScenery(true)}${victoryCard()}</main>`;
}

function enterRecords():void {
 if(!tableUnlocked(state,'records'))return;
 adaTutorialStep=0;state.records??=createRecords();state.records=applyRecordsCommand(state.records,{type:'enable-bonus',expectedRevision:state.records.revision,commandId:'bonus-'+state.records.revision});state.activeTable='records';persist();setScreen('records',state.records.phase==='tutorial'?state.records.experience?.startsWith('photos-')&&state.records.diagnostic===null?'records-diagnostic-yes':'records-begin':state.records.phase==='feedback'?'records-next':state.records.phase==='complete'?'enter-finale':'records-'+recordsChoices(state.records)[0]);
}
function finaleFocus(s:Parameters<typeof finaleChoices>[0]):string {return s.phase==='complete'?'exit-house':s.phase==='feedback'?'finale-next':s.boss&&!s.boss.started?'finale-begin':s.boss?.needsHelp?'finale-assist':bossNeedsFirstDie(s)?'finale-roll-first':'finale-'+finaleChoices(s)[0];}
function enterFinale():void {
 if(!tableUnlocked(state,'finale'))return;
 if(!state.finale)state.finale=createFinale(Date.now(),'boss-v3');
 state.activeTable='finale';persist();setScreen('finale',finaleFocus(state.finale));
}
function handleCampaignClick(target:HTMLElement):boolean {
 const id=target.dataset.testid;
 if(id==='exit-house'&&state.freed){beginEscape();return true;}
 if(id==='replay-escape'&&state.freed){beginEscape();return true;}
 if(id==='skip-escape'&&screen==='escape'){setScreen('outside','back-room');return true;}
 if(id==='transfer-a'||id==='transfer-b'){const el=app.querySelector('[data-testid="transfer-feedback"]');if(el)el.textContent=id==='transfer-a'?'✓ 4 de 5 es 80 %, más que 2 de 4 (50 %).':'Revisá: 4 de 5 es 80 % y 2 de 4 es 50 %.';return true;}
 if(id==='transfer-safe'||id==='transfer-risk'){const el=app.querySelector('[data-testid="transfer-risk-feedback"]');if(el)el.textContent=id==='transfer-safe'?'✓ El pago fijo garantiza al menos 1.':'Un promedio de 3 puede incluir pérdidas. Para una garantía, elegí el pago fijo.';return true;}
 if((id==='records-replay'||id==='records-upgrade')&&state.records){adaTutorialStep=0;state.records=createRecords(Date.now(),true);selectedRecord=null;enterRecords();return true;}
 if(id==='finale-replay'&&state.finale){state.finale=createFinale(Date.now(),'boss-v3');persist();setScreen('finale',finaleFocus(state.finale));return true;}
 if(screen==='records'&&state.records){
   const current=state.records;
   if(current.phase==='tutorial'&&current.experience==='cards-v1'&&(id==='records-tutorial-next'||id==='records-tutorial-back')){adaTutorialStep=Math.max(0,Math.min(2,adaTutorialStep+(id==='records-tutorial-next'?1:-1)));render(adaTutorialStep===2?'records-begin':'records-tutorial-next');return true;}
   if(id==='records-diagnostic-yes'||id==='records-diagnostic-no'){
     const next=applyRecordsCommand(current,{type:'diagnose',choice:id.endsWith('yes')?'yes':'no',expectedRevision:Number(target.dataset.revision),commandId:'ada-diagnostic-'+target.dataset.revision});
     if(next!==current){state.records=next;persist();render('records-begin');}return true;
   }
   if(id?.startsWith('records-')&&current.phase==='choose'&&recordsChoices(current).includes(id.slice(8) as RecordsChoice)){selectedRecord=id.slice(8) as RecordsChoice;render(id);return true;}
   if(['records-begin','records-confirm','records-next','records-assist'].includes(id??'')){
     const command:RecordsCommand={type:id==='records-assist'?'assist':id==='records-begin'?'begin':id==='records-confirm'?'choose':'next',...(selectedRecord?{choice:selectedRecord}:{}),expectedRevision:Number(target.dataset.revision),commandId:'ada-'+target.dataset.revision+'-'+id};
     const next=applyRecordsCommand(current,command);if(next===current){announce('Seguí la opción indicada por la ayuda.');return true;}
     state.records=next;selectedRecord=null;persist();render(next.phase==='feedback'?'records-next':next.phase==='complete'?'enter-finale':'records-'+recordsChoices(next)[0]);if(current.phase==='tutorial'||next.phase==='choose'||next.phase==='complete')window.scrollTo({top:0,behavior:'instant'});chime(next.history.at(-1)?.correct);return true;
   }
 }
 if(screen==='finale'&&state.finale){
   const current=state.finale;
   if(id?.startsWith('finale-')&&current.phase==='choose'&&finaleChoices(current).includes(id.slice(7) as FinaleChoice)){selectedFinale=id.slice(7) as FinaleChoice;render(id);return true;}
   if(['finale-confirm','finale-next','finale-begin','finale-assist','finale-roll-first'].includes(id??'')){
     const command:FinaleCommand={type:id==='finale-roll-first'?'roll-first':id==='finale-begin'?'begin':id==='finale-assist'?'assist':id==='finale-confirm'?'choose':'next',...(selectedFinale?{choice:selectedFinale}:{}),expectedRevision:Number(target.dataset.revision),commandId:'host-'+target.dataset.revision+'-'+id};
     const next=applyFinaleCommand(current,command);if(next===current){announce('Revisá los datos e intentá otra respuesta.');return true;}
     state.finale=next;selectedFinale=null;persist();render(finaleFocus(next));
     if(command.type==='roll-first')scene?.rollDice(0);
     if(command.type==='choose'&&current.boss&&bossMechanic(current)==='dice')scene?.rollDice(current.boss.firstDie==null?undefined:1);
     if(next.phase==='choose'||next.phase==='complete')window.scrollTo({top:0,behavior:'instant'});
     chime(next.history.at(-1)?.correct);return true;
   }
 }
 return false;
}
window.addEventListener('storage',event=>{if(event.key==='thegame.save.v1.current'&&event.newValue!==event.oldValue){storageConflict=true;warning='Otra pestaña cambió el progreso. Esta partida sigue en memoria. Recargá para cargar el guardado más reciente.';render();}});
let dialogReturnFocus:HTMLElement|null=null;
function showDialog(title: string, content: string, kind=''): HTMLDialogElement {
  const active=document.activeElement as HTMLElement|null;
  const previous=active&&overlay.contains(active)?dialogReturnFocus:active;
  dialogReturnFocus=previous;
  overlay.querySelector<HTMLDialogElement>('dialog[open]')?.close();
  overlay.innerHTML = `<dialog class="modal ${kind}" aria-labelledby="modal-title"><div class="modal-heading"><h2 id="modal-title">${title}</h2>${btn('close-dialog', 'Cerrar <span aria-hidden="true">×</span>', 'quiet modal-close')}</div><div class="modal-body">${content}</div></dialog>`;
  const dialog = overlay.querySelector('dialog')!;
  dialog.addEventListener('close', () => {
    // A closed dialog may already have been replaced by another one (reset/confirmation).
    if (!dialog.isConnected) return;
    const restore=document.activeElement===document.body||dialog.contains(document.activeElement);
    dialog.remove(); if(restore)previous?.focus({preventScroll:true});
  });
  cleanHeadingPeriods(dialog);
  dialog.showModal(); return dialog;
}
function updateSettingsOrientation():void {
 const compactLandscape=matchMedia('(min-width:500px) and (max-height:600px)').matches;
 overlay.querySelector('[role=tablist]')?.setAttribute('aria-orientation',!compactLandscape&&matchMedia('(max-width:700px)').matches?'horizontal':'vertical');
}
window.addEventListener('resize',updateSettingsOrientation);
function showSettings(section:SettingsSection='display'): void {
  showDialog('Opciones',settingsMenu(settings,section,screen!=='menu'),'settings-modal');
  if(!preferencesSaved)overlay.querySelector('.settings-save-state')!.textContent='Ajustes aplicados sólo en esta pestaña';
  syncSettingSteps(overlay);updateSettingsOrientation();
}

function enterContracts(): void {
  if(!urnsSealed()) return;
  if(!state.contracts) state.contracts = createContracts(Date.now(), 'duel');
  state.activeTable = 'contracts'; persist();
  setScreen('contracts',dobleFocus(state.contracts));
}
function restartDoble(): void {
  clearTimeout(diceRollTimer);
  diceRollStart=undefined;
  scene?.stopDiceRoll();
  state.contracts=createContracts(Date.now(),'duel');
  dobleTutorialStep=0;
  comparisonResult=null;
  enterContracts();
}
function dobleFocus(s:ContractsState):string {
  switch(s.phase){
    case 'tutorial': return 'doble-tutorial-next';
    case 'first-die': return 'doble-roll-first';
    case 'offer': case 'order': return 'contract-S';
    case 'retry': return 'doble-replay';
    case 'complete': return 'back-room';
    default: return 'doble-next';
  }
}
function revealFeedback(selector: string): void {
  if(settings.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  app.querySelector(selector)?.animate([{opacity:.65,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'cubic-bezier(0.23,1,0.32,1)'});
}
function commandDoble(type: ContractCommand['type'], revision: number, pointerFeedback = false): void {
  if(screen !== 'contracts' || !state.contracts) return;
  if(diceRollStart)return;
  const command: ContractCommand = { type, expectedRevision: revision, commandId: `doble-${revision}-${type}` };
  if(type === 'sign' && selectedContract) command.contract = selectedContract;
  const next = applyContractCommand(state.contracts, command);
  if(next === state.contracts) { announce('Elegí el contrato indicado por la ayuda o revisá el encargo actual.'); return; }
  const current=state.contracts;
  const throwsDice=type==='roll-first'||(type==='sign'&&current.phase==='offer'&&next.phase==='result');
  const animateRoll = throwsDice && !settings.reducedMotion && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (animateRoll) {
    const die=type==='roll-first'?0:current.duel?.first!=null?1:undefined;
    diceRollStart = { balance:current.balance,merit:current.merit,...(die===undefined?{}:{die}),...(current.duel?{rivalScore:current.duel.rivalScore}:{}) };
  }
  state.contracts = next; selectedContract = null; persist();
  if(!animateRoll)chime(next.history.at(-1)?.correct ?? true);
  render(dobleFocus(next));
  if(type==='begin'||next.phase==='offer'||next.phase==='complete')window.scrollTo({top:0,behavior:'instant'});
  if(animateRoll){scene?.rollDice(diceRollStart?.die);diceRollTimer=setTimeout(finishDiceRoll,900);}

  if(pointerFeedback && next.phase === 'result'&&!throwsDice) revealFeedback('.dice-table-caption');
  announce(animateRoll?'Tirando…':dobleAnnouncement(next));
}
function dobleAnnouncement(s:ContractsState):string {
  if(s.phase==='result'&&s.pair)return `Dados ${s.pair[0]} y ${s.pair[1]}. Suma ${s.pair[0]+s.pair[1]}. ${s.duel?`Vos ${s.balance}, Doble ${s.duel.rivalScore}.`:`Saldo ${s.balance}.`}`;
  if(s.phase==='offer'&&s.duel?.first!=null)return `Salió ${s.duel.first} en el primer dado. Elegí una tarjeta.`;
  if(s.phase==='complete')return 'Sello de Doble obtenido.';
  if(s.phase==='retry')return 'Terminó el duelo. Podés volver a jugar.';
  return s.phase==='order'?'Nuevo encargo hipotético. Sin otra tirada.':'Partida actualizada.';
}
function finishDiceRoll():void {
  clearTimeout(diceRollTimer);diceRollStart=undefined;scene?.stopDiceRoll();
  if(screen!=='contracts'||!state.contracts)return;
  chime(state.contracts.history.at(-1)?.correct??true);
  render(overlay.querySelector('dialog[open]')?undefined:dobleFocus(state.contracts));
  announce(dobleAnnouncement(state.contracts));
}
function handleGameClick(event: MouseEvent): void {
  const target = (event.target as HTMLElement).closest<HTMLElement>('button, [data-action]');
  if (!target) return;
  const id = target.dataset.testid;
  if(target.dataset.review){showReading(showDialog,'Repasar conceptos',learningReview(target.dataset.review as LearningTopic));return;}

  if(id === 'enter-records') {enterRecords();return;}
  if(id === 'enter-finale') {enterFinale();return;}
  if(handleCampaignClick(target))return;
  if(id === 'enter-contracts') { enterContracts(); return; }
  if(screen === 'contracts' && state.contracts) {
    if(id==='doble-upgrade'&&state.contracts.variant!=='duel'){
      showDialog('El nuevo duelo de Doble',`<p>Jugá ocho partidas contra Doble. Vas a empezar de cero en esta mesa. Conservás tus sellos y el avance en las otras mesas.</p>${btn('confirm-doble-upgrade','Empezar el duelo nuevo','primary full')}${btn('cancel-dialog','Seguir con mi partida','text-button full')}`);
      return;
    }
    if(id==='toggle-dice-combinations'){
      if(matchMedia('(min-width:500px) and (max-height:600px)').matches){showReading(showDialog,'Combinaciones de los dados',contractCombinationsGuide());return;}
      diceCombinationsVisible=!diceCombinationsVisible;render('toggle-dice-combinations');return;
    }
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
    if(id === 'doble-sign' || id === 'doble-next' || id === 'doble-roll-first') { commandDoble(id === 'doble-roll-first'?'roll-first':id === 'doble-sign' ? 'sign' : 'next',Number(target.dataset.revision),event.detail > 0); return; }
    if(id === 'doble-replay') { restartDoble(); return; }
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
  if(id==='street-return'){beginIntro();setScreen('intro','intro-back');return;}
  if(id?.startsWith('walk-')){moveRoom(id.slice(5) as InputAction);return;}
  if (id === 'retry-graphics') { void initScene(); return; }
  if (id === 'settings-button') { showSettings(); return; }
  if (target.dataset.action === 'home') { event.preventDefault(); setScreen('menu'); return; }
  if (target.dataset.action === 'credits') {
    showDialog('Créditos', `<p>La Casa del Azar es un juego educativo de probabilidad y estadística. Compará proporciones con Vera, evaluá ganancias y riesgos con Doble y calculá las chances de una mano con Ada antes de enfrentar al anfitrión.</p><p>La sala y el elenco se ilustraron con generación de imágenes. La estética se inspira en la animación de los años treinta y en Cuphead. El anfitrión está inspirado en Gambito de Marvel. Proyecto independiente de Marvel y Studio MDHR.</p><p>Mesas, urnas y dados interactivos propios. Sonidos sintetizados. Motor Babylon.js bajo licencia Apache 2.0.</p><a href="${import.meta.env.BASE_URL}credits.html" target="_blank" rel="noopener">Procedencia de recursos y licencias</a>`); return;
  }
  if (id === 'new-game' || id === 'practice-again') {
    if (hasSave && state.history.length && id === 'new-game') { showDialog('¿Empezar de nuevo?', `<p>La nueva partida reemplaza tu progreso actual. Podés cerrar esta ventana para conservarlo.</p><div class="confirmation-actions">${btn('cancel-dialog','Conservar partida','secondary full')}${btn('confirm-new-game','Empezar de nuevo','primary full')}</div>`,'confirmation-modal'); return; }
    startNew(id === 'practice-again'); return;
  }
  if (id === 'continue-game') { if(state.intro?.ended&&!state.activeTable&&!state.history.length){setScreen('room','enter-urns');return;} if(state.intro&&!state.intro.ended&&!state.activeTable&&!state.history.length){introLine=Math.max(0,INTRO.nodes.findIndex(n=>n.id===state.intro!.node));if(introLine===0)beginIntro();else introPhase='lit';setScreen('intro',introPhase==='dark'?'intro-back':'intro-next');return;} if(state.activeTable==='outside'&&state.freed){setScreen('outside','back-room');return;} if(state.activeTable==='records'){enterRecords();return;} if(state.activeTable==='finale'){enterFinale();return;} if(state.activeTable === 'contracts' && state.contracts) { enterContracts(); return; } setScreen(state.phase === 'complete' ? 'complete' : 'table', state.phase === 'choose' || state.phase === 'guided' ? 'toggle-cards' : 'next-step'); return; }
  if (id === 'intro-back' && screen === 'intro') {
    stopIntro();
    if (introLine === 0) { setScreen('menu', 'continue-game'); return; }
    introPhase = 'lit'; introLine--; render('intro-back'); return;
  }
  if (id === 'intro-next' && screen === 'intro' && introPhase !== 'dark') {
    stopIntro(); introPhase = 'lit';
    if (introLine === intro.length - 1) { finishIntro(false); return; }
    state.intro ??= createDialogue(INTRO);
    if (INTRO.nodes[introLine]!.id === state.intro.node) {
      state.intro = applyDialogue(INTRO, state.intro, { id: 'intro-' + state.intro.revision, revision: state.intro.revision, type: 'next' });
      persist();
    }
    introLine++; render('intro-next'); return;
  }
  if (id === 'enter-urns') { enterTable(); return; }
  if(screen==='tutorial'&&id?.startsWith('tutorial-view-')){tutorialView=id==='tutorial-view-help'?'help':'choice';render(id);return;}
  if(screen==='tutorial'&&(id==='tutorial-help-previous'||id==='tutorial-help-next')){
    const last=app.querySelectorAll('[data-tutorial-help-page]').length-1;
    tutorialHelpPage=Math.min(last,Math.max(0,tutorialHelpPage+(id==='tutorial-help-next'?1:-1)));
    render(tutorialHelpPage===last?'tutorial-help-previous':tutorialHelpPage===0?'tutorial-help-next':id);return;
  }
  if (id === 'demo-urn-0' || id === 'demo-urn-1') {selectDemo(id==='demo-urn-0'?0:1);return;}
  if (id === 'tutorial-next') {
    if(screen!=='tutorial'||tutorialStep===0&&demoChoice!==0||tutorialStep===2&&demoChoice===null)return;
    if(tutorialStep<3){tutorialStep++;tutorialHelpPage=0;tutorialFlow=advanceTutorial(tutorialFlow);if(tutorialStep===2){demoChoice=null;demoCardsVisible=false;}chime();render(tutorialStep===2?'toggle-cards':'tutorial-next');}
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
    announce('');
    state = advance(state); selected = null; cardsVisible = false; persist();
    if (state.phase === 'complete') setScreen('complete','practice-again');
    else render(state.phase === 'roundEnd' ? 'next-step' : 'toggle-cards'); return;
  }
  if (id === 'back-room') {const table=state.activeTable;persist();setScreen('room',table==='contracts'||table==='records'||table==='finale'?'enter-'+table:'enter-urns');return;}
  if(id==='repeat-tutorial'){tutorialStep=0;tutorialHelpPage=0;tutorialView='choice';demoChoice=null;demoCardsVisible=false;tutorialFlow=createTutorial();setScreen('tutorial','toggle-cards');return;}
  if (id === 'help-button') {const helpId='urns-'+state.round+'-'+state.step;tutorialFlow=requestHelp(tutorialFlow,helpId);state.helpHistory??=[];if(!state.helpHistory.includes(helpId))state.helpHistory.push(helpId);persist();showDialog('Cómo comparar', '<p>Contá las fichas del color pedido y comparalas con el total. Tres rojas de cinco ofrecen más posibilidades que una de dos.</p><p>Si la ficha queda afuera, volvé a contar antes de elegir.</p>');}
}
app.addEventListener('click', handleGameClick);
overlay.addEventListener('click', event => {
  const utility=(event.target as HTMLElement).closest<HTMLElement>('button')?.dataset.testid;
  if(utility&&['help-button','repeat-tutorial','back-room'].includes(utility)){overlay.querySelector('dialog')?.close();handleGameClick(event);return;}
  const step=(event.target as HTMLElement).closest<HTMLElement>('[data-setting-step]');
  if(step){const input=overlay.querySelector<HTMLInputElement|HTMLSelectElement>('[data-testid="'+step.dataset.settingStep+'"]')!;const delta=Number(step.dataset.delta);if(input instanceof HTMLSelectElement){input.selectedIndex=Math.max(0,Math.min(input.options.length-1,input.selectedIndex+delta));}else input.value=String(Math.max(0,Math.min(1,Math.round((Number(input.value)+delta*.05)*100)/100)));input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));return;}
  const tab=(event.target as HTMLElement).closest<HTMLElement>('[data-settings-tab]')?.dataset.settingsTab;
  if(tab){
    overlay.querySelectorAll<HTMLElement>('[data-settings-tab]').forEach(el=>{const active=el.dataset.settingsTab===tab;el.setAttribute('aria-selected',String(active));el.tabIndex=active?0:-1;});
    overlay.querySelectorAll<HTMLElement>('[role="tabpanel"]').forEach(el=>el.hidden=el.id!=='settings-'+tab);
    return;
  }
  const id = (event.target as HTMLElement).closest<HTMLElement>('button')?.dataset.testid;
  if (id === 'close-dialog' || id === 'resume-game' || id==='settings-return' || id==='cancel-dialog') overlay.querySelector('dialog')?.close();
  if (id === 'confirm-new-game') { overlay.querySelector('dialog')?.close(); startNew(); }
  if(id==='confirm-doble-upgrade'&&screen==='contracts'&&state.contracts&&state.contracts.variant!=='duel'){
    overlay.querySelector('dialog')?.close();
    restartDoble();
  }
  if (id === 'restore-settings') { settings = structuredClone(defaultSettings); applySettings(); preferencesSaved=savePreferences(settings); if(hasSave)persist(); overlay.querySelector('dialog')?.close(); showSettings(); }
  if(id==='return-main-menu'){overlay.querySelector('dialog')?.close();if(hasSave)persist();setScreen('menu',hasSave?'continue-game':'new-game');return;}
  if(id==='cancel-delete'){overlay.querySelector('dialog')?.close();showSettings('session');return;}
  if (id === 'delete-save') { overlay.querySelector('dialog')?.close(); showDialog('Borrar el progreso', `<p>Se eliminarán la partida y su copia de seguridad. Esta acción no se puede deshacer.</p><div class="confirmation-actions">${btn('cancel-delete','Conservar partida','secondary full')}${btn('confirm-delete','Borrar el progreso','primary full')}</div>`,'confirmation-modal'); }
  if (id === 'confirm-delete') { clearGame(); resetPreferences(); storageConflict=false; hasSave=false; warning=null; state=createGame(); settings=structuredClone(defaultSettings); applySettings(); overlay.querySelector('dialog')?.close(); setScreen('menu','new-game'); }
});
overlay.addEventListener('keydown',event=>{const tab=(event.target as HTMLElement).closest<HTMLButtonElement>('[data-settings-tab]');if(!tab||!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;const tabs=[...overlay.querySelectorAll<HTMLButtonElement>('[data-settings-tab]')];const index=event.key==='Home'?0:event.key==='End'?tabs.length-1:(tabs.indexOf(tab)+(['ArrowDown','ArrowRight'].includes(event.key)?1:tabs.length-1))%tabs.length;event.preventDefault();tabs[index]?.click();tabs[index]?.focus();});
overlay.addEventListener('input', event => {
  const el = event.target as HTMLInputElement;
  if (el.dataset.testid !== 'volume') return;
  settings.volume = Number(el.value);
  const volume = Math.round(settings.volume * 100);
  el.style.setProperty('--range-progress', `${volume}%`);
  el.setAttribute('aria-valuetext', `${volume} %`);
  const output = overlay.querySelector<HTMLOutputElement>('[data-testid="volume-value"]');
  if (output) output.value = `${volume} %`;
  gameAudio.setVolume(settings.volume);
});
overlay.addEventListener('change', event => {
  const el = event.target as HTMLInputElement;
  if (el.dataset.testid === 'reduced-motion') {
    settings.reducedMotion = el.checked;
    const status = overlay.querySelector('[data-testid="motion-state"]');
    if (status) status.textContent = el.checked ? 'Activado' : 'Desactivado';
  }
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
  applySettings();preferencesSaved=savePreferences(settings);if(hasSave)persist();syncSettingSteps(overlay);
  const status=overlay.querySelector('.settings-save-state');if(status)status.textContent=preferencesSaved?'Ajustes guardados':'Ajustes aplicados sólo en esta pestaña';
});

installInfoDialogs(showDialog);
installGameGuides(showDialog);
installBossTutorial(showDialog);
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
