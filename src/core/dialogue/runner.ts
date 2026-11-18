import {validateDialogue,type DialogueGraph} from '../../content/dialogue-schema';
export interface DialogueCommand {id:string;revision:number;type:'next'|'skip';choice?:string}
export interface DialogueState {graphId:string;node:string;ended:boolean;effects:string[];history:string[];revision:number;journal:DialogueCommand[]}
export function createDialogue(g:DialogueGraph):DialogueState {
 if(!validateDialogue(g))throw Error('Invalid dialogue graph');
 return {graphId:g.id,node:g.start,ended:false,effects:[],history:[g.start],revision:0,journal:[]};
}
export function applyDialogue(g:DialogueGraph,s:DialogueState,c:DialogueCommand):DialogueState {
 if(!c||s.graphId!==g.id||s.ended||c.revision!==s.revision||typeof c.id!=='string'||!c.id.length||c.id.length>80||s.journal.some(x=>x.id===c.id)||!['next','skip'].includes(c.type))return s;
 const node=g.nodes.find(n=>n.id===s.node);if(!node)return s;
 const next=structuredClone(s);
 if(c.type==='skip'){
   // Only explicitly declared effects exist; no script/eval or gameplay reward.
   next.effects=[...new Set([...s.effects,...g.nodes.flatMap(n=>n.effect?[n.effect]:[])])];next.ended=true;
 }else{
   const destination=node.choices?node.choices.find(x=>x.id===c.choice)?.to:node.next;
   if(node.choices&&!destination)return s;
   if(node.effect&&!next.effects.includes(node.effect))next.effects.push(node.effect);
   if(destination){next.node=destination;next.history.push(destination);}else next.ended=true;
 }
 next.revision++;next.journal.push(structuredClone(c));return next;
}
export function validDialogue(g:DialogueGraph,value:unknown):value is DialogueState {
 if(!value||typeof value!=='object')return false;const s=value as DialogueState;if(!Array.isArray(s.journal)||s.journal.length>32)return false;
 try{let replay=createDialogue(g);for(const c of s.journal){const next=applyDialogue(g,replay,c);if(next===replay)return false;replay=next;}return JSON.stringify(replay)===JSON.stringify(s);}catch{return false;}
}
