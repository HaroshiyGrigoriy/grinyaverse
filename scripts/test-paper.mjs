import assert from 'node:assert/strict';
import { Vector2, Vector3, PlaneGeometry, Mesh, OrthographicCamera } from 'three';
import { PAPER_CONFIG, PAPER_MENU_ITEMS } from '../src/components/paper-menu/paperConfig.js';
import { crumpleAt } from '../src/components/paper-menu/paperAnimation.js';
import { createPaperFields } from '../src/components/paper-menu/paperFields.js';
import { createPaperHitTest, paperPoint } from '../src/components/paper-menu/paperHitTest.js';

for (const direction of ['open', 'close']) {
  const values = Array.from({ length: 1001 }, (_, i) => crumpleAt(i / 1000, direction));
  assert.ok(Math.min(...values) >= .25);
  assert.ok(Math.max(...values) <= 1);
  assert.equal(values.at(-1), direction === 'open' ? .27 : 1);
}
const fields = createPaperFields(PAPER_CONFIG), repeat = createPaperFields(PAPER_CONFIG);
assert.deepEqual(fields.floats, repeat.floats, 'A seed must reproduce exactly the same folds');
const size = new Vector2(4, 8);
for (const crumple of [.25, .27, .42, .78, 1]) {
  const points = [];
  for (let y = 0; y <= 40; y++) for (let x = 0; x <= 30; x++) {
    const point = paperPoint(x / 30, y / 40, fields, size, PAPER_CONFIG, crumple);
    assert.ok(point.every(Number.isFinite)); points.push(point);
  }
  const spans = [0, 1, 2].map(axis => Math.max(...points.map(p => p[axis])) - Math.min(...points.map(p => p[axis])));
  assert.ok(spans[2] > .12, 'Even the fully open geometry must retain physical depth');
  if (crumple === 1) {
    assert.ok(spans[0] < size.x * .55 && spans[1] < size.y * .55, 'The vertices themselves must gather into a knot');
  }
  console.log('crumple', crumple, 'xyz spans', spans.map(n => n.toFixed(3)).join(', '));
}
const hit = createPaperHitTest(fields), paper = new Mesh(new PlaneGeometry(1, 1));
const camera = new OrthographicCamera(-3, 3, 5, -5, .1, 50); camera.position.z = 15; camera.updateMatrixWorld();
hit.rebuild(paper, size, PAPER_CONFIG, .27, 1);
PAPER_MENU_ITEMS.forEach((item, index) => {
  const [l, t, r, b] = item.bounds;
  const point = new Vector3(...paperPoint((l+r)/2, 1-(t+b)/2, fields, size, PAPER_CONFIG, .27)).project(camera);
  const pick = hit.pick((point.x+1)*300, (1-point.y)*500, {left:0, top:0, width:600, height:1000}, camera);
  assert.equal(pick.index, index, `Raycast should select ${item.label} on the deformed sheet`);
});
hit.dispose(); fields.texture.dispose(); repeat.texture.dispose(); paper.geometry.dispose(); paper.material.dispose();
console.log('PASS: timeline, residual depth, deterministic folds, real knot compaction and four raycast targets.');
