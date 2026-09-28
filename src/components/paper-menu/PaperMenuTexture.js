import { CanvasTexture, DataTexture, RGBAFormat, RepeatWrapping, SRGBColorSpace, LinearFilter, LinearMipmapLinearFilter } from 'three';
import { PAPER_MENU_ITEMS } from './paperConfig.js';
import { seededRandom } from './paperFields.js';

export function createPaperMenuTexture(aspect, quality, seed) {
  const canvas = document.createElement('canvas');
  canvas.width = quality === 'desktop' ? 1536 : 1024;
  canvas.height = Math.min(3072, Math.round(canvas.width / aspect));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Paper texture canvas unavailable');
  const background = document.createElement('canvas');
  background.width = canvas.width; background.height = canvas.height;
  const bg = background.getContext('2d');
  const grain = bg.createImageData(canvas.width, canvas.height);
  const random = seededRandom(seed);
  for (let i = 0; i < grain.data.length; i += 4) {
    const value = 252 + Math.floor(random() * 4);
    grain.data[i] = grain.data[i + 1] = grain.data[i + 2] = value;
    grain.data[i + 3] = 255;
  }
  bg.putImageData(grain, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = quality === 'desktop' ? 4 : 2;
  let active = -1, keyboard = false, disposed = false;
  function draw() {
    if (disposed) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h); ctx.drawImage(background, 0, 0);
    ctx.fillStyle = '#382b27';
    ctx.font = `600 ${Math.min(w * .047, h * .030)}px Oswald, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillText('GRINYAVERSE / MENU', w * .12, h * .125);
    ctx.strokeStyle = '#826e5b'; ctx.lineWidth = w * .0013;
    ctx.beginPath(); ctx.moveTo(w * .12, h * .175); ctx.lineTo(w * .88, h * .175); ctx.stroke();
    for (let i = 0; i < PAPER_MENU_ITEMS.length; i++) {
      const item = PAPER_MENU_ITEMS[i], b = item.bounds;
      const y = (b[1] + b[3]) / 2 * h;
      ctx.fillStyle = '#4e352d';
      ctx.font = `500 ${Math.min(w * .029, h * .020)}px Manrope, sans-serif`;
      ctx.fillText(item.number, w * .12, y - h * .012);
      ctx.fillStyle = active === i ? '#78213d' : '#362626';
      ctx.font = `600 ${Math.min(w * .151, h * .088)}px Oswald, sans-serif`;
      ctx.fillText(item.label, w * .205, y, w * .66);
      ctx.strokeStyle = active === i ? '#78213d' : '#b6a691';
      ctx.lineWidth = active === i ? w * .003 : w * .0009;
      ctx.beginPath(); ctx.moveTo(w * .12, b[3] * h); ctx.lineTo(w * .88, b[3] * h); ctx.stroke();
      if (active === i && keyboard) {
        ctx.save(); ctx.strokeStyle = '#77213e'; ctx.lineWidth = w * .0025;
        ctx.setLineDash([w * .009, w * .005]);
        ctx.strokeRect(w * .093, b[1] * h, w * .816, (b[3] - b[1]) * h);
        ctx.restore();
      }
    }
    ctx.fillStyle = '#49352c';
    ctx.font = `700 ${Math.min(w * .035, h * .025)}px Manrope, sans-serif`;
    ctx.fillText('ЛИЧНЫЙ ВЫПУСК / 01', w * .12, h * .917);
    texture.needsUpdate = true;
  }
  draw();
  const fontsReady = Promise.all([
    document.fonts.load('600 120px Oswald', 'ОБО МНЕ ПРОЕКТЫ РАБОТА ЧАЕВЫЕ'),
    document.fonts.load('700 24px Manrope', 'GRINYAVERSE'),
  ]).then(draw).catch(() => {});
  return { texture, fontsReady,
    setActive(index, fromKeyboard = false) {
      if (active === index && keyboard === fromKeyboard) return false;
      active = index; keyboard = fromKeyboard; draw(); return true;
    },
    dispose() { disposed = true; texture.dispose(); canvas.width = canvas.height = background.width = background.height = 1; },
  };
}

export function createFibreTexture(seed) {
  const size = 256, data = new Uint8Array(size * size * 4), random = seededRandom(seed + 1);
  for (let i = 0; i < data.length; i += 4) {
    const grain = 238 + Math.floor(random() * 18);
    data[i] = data[i + 1] = data[i + 2] = grain; data[i + 3] = 255;
  }
  const texture = new DataTexture(data, size, size, RGBAFormat);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(4, 6);
  texture.magFilter = LinearFilter; texture.minFilter = LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}
