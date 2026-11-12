import {chromium} from '@playwright/test';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createServer} from 'vite';

// Offline HTML smoke check. No HTTP server, requests, or WebGL assertions.
mkdirSync('.tools/clear-ui',{recursive:true});
const root=resolve('dist'),read=p=>readFileSync(p,'utf8');
let html=read(root+'/index.html');
const script=html.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/)[0];
const scriptPath=script.match(/src="([^"]+)"/)[1];
const css=html.match(/<link[^>]*stylesheet[^>]*>/)[0];
const cssPath=css.match(/href="([^"]+)"/)[1];
let styles=read(root+'/'+cssPath.replace(/^\//,''));
styles=styles.replace(/url\((['"]?)([^)'" ]+)\1\)/g,(m,q,path)=>{
 if(path.startsWith('data:'))return m;
 try {const ext=path.split('.').pop(),bytes=readFileSync(root+'/'+path.replace(/^\//,''));return `url("data:image/${ext};base64,${bytes.toString('base64')}")`;}catch{return m;}
});
html=html.replace(script,'').replace(css,`<style>${styles}</style>`).replace(/<link[^>]*modulepreload[^>]*>/g,'');
html=html.replace(/src="\.\/([^" ]+)"/g,(m,path)=>{try{return `src="data:image/png;base64,${readFileSync(root+'/'+path).toString('base64')}"`;}catch{return m;}});
writeFileSync('.tools/clear-ui/offline.html',html);
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,headless:true});
const results=[];
const modules=await createServer({server:{middlewareMode:true},appType:'custom'});
const {createContracts,applyContractCommand}=await modules.ssrLoadModule('/src/core/tables/contracts.ts');
const {contractsView}=await modules.ssrLoadModule('/src/ui/contracts.ts');
const {createRecords}=await modules.ssrLoadModule('/src/core/tables/records.ts');
const {recordsView}=await modules.ssrLoadModule('/src/ui/records.ts');
const {createFinale}=await modules.ssrLoadModule('/src/core/tables/finale.ts');
const {endingView}=await modules.ssrLoadModule('/src/ui/ending.ts');
let contracts=createContracts(1);contracts=applyContractCommand(contracts,{type:'begin',expectedRevision:contracts.revision,commandId:'offline-begin'});
const extraViews={contracts:contractsView(contracts,null,null),records:recordsView(createRecords(1),null),finale:endingView(createFinale(1),null,false)};
for(const [width,height] of [[1366,768],[390,844]]){
 const page=await browser.newPage({viewport:{width,height}});
 await page.goto(pathToFileURL(resolve('.tools/clear-ui/offline.html')).href);
 await page.evaluate(()=>localStorage.clear());
 // Inline only the preloader; the dynamic scene import remains unavailable in this fixture.
 const code=read(root+'/'+scriptPath.replace(/^\//,'')).replace(/import\{t as (\w+)\}from"\.\/preload-helper-[^"]+";/,'const $1=(loader)=>loader();');
 await page.addScriptTag({type:'module',content:code});
 await page.waitForSelector('[data-testid=new-game]');
 const fit=async(mode)=>{results.push({mode,width,height,...await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,panels:[...document.querySelectorAll('.game-panel,.modal-body')].map(el=>({height:el.clientHeight,scroll:el.scrollHeight}))}))});await page.screenshot({path:`.tools/clear-ui/offline-${mode}-${width}.png`,fullPage:true});};
 await fit('menu');
 await page.getByTestId('settings-button').click();await fit('settings');await page.getByRole('tab',{name:'Sonido',exact:true}).click();await page.getByTestId('volume').fill('0');
 await page.getByRole('tab',{name:'Pantalla',exact:true}).click();await page.getByTestId('reduced-motion').check();await page.getByTestId('close-dialog').click();
 await page.getByTestId('new-game').click();await page.getByTestId('skip-intro').click();await fit('room');await page.getByTestId('enter-urns').click();await page.getByTestId('toggle-cards').click();await fit('tutorial');
 await page.getByTestId('demo-urn-0').click();await page.getByTestId('tutorial-next').click();await fit('tutorial-feedback');await page.getByTestId('tutorial-next').click();await page.getByTestId('toggle-cards').click();await page.getByTestId('demo-urn-1').click();await page.getByTestId('tutorial-next').click();await fit('tutorial-recap');await page.getByTestId('tutorial-next').click();
 await page.getByTestId('toggle-cards').click();await fit('urns');await page.getByTestId('urn-1').click();await page.getByTestId('confirm-choice').click();await fit('urn-feedback');
 await page.getByRole('button',{name:'Repasar el tema y ver un video'}).click();await fit('review');await page.getByTestId('close-dialog').click();
 for(const [mode,content] of Object.entries(extraViews)){
  await page.evaluate(({mode,content})=>{document.body.dataset.screen=mode;document.querySelector('#app').innerHTML='<header class="topbar"><button class="quiet">Ajustes</button></header>'+content;scrollTo(0,0);},{mode,content});await fit(mode);
 }
 await page.close();
}
writeFileSync('.tools/clear-ui/offline-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));await browser.close();await modules.close();
