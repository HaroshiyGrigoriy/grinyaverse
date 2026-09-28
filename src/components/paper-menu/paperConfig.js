export const PAPER_CONFIG = Object.freeze({
  seed: 19940821,
  meshSegments: { mobile: [80, 120], desktop: [120, 180], low: [64, 96] },
  openCrumple: 0.27,
  minimumCrumple: 0.25,
  animationDuration: 1180,
  closeDuration: 930,
  foldStrength: 1,
  mediumStrength: 1,
  wrinkleStrength: 1,
  edgeCurl: 1,
  paperColor: '#ece2ca',
  roughness: 0.91,
  lightIntensity: 2.6,
  shadowQuality: { mobile: 512, desktop: 1024, low: 256 },
  shadow: true,
  pixelRatioCap: { mobile: 1.5, desktop: 1.75, low: 1 },
  fieldResolution: [256, 384],
});

// UV rectangles are shared by the printed texture, raycasting and keyboard controls.
// onSelect receives an item before routing, so About can later open a paper preview.
export const PAPER_MENU_ITEMS = Object.freeze([
  { id: 'about', label: 'ОБО МНЕ', href: '/about/', number: '01', bounds: [0.10, 0.25, 0.90, 0.385] },
  { id: 'projects', label: 'ПРОЕКТЫ', href: '/projects/', number: '02', bounds: [0.10, 0.405, 0.90, 0.54] },
  { id: 'work', label: 'РАБОТА', href: '/projects/#work', number: '03', bounds: [0.10, 0.56, 0.90, 0.695] },
  { id: 'tips', label: 'ЧАЕВЫЕ', href: '/tips/', number: '04', bounds: [0.10, 0.715, 0.90, 0.85] },
]);

export function chooseQuality(width = window.innerWidth) {
  const memory = navigator.deviceMemory;
  const cores = navigator.hardwareConcurrency;
  if ((memory && memory <= 2) || (cores && cores <= 2)) return 'low';
  return width <= 700 ? 'mobile' : 'desktop';
}
