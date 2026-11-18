/** Locally synthesized audio; no recordings, remote assets or gameplay RNG. */
export const dbGain=(db:number):number=>Math.pow(10,db/20);
export class GameAudio {
 private context:AudioContext|null=null;
 private master:GainNode|null=null;
 private ui:GainNode|null=null;
 private ambience:GainNode|null=null;
 private volume=.35;
 private active=false;
 setVolume(value:number):void{this.volume=Math.max(0,Math.min(1,value));if(this.master&&this.context)this.master.gain.setTargetAtTime(this.volume===0?0:dbGain(-6)*this.volume,this.context.currentTime,.03);}
 private start():AudioContext|null {
  if(this.volume===0)return null;
  try{
   if(!this.context){
    const c=new AudioContext();this.context=c;this.master=c.createGain();this.ui=c.createGain();this.ambience=c.createGain();
    this.ui.gain.value=dbGain(-20);this.ambience.gain.value=0;
    this.ui.connect(this.master);this.ambience.connect(this.master);this.master.connect(c.destination);this.setVolume(this.volume);
    for(const hz of [110,164.81]){const osc=c.createOscillator();osc.type='sine';osc.frequency.value=hz;osc.connect(this.ambience);osc.start();}
   }
   void this.context.resume();return this.context;
  }catch{return null;}
 }
 setAmbience(active:boolean):void{
  this.active=active;
  if(this.ambience&&this.context)this.ambience.gain.setTargetAtTime(active?dbGain(-42):0,this.context.currentTime,.5);
 }
 tone(correct=true):void{
  const c=this.start();if(!c||!this.ui)return;
  this.setAmbience(this.active);
  const osc=c.createOscillator(),gain=c.createGain();osc.type='sine';osc.frequency.value=correct?523.25:261.63;
  gain.gain.setValueAtTime(0,c.currentTime);gain.gain.linearRampToValueAtTime(.9,c.currentTime+.025);gain.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.3);
  osc.connect(gain).connect(this.ui);osc.onended=()=>{osc.disconnect();gain.disconnect();};osc.start();osc.stop(c.currentTime+.32);
 }
 suspend():void {if(this.context)void this.context.suspend();}
}
