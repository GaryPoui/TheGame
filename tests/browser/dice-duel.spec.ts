import { expect, test, type Page } from '@playwright/test';
import { advance, bestChoices, choose, createGame, type GameState } from '../../src/core/game';
import { applyContractCommand, createContracts } from '../../src/core/tables/contracts';
import { diceDuelPoints } from '../../src/core/tables/dice-duel';
import { bossMechanic, bossNeedsFirstDie } from '../../src/core/tables/boss';
import { applyFinaleCommand, bestFinale, createFinale, type FinaleCommand } from '../../src/core/tables/finale';

const saveKey='thegame.save.v1.current';
async function load(page:Page,state:GameState,schemaVersion:10|11|12=11){
  const contentVersion={10:'campaign-casino-v10',11:'campaign-doble-duel-v11',12:'campaign-doble-probability-v12'}[schemaVersion];
  await page.addInitScript(({key,save})=>{
    if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(save));
  },{key:saveKey,save:{schemaVersion,contentVersion,state}});
  await page.goto('./');
  await page.waitForFunction(()=>window.__THEGAME_READY__);
  await page.getByTestId('continue-game').click();
}
const saved=(page:Page)=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).state as GameState,saveKey);

test('an older Doble save can switch to the new dice duel and keep its seals',async({page})=>{
  await page.setViewportSize({width:640,height:360});
  const game=createGame(5);
  game.settings.reducedMotion=true;
  game.settings.volume=0;
  game.seals={urns:true,contracts:true,records:true,contractsMethod:'assisted'};
  game.activeTable='contracts';
  const begun=applyContractCommand(createContracts(31,'duel-probability'),{type:'begin',commandId:'begin',expectedRevision:0});
  const legacy=applyContractCommand(begun,{type:'sign',contract:'J',commandId:'sign',expectedRevision:1});
  expect(legacy.phase).toBe('result');
  game.contracts=legacy;
  await load(page,game,12);

  const upgrade=page.getByRole('button',{name:'Jugar al duelo nuevo'});
  await expect(upgrade).toBeInViewport({timeout:5000});
  await upgrade.click();
  const dialog=page.getByRole('dialog');
  await expect(dialog).toContainText('Conservás tus sellos');
  await dialog.getByRole('button',{name:'Seguir con mi partida'}).click();
  expect((await saved(page)).contracts).toEqual(legacy);
  await expect(upgrade).toBeFocused();

  await upgrade.click();
  await dialog.getByRole('button',{name:'Empezar el duelo nuevo'}).click();
  await expect(page.getByRole('heading',{name:'Elegí una tarjeta'})).toBeVisible();
  await expect(upgrade).toHaveCount(0);
  expect((await saved(page)).seals).toEqual(game.seals);
  await page.getByTestId('doble-begin').click();
  await expect(page.getByText('Partida 1 de 8',{exact:true})).toBeVisible();
  await expect(page.getByText('Usá la pregunta como guía. Podés elegir cualquier tarjeta.')).toBeVisible();
  await page.getByTestId('contract-C').click();
  await page.getByTestId('doble-sign').click();
  const after=await saved(page);
  expect(after.contracts?.duel?.rounds).toHaveLength(1);
  expect(after.contracts?.duel?.rounds[0]).toMatchObject({player:'C',correct:false});
  await page.reload();
  await page.getByTestId('continue-game').click();
  expect((await saved(page)).contracts).toEqual(after.contracts);
});

