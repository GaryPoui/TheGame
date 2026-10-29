export function dieFace(value: number | null, name: string): string {
  const patterns: Record<number, number[]> = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
  return `<span class="dice-face" role="img" aria-label="${name}: ${value ?? 'sin tirar'}">${Array.from({ length: 9 }, (_, i) => `<i class="${value !== null && patterns[value]?.includes(i) ? 'pip' : ''}"></i>`).join('')}</span>`;
}
