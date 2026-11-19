import type { ContractId } from '../core/math/dice';
import { hasDobleQuestions, latestDobleVariant, type ContractsState } from '../core/tables/contracts';
import { bestDobleAnswers, diceDuelOffers, diceDuelPoints, DOBLE_QUESTIONS } from '../core/tables/dice-duel';
import { diceTable } from './dice-table';
import { guideButton } from './game-guides';
import { reviewButton } from './learning';
import { doblePayoutRules } from './doble-practice';

export interface DobleRollStart { balance:number; merit:number; rivalScore?:number; die?:0|1 }
const questions = [
  '¿Con qué oferta querés empezar?',
  '¿Vas por puntos seguros o por un premio más grande?',
  '¿Qué números te conviene buscar?',
  'Con el primer dado a la vista, ¿qué oferta te sirve?',
  'Con las nuevas ofertas, ¿qué suma querés buscar?',
  '¿Vas por una suma baja, una alta o dos dados iguales?',
  'Mirá el marcador. ¿Qué opción elegís esta vez?',
  'Ya sabés qué salió primero. ¿Qué elegirías para cerrar?',
] as const;

const button=(id:string,label:string,s:ContractsState,disabled=false)=>`<button class="primary full" data-testid="${id}" data-revision="${s.revision}" ${disabled?'disabled':''}>${label}</button>`;
const signed=(n:number)=>n>0?`+${n}`:String(n);

export function dobleDuelTutorial(s:ContractsState,step:number):string {
  if(hasDobleQuestions(s.variant)){
    const payouts=s.variant===latestDobleVariant;
    return `<main class="contracts-tutorial"><img src="${import.meta.env.BASE_URL}art/doble-full-v1.png" alt="Doble" class="doble-intro">
      <section class="dialogue-card"><h1>Elegí una tarjeta</h1>${payouts?doblePayoutRules():'<p>Respondé ocho preguntas sobre los dados. Si acertás las ocho, ganás el duelo.</p>'}
      <div class="dialogue-actions"><button class="primary full" data-doble-practice="${payouts?'payouts':'classic'}" data-testid="doble-practice">Practicar con Doble</button>
      <button class="text-button" data-testid="doble-begin" data-revision="${s.revision}">Ir a la partida</button></div></section></main>`;
  }
  const [title,copy] = [
    ['Elegí una tarjeta', 'Vos y Doble eligen una tarjeta. Después se tiran los dados. La misma tirada vale para los dos.'],
    ['Sumá puntos', 'Si tu tarjeta dice «+24 si suman justo 7» y sale 7, sumás 24. Tu tarjeta también te dice qué pasa si sale otra suma.'],
    ['Ganale en ocho partidas', 'Las tarjetas cambian después de la cuarta partida. En la cuarta y la octava ves el primer dado antes de elegir. Al final, ganá más puntos que Doble para seguir.'],
  ][step]!;
  return `<main class="contracts-tutorial"><img src="${import.meta.env.BASE_URL}art/doble-full-v1.png" alt="Doble" class="doble-intro"><section class="dialogue-card"><h1>${title}</h1><p>${copy}</p><p class="small-note">${step+1} de 3</p><div class="dialogue-actions">${button('doble-tutorial-next',step===2?'Ir a la partida':'Continuar',s)}${step<2?`<button class="text-button" data-testid="doble-begin" data-revision="${s.revision}">Saltar tutorial y jugar</button>`:''}</div></section></main>`;
}

