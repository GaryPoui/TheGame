export interface DialogueNode {id:string;speaker:string;lineId:string;next:string|null;choices?:readonly {id:string;lineId:string;to:string}[];effect?:'released'}
export interface DialogueGraph {id:string;start:string;nodes:readonly DialogueNode[];strings:Readonly<Record<string,string>>}
export function validateDialogue(graph:DialogueGraph):boolean {
 const nodes=new Map(graph.nodes.map(n=>[n.id,n]));if(nodes.size!==graph.nodes.length||!nodes.has(graph.start))return false;
 const visiting=new Set<string>(),done=new Set<string>();
 function visit(id:string):boolean {
   if(visiting.has(id))return false;if(done.has(id))return true;
   const n=nodes.get(id);if(!n||!graph.strings[n.lineId]||!n.speaker||n.effect!==undefined&&n.effect!=='released')return false;
   visiting.add(id);
   const links=n.choices?.map(c=>c.to)??(n.next?[n.next]:[]);
   if(n.choices&&(!n.choices.length||new Set(n.choices.map(c=>c.id)).size!==n.choices.length||n.choices.some(c=>!graph.strings[c.lineId])))return false;
   if(!links.every(visit))return false;visiting.delete(id);done.add(id);return true;
 }
 return graph.nodes.every(n=>visit(n.id));
}
