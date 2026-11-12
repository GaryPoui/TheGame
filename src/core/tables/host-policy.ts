import type {Urn} from '../game';
import {bestContracts} from '../math/dice';
import type {FinaleChoice} from './finale';
export interface HostPublicTask {round:number;step:number;urns:readonly [Urn,Urn]}
/** No seed, RNG or hidden future belongs to this interface. */
export function hostPolicy(task:HostPublicTask):FinaleChoice[]{
 if(task.round===0){const [a,b]=task.urns,d=a.red*(b.red+b.blue)-b.red*(a.red+a.blue);return d===0?['U','V']:d>0?['U']:['V'];}
 if(task.round===1)return bestContracts(task.step===0?'atLeast4':'expected');
 return [task.step===0?'archive':'close'];
}