export function dobleDuelView(s:ContractsState,selected:ContractId|null,roll?:DobleRollStart):string {
  const duel=s.duel!;
  const probability=hasDobleQuestions(s.variant);
  const payouts=s.variant===latestDobleVariant;
  const help=(label:string)=>probability?`<button class="text-button full" data-doble-practice="${payouts?'payouts':'classic'}">${label}</button>`:guideButton('dice-duel',label);
  const scoreboard=`<div class="scoreboard"><span>Vos <strong data-testid="doble-balance">${roll?.balance??s.balance}</strong></span><span>Doble <strong data-testid="doble-rival-score">${roll?.rivalScore??duel.rivalScore}</strong></span>${probability?`<span>Aciertos <strong data-testid="doble-merit">${roll?.merit??s.merit}/8</strong></span>`:''}</div>`;
  if(s.phase==='complete'||s.phase==='retry'){
    const won=s.phase==='complete';
    const title=won?'Le ganaste a Doble':s.balance===duel.rivalScore?'Empataste con Doble':'Doble ganó esta vez';
    const ending=probability&&s.merit===8?'Ocho aciertos: +1 punto y el sello de Doble.':won?'Conseguiste el sello.':'Repasá las reglas y volvé a jugar las ocho partidas.';
    const replay=probability?(won?'Volver a jugar':'Jugar de nuevo'):'Jugar al duelo nuevo';
    return `<main class="completion-layout"><section class="completion-card" data-testid="doble-${won?'completion':'retry'}"><h1>${title}</h1>${scoreboard}<p>${ending}</p>${won?`<button class="primary full" data-testid="enter-records">Ir a la mesa de Ada</button>`:help('Ver el tutorial de Doble')}${button('doble-replay',replay,s)}<button class="text-button full" data-testid="back-room">Volver a la sala</button></section></main>`;
  }
  const set=s.round<4?0:1;
  const offers=diceDuelOffers(set);
  const choosing=s.phase==='offer'&&!roll;
  const result=s.phase==='result'&&!roll?duel.rounds.at(-1):undefined;
  const name=(id:ContractId)=>offers.find(offer=>offer.id===id)!.name;
  const first=duel.first;
  const rivalLabel=result&&payouts&&result.correct===false&&result.playerPoints>0&&diceDuelPoints(set,result.rival,result.pair)<=0
    ?'Punto mínimo':result?name(result.rival):'';
  const feedback=result?.correct===true
    ?payouts&&result.playerPoints>0?'Acertaste la pregunta y la tirada. Solo vos cobrás.':'Mejor elección. Ambos suman 0.'
    :result?.correct===false?`Mejor opción para la pregunta: ${bestDobleAnswers(s.round,first).map(name).join(' o ')}.`:'';
  const question=probability?DOBLE_QUESTIONS[s.round]!.prompt:questions[s.round];
  const tickets=offers.map(o=>`<button class="contract-ticket compact-offer ${(result?.player??selected)===o.id?'chosen':''}" data-testid="contract-${o.id}" aria-pressed="${(result?.player??selected)===o.id}" ${choosing?'':'disabled'}><span class="offer-heading"><strong class="offer-name">${o.name}</strong></span><strong class="varied-rule">${signed(o.win)} puntos · ${o.when}</strong>${o.condition==='any'?'':`<span class="varied-rule">${o.miss===0?'Si no, 0 puntos':`Si no, perdés ${-o.miss}`}</span>`}</button>`).join('');
  const panel=roll?`<h2>${roll.die===0?'Tirando el primer dado':roll.die===1?'Tirando el segundo dado':'Tirando los dados'}</h2>`
    :s.phase==='first-die'? `<h2>Primero mirá qué sale</h2><p>Después elegís una tarjeta.</p>${button('doble-roll-first','Tirar el primer dado',s)}`
    :result?`<section data-testid="doble-duel-feedback"><h2>Resultado de la partida</h2>${feedback?`<p>${feedback}</p>`:''}<p>Vos · ${name(result.player)} <strong>${signed(result.playerPoints)}</strong></p><p>Doble · ${rivalLabel} <strong>${signed(result.rivalPoints)}</strong></p></section>${button('doble-next',s.round===7?'Ver el marcador final':s.round===3?'Jugar con las nuevas tarjetas':'Siguiente partida',s)}`
    :`${payouts?'<small class="duel-choice-note">Usá la pregunta como guía. Podés elegir cualquier tarjeta.</small>':''}<h2 data-testid="challenge-question">${question}</h2>${first!==null?`<small class="duel-choice-note">Primer dado: <strong>${first}</strong></small>`:''}${button('doble-sign',first===null?'Elegir y tirar los dados':'Elegir y tirar el segundo dado',s,selected===null)}`;
  const pair=s.pair??(first===null?null:[first] as const);
  const firstOnly=s.phase==='first-die'||(s.phase==='offer'&&first!==null);
  return `<main class="contracts-layout varied-contracts doble-duel"><section class="contracts-floor"><header class="contracts-heading"><h1>El duelo de Doble</h1>${scoreboard}</header><section class="contract-stage">${diceTable(pair,!!roll,false,firstOnly,roll?.die)}<div class="contract-offers">${tickets}</div></section></section><aside class="game-panel contracts-panel"><span class="challenge-seal">Partida ${s.round+1} de 8</span>${panel}<div class="duel-tools">${!probability&&result&&result.playerPoints<=0?reviewButton('contracts'):''}${help('Cómo jugar')}<button class="text-button full" data-testid="back-room">Guardar y volver a la sala</button></div></aside></main>`;
}
