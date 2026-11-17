export const ESCAPE_DURATION=6400;
/** Cosmetic only; independent of campaign state and RNG. */
export function escapeFrame(elapsed:number){
 const p=Math.max(0,Math.min(1,elapsed/ESCAPE_DURATION)),walk=p*p*(3-2*p),sway=Math.sin(p*Math.PI*12)*Math.sin(p*Math.PI);
 return {progress:p,x:sway*.035,y:1.65+Math.abs(sway)*.025,z:-7.5+12*walk,doorAngle:Math.min(1,p/.48)*Math.PI*.6};
}
