export interface Statistics { n: number; total: number; mean: number; range: number; fours: number; relativeFrequency: number }
/** Descriptive statistics only. No sample size establishes a mechanism. */
export function statistics(values: readonly number[]): Statistics {
  if (!values.length || values.some(v => !Number.isFinite(v))) throw new Error('Invalid sample');
  const total = values.reduce((a,b) => a+b,0), fours = values.filter(v=>v===4).length;
  return { n: values.length, total, mean: total/values.length, range: Math.max(...values)-Math.min(...values), fours, relativeFrequency: fours/values.length };
}
