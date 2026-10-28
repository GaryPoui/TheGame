import type {RecordsChoice,RecordsState} from './records';
export const photoRound=(s:RecordsState)=>s.assisted?s.round===0?0:1:s.round;
export function photoChoices(s:RecordsState):RecordsChoice[]{
 const r=photoRound(s);
 if(r===1||r===3&&s.step===0)return ['yes','no'];
 if(s.step===0||r===3)return ['archive','album'];
 return ['close','certainty'];
}
export function photoBest(s:RecordsState):RecordsChoice[]{
 const r=photoRound(s);
 return r===1||r===3&&s.step===0?['no']:s.step===0||r===3?['archive']:['close'];
}
export function preparePhotos(s:RecordsState):void{
 const r=photoRound(s);s.source=r===0||r===2?'album':'complete';
 s.observations=r===0||r===2?[4,4,4,4]:r===1?[0,0,0,0]:s.variant==='repeat'?[4,0,4,4,0,4,4,0]:[4,4,0,4,0,0,4,0];
}
export function revealPhotos(s:RecordsState):void{
 if(s.step===0&&(photoRound(s)===0||photoRound(s)===2)){
  s.source='complete';s.observations=photoRound(s)===0?[4,4,4,4,0,0,0,0]:[4,0,0,4,0,4,0,4];
 }
}
