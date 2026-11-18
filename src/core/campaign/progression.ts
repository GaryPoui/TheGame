import type {GameState} from '../game';
export type TableId='urns'|'contracts'|'records'|'finale';
export function tableUnlocked(s:GameState,id:TableId):boolean {
  if(id==='urns')return true;
  const urns=s.seals?.urns===true||s.phase==='complete';
  const contracts=s.seals?.contracts===true||s.contracts?.phase==='complete';
  const records=s.seals?.records===true||s.records?.phase==='complete';
  return id==='contracts'?urns:id==='records'?urns&&contracts:urns&&contracts&&records;
}
/** A completed independent attempt always survives later assisted practice. */
export function checkpointCampaign(s:GameState):GameState {
 const next=structuredClone(s);
 next.seals={...s.seals,urns:s.seals?.urns===true||s.phase==='complete',contracts:s.seals?.contracts===true||s.contracts?.phase==='complete',records:s.seals?.records===true||s.records?.phase==='complete'};
 for(const id of ['urns','contracts','records'] as const){
   const done=id==='urns'?s.phase==='complete':s[id]?.phase==='complete';
   const assisted=id==='urns'?s.assisted:s[id]?.assisted;
   const field=`${id}Method` as const;
   if(done&&next.seals[field]!=='independent')next.seals[field]=assisted?'assisted':'independent';
 }
 if(s.finale?.phase==='complete'){next.freed=true;if(s.freedomMethod!=='independent')next.freedomMethod=s.finale.assisted?'assisted':'independent';}
 return next;
}
