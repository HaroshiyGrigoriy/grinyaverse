export const clamp = (x, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
export const smooth = (x) => { const t = clamp(x); return t * t * (3 - 2 * t); };

// The small 0.255 -> 0.29 -> 0.27 settling movement retains the crease memory.
const opening = [[0, 1], [.12, .92], [.28, .78], [.46, .58], [.62, .42], [.76, .31], [.86, .255], [.94, .29], [1, .27]];
const closing = [[0, .27], [.15, .34], [.34, .49], [.59, .72], [.82, .91], [1, 1]];
export function crumpleAt(time, direction, openCrumple = .27) {
  const keys = direction === 'open' ? opening : closing;
  const t = clamp(time);
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [a, va] = keys[i - 1], [b, vb] = keys[i];
      const value = va + (vb - va) * smooth((t - a) / (b - a));
      // Keep the deliberately nonzero endpoint adjustable without flattening.
      return clamp(value + (openCrumple - .27) * (1 - value) / .73, .25, 1);
    }
  }
  return direction === 'open' ? openCrumple : 1;
}
