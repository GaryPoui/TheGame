import {build} from 'vite';
import {readFileSync,writeFileSync,readdirSync,existsSync} from 'node:fs';
const output='.tools/clear-ui/full-dist';
const uri=path=>{if(!existsSync('public/'+path))return null;const mime=path.endsWith('.svg')?'image/svg+xml':path.endsWith('.jpg')?'image/jpeg':'image/png';return `data:${mime};base64,${readFileSync('public/'+path).toString('base64')}`;};
await build({build:{outDir:output,emptyOutDir:true,rolldownOptions:{output:{codeSplitting:false}}},logLevel:'error',plugins:[{
 name:'local-test-assets',enforce:'pre',transform(code,id){
  if(!id.includes('/src/')&&!id.includes('\\src\\'))return;
  if(id.endsWith('.ts'))return code.replace(/import\.meta\.env\.BASE_URL\s*\+\s*(['"])([^'"]+)\1/g,(m,q,path)=>uri(path)?JSON.stringify(uri(path)):m).replace(/\$\{import\.meta\.env\.BASE_URL\}((?:art|textures)\/[\w.-]+)/g,(m,path)=>uri(path)||m);
  if(id.endsWith('.css'))return code.replace(/url\((['"]?)\/?((?:art|textures)\/[\w.-]+)\1\)/g,(m,q,path)=>uri(path)?`url("${uri(path)}")`:m);
 }
}]});
let html=readFileSync(output+'/index.html','utf8');
html=html.replace(/<script[^>]*src="([^"]+)"[^>]*><\/script>/,(_,path)=>`<script type="module">${readFileSync(output+'/'+path,'utf8').replaceAll('</script','<\\/script')}</script>`);
html=html.replace(/<link[^>]*stylesheet[^>]*href="([^"]+)"[^>]*>/,(_,path)=>`<style>${readFileSync(output+'/'+path,'utf8')}</style>`);
html=html.replace(/src="\.\/([^" ]+)"/g,(m,path)=>uri(path)?`src="${uri(path)}"`:m);
writeFileSync(output+'/standalone.html',html);
console.log(JSON.stringify({output:output+'/standalone.html',chunks:readdirSync(output+'/assets').filter(n=>n.endsWith('.js')).length}));
