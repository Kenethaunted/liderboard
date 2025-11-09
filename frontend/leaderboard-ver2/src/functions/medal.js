export const medalForPlace = (place) => {
  if (place === 1) return { bg: 'bg-amber-300', text: 'text-amber-900', medal: '🥇' };
  if (place === 2) return { bg: 'bg-slate-300', text: 'text-slate-900', medal: '🥈' };
  if (place === 3) return { bg: 'bg-orange-400', text: 'text-amber-900', medal: '🥉' };
  return { bg: '', text: '' };
}