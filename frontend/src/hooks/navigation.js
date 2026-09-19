// One place to invert the requested wheel direction later if desired.
export const WHEEL_DIRECTION = -1;
export const WHEEL_PIXELS_PER_SCENE = 1050;
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export function wheelProgress(position, delta, length) {
  return clamp(position + WHEEL_DIRECTION * delta / WHEEL_PIXELS_PER_SCENE, 0, length - 1);
}
export function remapProgress(position, oldIds, newIds) {
  const index = Math.round(position);
  const id = oldIds[index] ?? 'home';
  const next = newIds.indexOf(id);
  return clamp((next >= 0 ? next : newIds.indexOf('contact')) + (position - index), 0, newIds.length - 1);
}
export function scenePose(distance, full) {
  const absolute = Math.abs(distance);
  if (!full) return { opacity: distance > -.5 && distance <= .5 ? 1 : 0, transform: 'none' };
  // The outgoing text clears before incoming text becomes legible: no double headings.
  const opacity = distance < 0 ? clamp(1 - (absolute - .12) / .30, 0, 1) : clamp(1 - (absolute - .18) / .40, 0, 1);
  return { opacity, transform: `translate3d(${distance * 14}px,0,${-distance * 180}px) scale(${1 - distance * .07})` };
}
