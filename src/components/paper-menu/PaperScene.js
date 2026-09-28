import {
  WebGLRenderer, Scene, OrthographicCamera, PlaneGeometry, Mesh, HemisphereLight,
  DirectionalLight, ShadowMaterial, PCFShadowMap, ACESFilmicToneMapping, SRGBColorSpace,
} from 'three';
import { PAPER_CONFIG, chooseQuality } from './paperConfig.js';
import { createPaperFields } from './paperFields.js';
import { createPaperMenuTexture, createFibreTexture } from './PaperMenuTexture.js';
import { createPaperMaterial } from './PaperMaterial.js';
import { createPaperHitTest } from './paperHitTest.js';
import { clamp, smooth, crumpleAt } from './paperAnimation.js';

export class PaperScene {
  constructor(host, button, callbacks = {}) {
    this.disposed = false;
    try { this.initialize(host, button, callbacks); }
    catch (error) { this.dispose(); throw error; }
  }
  initialize(host, button, callbacks) {
    this.host = host; this.button = button; this.callbacks = callbacks;
    this.config = { ...PAPER_CONFIG }; this.quality = chooseQuality();
    this.crumple = 1; this.direction = 1; this.isOpen = false;
    this.frame = 0; this.animation = null; this.disposed = false;
    this.stats = { renders: 0, animationFrames: 0, meanFrameMs: 0, quality: this.quality };
    this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
    const attributes = { alpha: true, antialias: true, powerPreference: 'low-power', failIfMajorPerformanceCaveat: false };
    const context = this.canvas.getContext('webgl2', attributes);
    if (!context) throw new Error('WebGL 2 context unavailable');
    this.renderer = new WebGLRenderer({ canvas: this.canvas, context, ...attributes });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFShadowMap;
    this.renderer.setClearColor(0x000000, 0);
    this.canvas = this.renderer.domElement;
    this.canvas.setAttribute('aria-hidden', 'true');
    this.canvas.className = 'paper-menu-canvas';
    host.appendChild(this.canvas);
    this.renderer.debug.onShaderError = (gl, program, vertex, fragment) => {
      console.error('PaperMenu shader:', gl.getProgramInfoLog(program), gl.getShaderInfoLog(vertex), gl.getShaderInfoLog(fragment));
      queueMicrotask(() => this.fail('shader'));
    };
    this.scene = new Scene();
    this.camera = new OrthographicCamera(-5, 5, 5, -5, .1, 80);
    this.camera.position.z = 20;
    this.fields = createPaperFields(this.config);
    this.printed = createPaperMenuTexture(.65, this.quality, this.config.seed);
    this.fibre = createFibreTexture(this.config.seed);
    this.paperMaterial = createPaperMaterial(this.config, this.fields, this.printed, this.fibre);
    this.paper = new Mesh(new PlaneGeometry(1, 1, ...this.config.meshSegments[this.quality]), this.paperMaterial.material);
    this.paper.customDepthMaterial = this.paperMaterial.depthMaterial;
    this.paper.castShadow = true; this.paper.receiveShadow = true;
    // Its vertex shader leaves the original PlaneGeometry bounds.
    this.paper.frustumCulled = false;
    this.scene.add(this.paper);
    this.hitTest = createPaperHitTest(this.fields);
    this.scene.add(new HemisphereLight(0xfff6e5, 0x716859, 1.45));
    this.key = new DirectionalLight(0xfff6e8, this.config.lightIntensity);
    this.key.position.set(-4, 6, 8); this.key.castShadow = true;
    this.key.shadow.mapSize.setScalar(this.config.shadowQuality[this.quality]);
    this.key.shadow.bias = -.0015; this.key.shadow.normalBias = .04;
    this.key.shadow.radius = 3;
    Object.assign(this.key.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: .1, far: 35 });
    this.scene.add(this.key);
    const fill = new DirectionalLight(0xe7efff, .42);
    fill.position.set(4, -2, 6); this.scene.add(fill);
    this.ground = new Mesh(new PlaneGeometry(100, 100), new ShadowMaterial({ color: 0x241b13, opacity: .31 }));
    this.ground.position.z = -.65; this.ground.receiveShadow = true; this.scene.add(this.ground);
    this.onContextLost = (event) => { event.preventDefault(); this.fail('context-lost'); };
    this.canvas.addEventListener('webglcontextlost', this.onContextLost);
    this.onScroll = () => { if (!this.isOpen && !this.animation) { this.updateTransform(); this.invalidate(); } };
    this.onVisibility = () => {
      if (document.hidden) {
        this.pausedAt = performance.now(); cancelAnimationFrame(this.frame); this.frame = 0;
      } else {
        if (this.animation && this.pausedAt) this.animation.start += performance.now() - this.pausedAt;
        this.pausedAt = null; this.invalidate();
      }
    };
    this.onMotion = () => {
      if (this.motion.matches && this.animation) this.finishAnimation();
    };
    this.onResize = () => this.resize();
    this.observer = new ResizeObserver(this.onResize); this.observer.observe(host);
    window.addEventListener('resize', this.onResize);
    window.visualViewport?.addEventListener('resize', this.onResize);
    window.addEventListener('scroll', this.onScroll, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    this.motion.addEventListener('change', this.onMotion);
    this.resize();
    this.printed.fontsReady.then(() => this.invalidate());
  }
  attach(host) {
    if (this.disposed || this.host === host) return;
    this.observer.unobserve(this.host); this.host = host;
    host.appendChild(this.canvas); this.observer.observe(host); this.resize();
  }
  resize() {
    if (this.disposed) return;
    const rect = this.host.getBoundingClientRect();
    const width = Math.max(1, rect.width), height = Math.max(1, rect.height);
    if (width < 2 || height < 2) return;
    this.width = width; this.height = height;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.config.pixelRatioCap[this.quality]));
    this.renderer.setSize(width, height, false);
    this.camera.left = -5 * width / height; this.camera.right = 5 * width / height;
    this.camera.updateProjectionMatrix();
    const paperWidth = Math.min(width * .90, height * 1.17), paperHeight = height * .86;
    const size = this.paperMaterial.uniforms.uPaperSize.value;
    size.set(paperWidth / height * 10, paperHeight / height * 10);
    const aspect = paperWidth / paperHeight;
    if (!this.aspect || Math.abs(aspect - this.aspect) > .015) {
      this.aspect = aspect;
      this.printed.dispose();
      this.printed = createPaperMenuTexture(aspect, this.quality, this.config.seed);
      this.paperMaterial.material.map = this.printed.texture;
      this.printed.fontsReady.then(() => this.invalidate());
    }
    this.updateTransform();
    if (!this.animation) this.rebuildHitTest();
    this.invalidate();
  }
  updateTransform() {
    if (!this.width) return;
    const rect = this.button.getBoundingClientRect();
    const stage = this.host.getBoundingClientRect();
    const anchorX = rect.left - 25, anchorY = rect.top + rect.height * .5;
    const ax = (anchorX - stage.left - this.width * .5) / this.height * 10;
    const ay = (this.height * .5 - anchorY + stage.top) / this.height * 10;
    const c = clamp((this.crumple - this.config.openCrumple) / (1 - this.config.openCrumple));
    const travel = smooth(1 - c);
    const size = this.paperMaterial.uniforms.uPaperSize.value;
    const ballScale = clamp(44 / (size.x * this.height / 10 * .38), .065, .6);
    const scale = ballScale + (1 - ballScale) * (1 - c);
    this.paper.scale.setScalar(scale);
    this.paper.position.set(ax * (1 - travel) - Math.sin(travel * Math.PI) * .35, ay * (1 - travel) - .06 * travel, .06);
    this.paper.rotation.set(-.065 * travel + c * .7, .09 * travel + c * .6, -.018 * travel + c * .48);
    // Avoid shadow-map acne on an almost open thin sheet at mobile map sizes.
    // The folded knot self-shadows; the sheet always casts its real ground shadow.
    this.paper.receiveShadow = c > .045;
    this.paper.visible = this.isOpen || !!this.animation || (rect.bottom > 0 && rect.top < this.height);
    this.paperMaterial.uniforms.uCrumple.value = this.crumple;
    this.paperMaterial.uniforms.uDirection.value = this.direction;
    this.ground.material.opacity = .20 + travel * .13;
  }
  setOpen(open) {
    if (this.disposed) return;
    this.isOpen = open; this.direction = open ? 1 : -1;
    this.animation = { direction: open ? 'open' : 'close', start: performance.now(), from: this.crumple,
      duration: open ? this.config.animationDuration : this.config.closeDuration, last: 0, times: [] };
    if (this.motion.matches) this.finishAnimation(); else this.invalidate();
  }
  tick = (now) => {
    this.frame = 0;
    if (this.disposed || document.hidden) return;
    const animation = this.animation;
    if (animation) {
      const t = clamp((now - animation.start) / animation.duration);
      const value = crumpleAt(t, animation.direction, this.config.openCrumple);
      const beginning = animation.direction === 'open' ? 1 : this.config.openCrumple;
      const end = animation.direction === 'open' ? this.config.openCrumple : 1;
      this.crumple = clamp(animation.from + (end - animation.from) * ((value - beginning) / (end - beginning)), .25, 1);
      this.updateTransform(); this.stats.animationFrames++;
      if (animation.last && t > .2) animation.times.push(now - animation.last);
      animation.last = now;
      if (t >= 1) {
        if (animation.times.length) this.stats.meanFrameMs = animation.times.reduce((a, b) => a + b, 0) / animation.times.length;
        this.finishAnimation();
      }
    }
    this.renderer.render(this.scene, this.camera); this.stats.renders++;
    if (this.animation) this.invalidate();
  };
  invalidate() {
    if (!this.disposed && !document.hidden && !this.frame) this.frame = requestAnimationFrame(this.tick);
  }
  finishAnimation() {
    this.crumple = this.isOpen ? this.config.openCrumple : 1;
    this.animation = null; this.updateTransform(); this.rebuildHitTest();
    // No CPU vertex work or continuous RAF remains after settling.
    if (this.stats.meanFrameMs > 48 && this.quality !== 'low') {
      this.quality = 'low'; this.stats.quality = 'low';
      this.paper.geometry.dispose();
      this.paper.geometry = new PlaneGeometry(1, 1, ...this.config.meshSegments.low);
      this.key.shadow.map?.dispose(); this.key.shadow.map = null;
      this.key.shadow.mapSize.setScalar(this.config.shadowQuality.low); this.resize();
    } else if (this.stats.meanFrameMs > 135 && this.quality === 'low') {
      this.fail('slow-device'); return;
    }
    this.callbacks.onSettled?.(this.isOpen); this.invalidate();
  }
  rebuildHitTest() {
    if (!this.isOpen || this.disposed) return;
    const size = this.paperMaterial.uniforms.uPaperSize.value;
    this.hitTest.rebuild(this.paper, size, this.config, this.crumple, this.direction);
    this.callbacks.onLayout?.(this.hitTest.projectControls(this.paper, size, this.config, this.crumple, this.direction, this.camera, this.width, this.height));
  }
  pick(clientX, clientY) {
    if (!this.isOpen || this.animation) return { paper: true, index: -1 };
    return this.hitTest.pick(clientX, clientY, this.canvas.getBoundingClientRect(), this.camera);
  }
  setActive(index, keyboard = false) {
    if (this.printed.setActive(index, keyboard)) this.invalidate();
  }
  replay() {
    this.crumple = 1; this.updateTransform(); this.setOpen(true);
  }
  updateSetting(name, value) {
    if (name === 'crumple') { this.animation = null; this.crumple = clamp(value, .25, 1); }
    else this.config[name] = value;
    const u = this.paperMaterial.uniforms;
    u.uFoldStrength.value.set(this.config.foldStrength, this.config.mediumStrength, this.config.wrinkleStrength, this.config.edgeCurl);
    this.paperMaterial.material.roughness = this.config.roughness;
    this.key.intensity = this.config.lightIntensity;
    this.key.castShadow = this.config.shadow; this.ground.visible = this.config.shadow;
    this.updateTransform(); this.rebuildHitTest(); this.invalidate();
  }
  fail(reason) {
    if (!this.disposed) this.callbacks.onError?.(reason);
  }
  dispose() {
    if (this.disposed) return; this.disposed = true;
    cancelAnimationFrame(this.frame); this.frame = 0; this.animation = null;
    this.observer?.disconnect();
    window.removeEventListener('resize', this.onResize);
    window.visualViewport?.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onScroll);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.motion?.removeEventListener('change', this.onMotion);
    this.canvas?.removeEventListener('webglcontextlost', this.onContextLost);
    this.paper?.geometry.dispose(); this.paperMaterial?.dispose();
    this.printed?.dispose(); this.fibre?.dispose(); this.fields?.texture.dispose(); this.hitTest?.dispose();
    this.ground?.geometry.dispose(); this.ground?.material.dispose(); this.key?.shadow.dispose();
    this.scene?.clear(); this.renderer?.renderLists.dispose(); this.renderer?.dispose();
    if (this.renderer?.extensions.has('WEBGL_lose_context')) this.renderer.forceContextLoss();
    this.canvas?.remove();
  }
}
