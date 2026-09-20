// Stable ordering uses only years explicitly present in the supplied dates.
export function newestFirst(entries) {
  const rank = entry => entry.date === 'En cours' ? Infinity : Math.max(...(entry.date.match(/\d{4}/g) || []).map(Number));
  return [...entries].sort((a, b) => rank(b) - rank(a));
}
