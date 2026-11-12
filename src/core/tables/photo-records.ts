import type {RecordsChoice,RecordsState} from './records';
export const photoRound=(s:RecordsState)=>s.assisted?s.round===0?0:1:s.round;
export function photoChoices(s:RecordsState):RecordsChoice[]{
 const r=photoRound(s);
 if(s.experience==='photos-v2'&&!s.assisted&&((r===2&&s.step===0)||(r===3&&s.step===0)))return ['K','V','both'];
 if(s.experience==='photos-v2'&&!s.assisted&&r===2)return ['yes','no'];
 if(r===1||r===3&&s.step===0)return ['yes','no'];
 if(s.step===0||r===3)return ['archive','album'];
 return ['close','certainty'];
}
export function photoBest(s:RecordsState):RecordsChoice[]{
 const r=photoRound(s);
 if(s.experience==='photos-v2'&&!s.assisted){if(r===2)return s.step===0?[s.variant==='repeat'?'K':'both']:['no'];if(r===3&&s.step===0)return ['V'];}
 return r===1||r===3&&s.step===0?['no']:s.step===0||r===3?['archive']:['close'];
}
export function preparePhotos(s:RecordsState):void{
 const r=photoRound(s);
 if(s.experience==='photos-v2'&&!s.assisted&&r===2){s.source='complete';s.observations=s.variant==='repeat'?[4,4,4,0]:[4,0,4,0];return;}
 s.source=r===0||r===2?'album':'complete';
 s.observations=r===0||r===2?[4,4,4,4]:r===1?[0,0,0,0]:s.variant==='repeat'?[4,0,4,4,0,4,4,0]:[4,4,0,4,0,0,4,0];
}
export function revealPhotos(s:RecordsState):void{
 if(s.experience==='photos-v2'&&!s.assisted&&photoRound(s)===2)return;
 if(s.step===0&&(photoRound(s)===0||photoRound(s)===2)){
  s.source='complete';s.observations=photoRound(s)===0?[4,4,4,4,0,0,0,0]:[4,0,0,4,0,4,0,4];
 }
}
