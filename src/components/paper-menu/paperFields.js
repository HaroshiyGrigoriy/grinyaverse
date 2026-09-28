import { DataTexture, RGBAFormat, HalfFloatType, LinearFilter, DataUtils } from 'three';

export function seededRandom(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (x) => x * x * (3 - 2 * x);
function hash(x, y, seed) {
  let n = Math.imul(x + 15731, 73856093) ^ Math.imul(y + seed, 19349663);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ n >>> 16) >>> 0) / 4294967295;
}
export function noise(x, y, seed = 81) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = ease(x - ix), fy = ease(y - iy);
  return lerp(lerp(hash(ix, iy, seed), hash(ix + 1, iy, seed), fx), lerp(hash(ix, iy + 1, seed), hash(ix + 1, iy + 1, seed), fx), fy) * 2 - 1;
}
function makeCreases(random, count, width, amplitude, length) {
  return Array.from({ length: count }, () => {
    const angle = random() * Math.PI * 2;
    return { x: random() * 1.2 - .6, y: random() * 1.2 - .6,
      nx: Math.cos(angle), ny: Math.sin(angle),
      width: width * (.45 + random()), length: length * (.5 + random()),
      amplitude: amplitude * (.45 + random() * .8) * (random() > .48 ? 1 : -1),
      bend: (random() - .5) * .19 };
  });
}
function creaseField(x, y, creases) {
  let z = 0;
  for (const crease of creases) {
    const dx = x - crease.x, dy = y - crease.y;
    const along = dx * -crease.ny + dy * crease.nx;
    const across = dx * crease.nx + dy * crease.ny + crease.bend * along * along;
    // A softened cusp, not a sine wave: flat shoulders meet a narrow ridge.
    const distance = Math.sqrt(across * across + .000006);
    const taper = Math.exp(-Math.pow(along / crease.length, 4));
    z += crease.amplitude * Math.pow(Math.max(0, 1 - distance / (crease.width * 2.2)), 1.35) * taper;
  }
  return z;
}

export function createPaperFields(config) {
  const random = seededRandom(config.seed);
  const macro = makeCreases(random, 26, .063, .057, .30);
  const medium = makeCreases(random, 74, .013, .017, .12);
  const micro = makeCreases(random, 105, .004, .0035, .05);
  const [width, height] = config.fieldResolution;
  const floats = new Float32Array(width * height * 4);
  const data = new Uint16Array(floats.length);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const u = x / (width - 1), v = y / (height - 1), px = u - .5, py = v - .5;
    const edge = Math.pow(Math.max(Math.abs(px), Math.abs(py)) * 2, 5);
    // Text areas are calmer, but even their interiors keep all three scales.
    const calm = .66 + edge * .6;
    const i = (y * width + x) * 4;
    floats[i] = (creaseField(px, py, macro) + noise(u * 3, v * 4, config.seed) * .011) * calm;
    floats[i + 1] = creaseField(px, py, medium) * (.85 + edge * .35);
    floats[i + 2] = creaseField(px, py, micro) + noise(u * 75, v * 100, config.seed) * .0013;
    const corners = Math.pow(Math.abs(px) * 2, 7) * Math.pow(Math.abs(py) * 2, 5);
    floats[i + 3] = edge * (.023 + noise(u * 5, v * 7, config.seed) * .018) + corners * .047;
    for (let channel = 0; channel < 4; channel++) {
      data[i + channel] = DataUtils.toHalfFloat(floats[i + channel]);
      floats[i + channel] = DataUtils.fromHalfFloat(data[i + channel]);
    }
  }
  const texture = new DataTexture(data, width, height, RGBAFormat, HalfFloatType);
  texture.minFilter = texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return { texture, floats, width, height };
}
