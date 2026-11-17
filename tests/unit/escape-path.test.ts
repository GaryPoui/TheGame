import {it,expect} from 'vitest';
import {escapeFrame,ESCAPE_DURATION} from '../../src/presentation/escape-path';
it('walks forward through the open doorway with bounded camera motion and a fixed end',()=>{
 let previous=-Infinity;
 for(let t=0;t<=ESCAPE_DURATION;t+=100){const f=escapeFrame(t);expect(f.z).toBeGreaterThanOrEqual(previous);expect(Math.abs(f.x)).toBeLessThanOrEqual(.035);expect(f.y).toBeGreaterThanOrEqual(1.65);expect(f.y).toBeLessThanOrEqual(1.675);if(f.z>=0)expect(f.doorAngle).toBeGreaterThan(Math.PI/2);previous=f.z;}
 expect(escapeFrame(-1)).toEqual(escapeFrame(0));expect(escapeFrame(ESCAPE_DURATION+1000)).toEqual(escapeFrame(ESCAPE_DURATION));expect(escapeFrame(ESCAPE_DURATION).z).toBe(4.5);
});
