import { PlaneGeometry, Mesh, MeshBasicMaterial, DoubleSide, Raycaster, Vector2, Vector3 } from 'three';
import { PAPER_MENU_ITEMS } from './paperConfig.js';

function sample(fields, u, v) {
  const x = Math.min(1, Math.max(0, u)) * (fields.width - 1), y = Math.min(1, Math.max(0, v)) * (fields.height - 1);
  const ix = Math.floor(x), iy = Math.floor(y), dx = x - ix, dy = y - iy;
  const output = [];
  for (let c = 0; c < 4; c++) {
    const at = (xx, yy) => fields.floats[(Math.min(fields.height - 1, yy) * fields.width + Math.min(fields.width - 1, xx)) * 4 + c];
    output[c] = (at(ix, iy) * (1 - dx) + at(ix + 1, iy) * dx) * (1 - dy) + (at(ix, iy + 1) * (1 - dx) + at(ix + 1, iy + 1) * dx) * dy;
  }
  return output;
}

// CPU mirror of the shader, evaluated only when settling/resizing/debugging.
// Raycaster cannot see vertex shader displacement on the original flat geometry.
export function paperPoint(u, v, fields, size, config, crumple, direction = 1) {
  const x = u - .5, y = v - .5, f = sample(fields, u, v), edge = Math.pow(Math.max(Math.abs(x), Math.abs(y)) * 2, 6);
  const height = f[0] * config.foldStrength + f[1] * config.mediumStrength + f[2] * config.wrinkleStrength + f[3] * config.edgeCurl;
  const c = Math.max(0, Math.min(1, (crumple - .27) / .73)), pulse = Math.sin(c * Math.PI);
  const delay = x * .22 - y * .17 + Math.sin(x * 9 + y * 5) * .085;
  const local = Math.max(0, Math.min(1, c + pulse * (delay + (direction < 0 ? edge * .20 - .075 : 0))));
  const theta = x * 12.5 + y * 1.8 + Math.sin(y * 10) * .55;
  const phi = y * 10.8 - x * 2.2 + Math.sin(x * 8) * .60;
  const r = size.x * Math.max(.065, Math.min(.25, .145 + f[0] * 1.6 + f[1] * 2.3 + f[2] * 2));
  const tx = .28 * Math.sin(theta) + .72 * Math.asin(Math.sin(theta)) * .63661977;
  const ty = .28 * Math.sin(phi) + .72 * Math.asin(Math.sin(phi)) * .63661977;
  const tz = .44 * Math.cos(theta) * Math.cos(phi) + .56 * Math.asin(Math.cos(theta + phi * .32)) * .63661977;
  const open = [
    (x + edge * .006 * Math.sin(y * 37 + x * 9)) * size.x + pulse * size.x * .12 * Math.sin(y * 9 + x * 5),
    (y + edge * .004 * Math.sin(x * 31 - y * 11)) * size.y,
    height * size.x * Math.max(.25, crumple) / .27 + pulse * size.x * (.23 * Math.abs(x - .3 * y) + .12 * Math.sin(y * 7)),
  ];
  const knot = [tx * r + Math.sin(phi * 1.7) * r * .17,
    ty * r * .95 + Math.cos(theta * 1.3) * r * .13,
    tz * r + Math.sin(theta + phi) * r * .24];
  return open.map((n, i) => n * (1 - local) + knot[i] * local);
}
export function createPaperHitTest(fields) {
  const geometry = new PlaneGeometry(1, 1, 80, 120);
  const material = new MeshBasicMaterial({ side: DoubleSide });
  const mesh = new Mesh(geometry, material);
  const raycaster = new Raycaster(), mouse = new Vector2();
  const point = new Vector3();
  return {
    rebuild(paper, size, config, crumple, direction) {
      const uv = geometry.attributes.uv, position = geometry.attributes.position;
      for (let i = 0; i < position.count; i++) position.setXYZ(i, ...paperPoint(uv.getX(i), uv.getY(i), fields, size, config, crumple, direction));
      position.needsUpdate = true;
      geometry.computeBoundingSphere(); geometry.computeBoundingBox();
      paper.updateMatrixWorld(); mesh.matrix.copy(paper.matrixWorld); mesh.matrixAutoUpdate = false; mesh.updateMatrixWorld(true);
    },
    pick(clientX, clientY, rect, camera) {
      mouse.set((clientX - rect.left) / rect.width * 2 - 1, 1 - (clientY - rect.top) / rect.height * 2);
      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.intersectObject(mesh, false)[0];
      if (!hit) return { paper: false, index: -1 };
      const x = hit.uv.x, y = 1 - hit.uv.y;
      return { paper: true, index: PAPER_MENU_ITEMS.findIndex(({ bounds: [l, t, r, b] }) => x >= l && x <= r && y >= t && y <= b) };
    },
    projectControls(paper, size, config, crumple, direction, camera, width, height) {
      paper.updateMatrixWorld();
      return PAPER_MENU_ITEMS.map(({ bounds: [l, t, r, b] }) => {
        const points = [[l, t], [r, t], [l, b], [r, b]].map(([u, v]) => {
          point.set(...paperPoint(u, 1 - v, fields, size, config, crumple, direction));
          point.applyMatrix4(paper.matrixWorld).project(camera);
          return [(point.x + 1) * .5 * width, (1 - point.y) * .5 * height];
        });
        const left = Math.min(...points.map(p => p[0])), top = Math.min(...points.map(p => p[1]));
        return { left, top, width: Math.max(...points.map(p => p[0])) - left, height: Math.max(...points.map(p => p[1])) - top };
      });
    },
    dispose() { geometry.dispose(); material.dispose(); },
  };
}