test('Doble explains payouts before play and an eight-answer streak adds one point',async({page})=>{
  test.setTimeout(120_000);
  await page.setViewportSize({width:640,height:360});
  let game=createGame(5);
  while(game.phase!=='complete'){
    game=game.phase==='choose'?choose(game,bestChoices(game)[0] as 0|1):advance(game);
  }
  game.settings.reducedMotion=true;
  game.settings.volume=0;
  await load(page,game);
  await page.getByTestId('enter-contracts').click();
  await expect(page.getByRole('heading',{name:'Elegí una tarjeta'})).toBeVisible();
  await expect(page.getByText('Seguro te da 2 puntos',{exact:false})).toBeInViewport();
  await expect(page.getByText('Se aplican los pagos de las tarjetas.')).toBeInViewport();
  await expect(page.getByTestId('doble-begin')).toBeInViewport();
  const before=await saved(page);
  const practice=page.getByTestId('doble-practice');
  await practice.click();
  const dialog=page.getByRole('dialog');
  await dialog.getByRole('button',{name:/Arriesgado/}).click();
  await expect(dialog.getByRole('status')).toContainText('Vos: 24 · Doble: 1');
  await dialog.getByRole('button',{name:'Probar otra tarjeta'}).click();
  await dialog.getByRole('button',{name:/Apostador/}).click();
  await expect(dialog.getByRole('status')).toContainText('Vos: 0 · Doble: 0');
  await dialog.getByRole('button',{name:'Siguiente ejemplo'}).click();
  await expect(dialog).toContainText('Primer dado: 2');
  await dialog.getByRole('button',{name:/Apostador/}).click();
  await expect(dialog.getByRole('status')).toContainText('5 en promedio');
  await expect(dialog.getByRole('status')).toContainText('Vos: 10 · Doble: 0');
  await dialog.getByRole('button',{name:'Ver cómo ganar'}).click();
  await expect(dialog).toContainText('1 punto extra');
  await dialog.getByRole('button',{name:'Terminar práctica'}).click();
  await expect(practice).toBeFocused();
  expect(await saved(page)).toEqual(before);

  await page.getByTestId('doble-begin').click();
  let total=0;
  for(let round=0;round<8;round++){
    await expect(page.getByText(`Partida ${round+1} de 8`,{exact:true})).toBeVisible();
    let answer=['S','C','J','J','S','C','J','S'][round];
    if(round===3||round===7){
      await page.getByTestId('doble-roll-first').click();
      const first=(await saved(page)).contracts!.duel!.first!;
      await expect(page.getByText(`Primer dado: ${first}`,{exact:true})).toBeInViewport();
      answer=round===3?(first>=2&&first<=4?'C':'J'):(first===6?'C':'S');
    }
    await page.getByTestId(`contract-${answer}`).click();
    await page.getByTestId('doble-sign').click();
    const played=(await saved(page)).contracts!;
    const points=Math.max(0,diceDuelPoints(round<4?0:1,answer as 'S'|'C'|'J',played.pair!));
    if(round===0)expect(points).toBe(2);
    total+=points;
    await expect(page.getByTestId('doble-duel-feedback')).toContainText(points>0?'Solo vos cobrás':'Ambos suman 0');
    await expect(page.getByTestId('doble-merit')).toHaveText(`${round+1}/8`);
    await expect(page.getByTestId('doble-balance')).toHaveText(String(total));
    await expect(page.getByTestId('doble-rival-score')).toHaveText('0');
    await expect(page.getByTestId('doble-next')).toBeInViewport();
    await page.getByTestId('doble-next').click();
  }
  await expect(page.getByTestId('doble-completion')).toContainText('Ocho aciertos: +1 punto');
  await expect(page.getByTestId('doble-balance')).toHaveText(String(total+1));
  expect((await saved(page)).seals?.contracts).toBe(true);
  await page.reload();
  await page.getByTestId('continue-game').click();
  await expect(page.getByTestId('doble-balance')).toHaveText(String(total+1));
  await expect(page.getByTestId('enter-records')).toBeEnabled();
});

