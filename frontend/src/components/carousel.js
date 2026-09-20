export const wrapProject = (index, count) => count ? ((index % count) + count) % count : 0;
export function swipeDirection(dx, dy, width) {
  return Math.abs(dx) > Math.max(42, Math.min(width * .12, 100)) && Math.abs(dx) > Math.abs(dy) * 1.3 ? (dx < 0 ? 1 : -1) : 0;
}
