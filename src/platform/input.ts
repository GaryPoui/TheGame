import type {Settings} from '../core/game';
export type InputAction=keyof Settings['keys'];
export function actionForKey(keys:Settings['keys'],code:string):InputAction|null{return (Object.keys(keys) as InputAction[]).find(a=>keys[a]===code)??null;}
export function rebind(keys:Settings['keys'],action:InputAction,code:string):Settings['keys']|null {
 if(!/^(Key[A-Z]|Digit[0-9]|Arrow(Left|Right|Up|Down))$/.test(code)||Object.entries(keys).some(([a,k])=>a!==action&&k===code))return null;
 return {...keys,[action]:code};
}