for(const {seed,win} of [{seed:3,win:true},{seed:10,win:false}]){
  test(`Doble plays exactly eight rounds and ${win?'unlocks Ada':'offers practice and a rematch'}`,async({page})=>{
    test.setTimeout(100_000);
    await page.setViewportSize(win?{width:1280,height:720}:{width:640,height:360});
    const game=createGame(5);
    game.settings.reducedMotion=true;
    game.settings.volume=0;
    game.seals={urns:true,contracts:false};
    game.activeTable='contracts';
    game.contracts=createContracts(seed,'duel');
    await load(page,game);
    await expect(page.getByRole('heading',{name:'Elegí una tarjeta'})).toBeVisible();
    await page.getByTestId('doble-tutorial-next').click();
    await expect(page.getByRole('heading',{name:'Sumá puntos'})).toBeVisible();
    await page.getByTestId('doble-tutorial-next').click();
    await expect(page.getByRole('heading',{name:'Ganale en ocho partidas'})).toBeVisible();
    await page.getByTestId('doble-tutorial-next').click();

    for(let i=0;i<8;i++){
      await expect(page.getByText(`Partida ${i+1} de 8`,{exact:true})).toBeVisible();
      if(i===0){
        await expect(page.getByTestId('contract-C')).toContainText('+10 puntos · Si suman 5, 6 u 8');
        await expect(page.getByTestId('contract-J')).toContainText('+24 puntos · Si suman justo 7');
      }
      if(i===4){
        await expect(page.getByTestId('contract-S')).toContainText('+5 puntos · Si suman 9 o menos');
        await expect(page.getByTestId('contract-C')).toContainText('Si no, perdés 2');
        await expect(page.getByTestId('contract-J')).toContainText('+15 puntos');
      }
      if(i===3||i===7){
        await expect(page.getByTestId('contract-S')).toBeDisabled();
        await page.getByTestId('doble-roll-first').click();
        const before=(await saved(page)).contracts!;
        await expect(page.getByTestId('dice-status')).toContainText(`Dado 1: ${before.duel!.first} · Falta el segundo`);
        await expect.poll(()=>page.evaluate(()=>((window.__THEGAME_METRICS__?.() as {diceFaces?:number[][]})?.diceFaces??[]).length)).toBe(1);
        if(i===3&&win){
          await page.reload();
          await page.getByTestId('continue-game').click();
          expect((await saved(page)).contracts).toEqual(before);
          await expect(page.getByTestId('dice-status')).toContainText(`Dado 1: ${before.duel!.first}`);
        }
      }else await expect(page.getByTestId('doble-roll-first')).toHaveCount(0);
      await page.getByTestId('contract-S').click();
      await page.getByTestId('doble-sign').click();
      await expect(page.getByTestId('doble-duel-feedback')).toContainText('Doble');
      const current=(await saved(page)).contracts!;
      expect(current.duel!.rounds).toHaveLength(i+1);
      await expect(page.getByTestId('dice-status')).toContainText(`Suma ${current.pair![0]+current.pair![1]}`);
      await expect(page.getByTestId('doble-next')).toBeInViewport();
      await page.getByTestId('doble-next').click();
    }
    if(win){
      await expect(page.getByTestId('doble-completion')).toContainText('Le ganaste a Doble');
      await expect(page.getByTestId('doble-balance')).toHaveText('28');
      await expect(page.getByTestId('doble-rival-score')).toHaveText('13');
      await page.getByTestId('enter-records').click();
      await expect(page.getByTestId('records-begin')).toBeVisible();
    }else{
      await expect(page.getByTestId('doble-retry')).toContainText('Doble ganó esta vez');
      await expect(page.getByTestId('enter-records')).toHaveCount(0);
      await page.getByRole('button',{name:'Ver el tutorial de Doble'}).click();
      const guide=page.getByRole('dialog');
      await expect(guide).toContainText('El mismo par de dados cuenta para los dos');
      await guide.getByRole('button',{name:'Siguiente'}).click();
      await guide.getByRole('button',{name:'Siguiente'}).click();
      await expect(guide.getByRole('link',{name:/ejemplo con dos dados/})).toBeVisible();
      await page.getByTestId('close-dialog').click();
      await page.getByTestId('doble-replay').click();
      await expect(page.getByRole('heading',{name:'Elegí una tarjeta'})).toBeVisible();
      expect((await saved(page)).contracts!.duel!.rounds).toHaveLength(0);
    }
  });
}

test('the new boss keeps the first die on reload and presents the second set of offers',async({page})=>{
  const game=createGame(5);
  game.settings.reducedMotion=true;
  game.settings.volume=0;
  game.seals={urns:true,contracts:true,records:true};
  game.activeTable='finale';
  let finale=createFinale(3,'boss-v3');
  const send=(type:FinaleCommand['type'],choice?:FinaleCommand['choice'])=>
    applyFinaleCommand(finale,{type,expectedRevision:finale.revision,commandId:`prep-${finale.revision}`,...(choice?{choice}:{})});
  finale=send('begin');
  for(let i=0;i<48&&!bossNeedsFirstDie(finale);i++){
    finale=finale.phase==='feedback'?send('next'):send('choose',bossMechanic(finale)==='poker'?'straight-flush':bestFinale(finale)[0]);
  }
  expect(bossNeedsFirstDie(finale)).toBe(true);
  game.finale=finale;
  await load(page,game);
  await expect(page.getByTestId('finale-confirm')).toHaveCount(0);
  await page.getByTestId('finale-roll-first').click();
  const before=(await saved(page)).finale!;
  await expect(page.getByTestId('finale-C')).toContainText('Apostador');
  await expect(page.getByText(`Salió un ${before.boss!.firstDie}. ¿Qué puede salir en el segundo?`)).toBeVisible();
  await page.reload();
  await page.getByTestId('continue-game').click();
  expect((await saved(page)).finale).toEqual(before);
  await page.getByTestId('finale-S').click();
  await page.getByTestId('finale-confirm').click();
  expect((await saved(page)).finale!.pair![0]).toBe(before.boss!.firstDie);
  finale=(await saved(page)).finale!;
  for(let i=0;i<20&&!(finale.round===3&&bossMechanic(finale)==='dice');i++){
    finale=finale.phase==='feedback'?send('next'):send('choose',bossMechanic(finale)==='poker'?'straight-flush':bestFinale(finale)[0]);
  }
  expect(finale.round).toBe(3);
  const state=await saved(page);
  await page.evaluate(({key,state})=>localStorage.setItem(key,JSON.stringify({schemaVersion:11,contentVersion:'campaign-doble-duel-v11',state})),{key:saveKey,state:{...state,finale}});
  await page.reload();
  await page.getByTestId('continue-game').click();
  await expect(page.getByTestId('finale-J')).toContainText('Dados iguales');
  await expect(page.getByTestId('finale-J')).toContainText('+15');
});
