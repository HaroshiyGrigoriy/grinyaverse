import { MeshStandardMaterial, MeshDepthMaterial, DoubleSide, RGBADepthPacking, Vector2, Vector4 } from 'three';
import { patchPaperShader } from './paperShaders.js';

export function createPaperMaterial(config, fields, printed, fibre) {
  const uniforms = {
    uFoldFields: { value: fields.texture },
    uFieldSize: { value: new Vector2(fields.width, fields.height) },
    uPaperSize: { value: new Vector2(3, 5) },
    uFoldStrength: { value: new Vector4(config.foldStrength, config.mediumStrength, config.wrinkleStrength, config.edgeCurl) },
    uCrumple: { value: 1 }, uDirection: { value: 1 },
  };
  const material = new MeshStandardMaterial({
    color: config.paperColor, map: printed.texture,
    roughness: config.roughness, roughnessMap: fibre,
    metalness: 0, side: DoubleSide, flatShading: false, wireframe: false,
    bumpMap: fibre, bumpScale: .0006,
  });
  material.onBeforeCompile = (shader) => patchPaperShader(shader, uniforms);
  material.customProgramCacheKey = () => 'grinya-paper-pbr-v1';
  const depthMaterial = new MeshDepthMaterial({ depthPacking: RGBADepthPacking, side: DoubleSide });
  depthMaterial.onBeforeCompile = (shader) => patchPaperShader(shader, uniforms, true);
  depthMaterial.customProgramCacheKey = () => 'grinya-paper-depth-v1';
  return { material, depthMaterial, uniforms,
    dispose() { material.dispose(); depthMaterial.dispose(); },
  };
}
