<template>
  <div class="gallery" @click.self="close">
    <div class="gallery-toolbar">
      <button class="gallery-btn" @click="zoomOut" title="Zoom out (-)">
        <AppIcon name="zoom-out" />
      </button>
      <button
        class="gallery-btn gallery-btn--text"
        @click="togglePercent"
        :title="zoom === 1 ? 'Fit to screen' : 'Show at 100% (natural size)'"
      >
        <transition name="zoom-text" mode="out-in">
          <span :key="zoomPercent">{{ zoomPercent }}</span>
        </transition>
      </button>
      <button class="gallery-btn" @click="zoomIn" title="Zoom in (+)">
        <AppIcon name="zoom-in" />
      </button>
      <button class="gallery-btn hide-gallery" @click="close" title="Close (Esc)">
        <AppIcon name="close" />
      </button>
    </div>

    <div class="gallery-stage" ref="stage" @wheel="onWheel" @click.self="close">
      <div class="gallery-canvas" ref="canvas" @click.self="close">
        <transition :name="slideName">
          <div class="gallery-slide" v-if="currentUrl" :key="currentUrl" @click.self="close">
            <img
              :src="currentUrl"
              :style="imgStyle"
              :class="{ 'gallery-img--animated': animateZoom }"
              :alt="'Image ' + (index + 1)"
              @load="onLoad"
              draggable="false"
            />
          </div>
        </transition>
      </div>
    </div>

    <template v-if="hasMultiple">
      <button class="gallery-nav gallery-nav--prev" title="Previous (←)" @click="prev">
        <span class="icon"><AppIcon name="left" /></span>
      </button>
      <button class="gallery-nav gallery-nav--next" title="Next (→)" @click="next">
        <span class="icon"><AppIcon name="right" /></span>
      </button>
      <div class="gallery-counter">{{ index + 1 }} / {{ images.length }}</div>
    </template>
  </div>
</template>

<script>
import { imageUrl } from '../utils/images.js';

const ZOOM_MIN  = 0.05;
const ZOOM_MAX  = 8;
const ZOOM_STEP = 1.25;

export default {
  name: 'InggoGallery',
  data() {
    return {
      zoom: 1,
      naturalW: 0,
      naturalH: 0,
      animateZoom: false,
      // Direction of the most recent navigation; drives which way the image
      // slides during the <transition>. Starts as 'next' so the very first
      // image enters from the right (consistent with click-Next behaviour).
      direction: 'next',
    };
  },
  computed: {
    images()      { return this.$store.state.galleryImages; },
    index()       { return this.$store.state.galleryIndex; },
    hasMultiple() { return this.images.length > 1; },
    currentUrl()  { return this.images[this.index] ? imageUrl(this.images[this.index]) : null; },
    zoomPercent() { return Math.round(this.zoom * 100) + '%'; },
    imgStyle() {
      if (!this.naturalW) return null;
      return {
        width:  (this.naturalW * this.zoom) + 'px',
        height: (this.naturalH * this.zoom) + 'px',
      };
    },
    slideName() { return 'slide-' + this.direction; },
  },
  watch: {
    index()  { this.resetForNewImage(); },
    images() { this.resetForNewImage(); },
  },
  mounted() {
    document.addEventListener('keydown', this.onKey);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.onKey);
  },
  methods: {
    close() { this.$store.commit('closeGallery'); },
    prev() { this.slide('prev', 'galleryPrev'); },
    next() { this.slide('next', 'galleryNext'); },
    slide(direction, mutation) {
      this.direction = direction;
      // Snap the outgoing image back to fit (and scroll home) so the carousel
      // animates clean, viewport-sized frames even if the user had zoomed and
      // panned. Committing on the next tick lets the outgoing element
      // re-render at fit *before* it freezes as the leaving slide.
      this.animateZoom = false;
      if (this.$refs.stage) this.$refs.stage.scrollTo(0, 0);
      this.fitToStage();
      this.$nextTick(() => this.$store.commit(mutation));
    },
    zoomIn()  { this.zoom = Math.min(this.zoom * ZOOM_STEP, ZOOM_MAX); },
    zoomOut() { this.zoom = Math.max(this.zoom / ZOOM_STEP, ZOOM_MIN); },
    // Toggle the percentage chip: anything-but-100% jumps to 100%, exactly
    // 100% snaps back to best-fit. Lets the user flip between actual size
    // and fit-to-screen with one click.
    togglePercent() {
      if (this.zoom === 1) this.fitToStage();
      else this.zoom = 1;
    },
    resetForNewImage() {
      // Keep `zoom` AND the natural dimensions alone here. With the
      // <transition mode="out-in">, the *leaving* image is still mounted and
      // shares this component's `naturalW/naturalH` via `imgStyle`. Zeroing
      // them would strip its inline width/height mid-slide, snapping it to
      // full intrinsic size and killing the slide (Firefox just drops the
      // transform). The entering image briefly borrows the old box, but
      // `object-fit: contain` keeps it undistorted until onLoad refits it.
      this.animateZoom = false;
      if (this.$refs.stage) this.$refs.stage.scrollTo(0, 0);
    },
    onLoad(e) {
      this.animateZoom = false;
      this.naturalW = e.target.naturalWidth;
      this.naturalH = e.target.naturalHeight;
      this.fitToStage();
      this.$nextTick(() => { this.animateZoom = true; });
    },
    fitToStage() {
      const canvas = this.$refs.canvas;
      const stage = this.$refs.stage;
      if (!canvas || !stage || !this.naturalW) return;
      // Measure the stage (the fixed viewport), not the canvas — the canvas
      // grows to the zoomed image's size, so measuring it would just hand
      // back the current zoom instead of the true fit. Subtract the canvas
      // padding so the fitted image keeps its breathing room from the edges.
      const cs = getComputedStyle(canvas);
      const availW = stage.clientWidth
        - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const availH = stage.clientHeight
        - parseFloat(cs.paddingTop)  - parseFloat(cs.paddingBottom);
      if (availW <= 0 || availH <= 0) return;
      this.zoom = Math.min(availW / this.naturalW, availH / this.naturalH, 1);
    },
    onWheel(e) {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      if (e.deltaY < 0) this.zoomIn();
      else this.zoomOut();
    },
    onKey(e) {
      switch (e.key) {
        case 'Escape': this.close(); break;
        case 'ArrowLeft':  case 'Left':  if (this.hasMultiple) this.prev(); break;
        case 'ArrowRight': case 'Right': if (this.hasMultiple) this.next(); break;
        case '+': case '=': this.zoomIn(); break;
        case '-': case '_': this.zoomOut(); break;
        case '0': this.togglePercent(); break;
      }
    },
  },
};
</script>
