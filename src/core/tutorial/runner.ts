export type TutorialPhase='predict'|'decide'|'observe'|'explain'|'apply';
export const TUTORIAL_PHASES:readonly TutorialPhase[]=['predict','decide','observe','explain','apply'];
export interface TutorialState {phase:TutorialPhase;helpIds:string[];finished:boolean}
export function createTutorial():TutorialState{return {phase:'predict',helpIds:[],finished:false};}
export function advanceTutorial(s:TutorialState):TutorialState {if(s.finished)return s;const i=TUTORIAL_PHASES.indexOf(s.phase);return i===4?{...s,finished:true}:{...s,phase:TUTORIAL_PHASES[i+1]!};}
export function requestHelp(s:TutorialState,id:string):TutorialState{return !id||s.helpIds.includes(id)?s:{...s,helpIds:[...s.helpIds,id]};}
