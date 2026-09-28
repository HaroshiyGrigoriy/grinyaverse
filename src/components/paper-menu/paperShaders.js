// The visible and shadow passes use the SAME deformation. No CPU vertex updates.
export const deformationGLSL = /* glsl */`
uniform sampler2D uFoldFields;
uniform vec2 uPaperSize;
uniform vec2 uFieldSize;
uniform vec4 uFoldStrength;
uniform float uCrumple;
uniform float uDirection;
varying vec2 vPaperUV;
varying float vPaperHeight;

vec3 paperPosition(vec2 st) {
  vec2 q = st - .5;
  vec4 f = texture2D(uFoldFields, (clamp(st, vec2(0.), vec2(1.)) * (uFieldSize - 1.) + .5) / uFieldSize);
  float height = dot(f, uFoldStrength);
  float memory = max(.25, uCrumple) / .27;
  float edge = pow(max(abs(q.x), abs(q.y)) * 2., 6.);
  vec3 opened = vec3(
    (q.x + edge * .006 * sin(q.y * 37. + q.x * 9.)) * uPaperSize.x,
    (q.y + edge * .004 * sin(q.x * 31. - q.y * 11.)) * uPaperSize.y,
    height * uPaperSize.x * memory
  );
  float c = clamp((uCrumple - .27) / .73, 0., 1.);
  float pulse = sin(c * 3.14159265);
  // Independent regions open at different times; on closing the edges lead.
  float delay = q.x * .22 - q.y * .17 + sin(q.x * 9. + q.y * 5.) * .085;
  float closingBias = uDirection < 0. ? edge * .20 - .075 : 0.;
  float regional = clamp(c + pulse * (delay + closingBias), 0., 1.);
  float theta = q.x * 12.5 + q.y * 1.8 + sin(q.y * 10.) * .55;
  float phi = q.y * 10.8 - q.x * 2.2 + sin(q.x * 8.) * .60;
  float r = uPaperSize.x * clamp(.145 + f.x * 1.6 + f.y * 2.3 + f.z * 2., .065, .25);
  float tx = mix(sin(theta), asin(sin(theta)) * .63661977, .72);
  float ty = mix(sin(phi), asin(sin(phi)) * .63661977, .72);
  float tz = mix(cos(theta) * cos(phi), asin(cos(theta + phi * .32)) * .63661977, .56);
  vec3 knot = vec3(
    tx * r + sin(phi * 1.7) * r * .17,
    ty * r * .95 + cos(theta * 1.3) * r * .13,
    tz * r + sin(theta + phi) * r * .24
  );
  // Hinged intermediate lobes leave the plane before gathering into the knot.
  opened.z += pulse * uPaperSize.x * (.23 * abs(q.x - .3 * q.y) + .12 * sin(q.y * 7.));
  opened.x += pulse * uPaperSize.x * .12 * sin(q.y * 9. + q.x * 5.);
  return mix(opened, knot, regional);
}
`;
export const normalGLSL = /* glsl */`
vec2 paperST = uv;
float paperEpsilon = .0024;
vec3 paperTangent = paperPosition(paperST + vec2(paperEpsilon, 0.)) - paperPosition(paperST - vec2(paperEpsilon, 0.));
vec3 paperBitangent = paperPosition(paperST + vec2(0., paperEpsilon)) - paperPosition(paperST - vec2(0., paperEpsilon));
vec3 objectNormal = normalize(cross(paperTangent, paperBitangent));
#ifdef USE_TANGENT
  vec3 objectTangent = normalize(paperTangent);
#endif
`;
export const positionGLSL = /* glsl */`
vec3 transformed = paperPosition(uv);
vPaperUV = uv;
vPaperHeight = transformed.z / uPaperSize.x;
`;

// The geometry pass has correct smooth normals; fibre bump is only sub-pixel detail.
export function patchPaperShader(shader, uniforms, depth = false) {
  Object.assign(shader.uniforms, uniforms);
  shader.vertexShader = deformationGLSL + shader.vertexShader;
  shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', positionGLSL);
  if (!depth) {
    shader.vertexShader = shader.vertexShader.replace('#include <beginnormal_vertex>', normalGLSL);
    shader.fragmentShader = 'varying vec2 vPaperUV;\nvarying float vPaperHeight;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      if (!gl_FrontFacing) diffuseColor.rgb = diffuse * .98;
      // Subtle recess occlusion, over and above the real directional shadows.
      float recess = smoothstep(-.08, .025, vPaperHeight);
      diffuseColor.rgb *= mix(.91, 1., recess);
    `);
  }
}
