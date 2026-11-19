import {dieFace} from './dice-face';
import type {TableDice} from '../core/tables/dice-duel';

/** The existing WebGL canvas is mounted here; HTML also works without WebGL. */
export function diceTable(pair:TableDice|null,rolling:boolean,previous:boolean,firstOnly=false,rollingDie?:0|1):string {
 const first=rolling&&rollingDie!==1?null:pair?.[0]??null;
 const second=rolling?null:pair?.[1]??null;
 const caption=rolling
   ? rollingDie===0?'Tirando el primer dado…':rollingDie===1?`Dado 1: ${first} · Tirando el segundo…`:'Tirando los dados…'
   : first!==null&&second!==null?`${previous?'Tirada anterior · ':''}Dado 1: ${first} · Dado 2: ${second} · Suma ${first+second}`
   : first!==null?`Dado 1: ${first} · Falta el segundo dado`
   : firstOnly?'Primero se tira un solo dado.':'Dados de muestra · se tiran al firmar una oferta.';
 return `<section class="dice-table ${rolling?'is-rolling':''}" data-rolling-die="${rollingDie??'both'}" aria-label="Mesa de dados de Doble" data-testid="dice-table"><div class="dice-viewport" data-testid="dice-viewport"><div class="dice-table-fallback" aria-hidden="true"><div class="dice-pair">${dieFace(first,'D1')}${firstOnly?'':dieFace(second,'D2')}</div></div></div><p class="dice-table-caption" role="status" data-testid="dice-status">${caption}</p></section>`;
}
