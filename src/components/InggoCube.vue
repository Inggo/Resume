<template>
  <div class="app-container">
    <CubeControls
      :is-mobile="true"
      v-show="loaded"
      @set-face="faceChanged"
    />
    <div class="main-container">
      <transition name="start" @after-enter="loadingComplete">
        <div :class="cubeClass" v-show="loading || loaded">
          <CubeFace
            v-for="(face, idx) in faces"
            :face="face"
            :key="face.id"
            :ref="(el) => { if (el) faceRefs[idx] = el; }"
            @face-loaded="setControls"
            @set-face="faceChanged"
          />
        </div>
      </transition>
    </div>
    <transition name="fade">
      <PageControls
        :has-prev="hasPrev"
        :has-next="hasNext"
        v-if="showPagination"
        @prev="prev"
        @next="next"
      />
    </transition>
    <transition name="fade-zoom">
      <Modal v-show="modalContents" :contents="modalContents" />
    </transition>
    <div class="app-print"></div>
  </div>
</template>

<script>
import CubeControls from './InggoCubeControls.vue';
import CubeFace from './InggoCubeFace.vue';
import PageControls from './InggoPageControls.vue';
import Modal from './InggoModal.vue';

export default {
  name: 'InggoCube',
  components: { CubeControls, CubeFace, PageControls, Modal },
  data() {
    return {
      hasNext: false,
      hasPrev: false,
      loading: false,
      loaded: false,
      faceRefs: [],
      faces: [
        { id: 0, faceClass: 'front' },
        { id: 1, faceClass: 'back' },
        { id: 2, faceClass: 'right' },
        { id: 3, faceClass: 'left' },
        { id: 4, faceClass: 'top' },
        { id: 5, faceClass: 'bottom' },
      ],
    };
  },
  computed: {
    cubeClass() {
      return {
        'cube-container': true,
        loading: this.loading,
        active: this.loaded,
        'show-front':  this.loaded && this.visibleFace == 'front',
        'show-back':   this.loaded && this.visibleFace == 'back',
        'show-right':  this.loaded && this.visibleFace == 'right',
        'show-left':   this.loaded && this.visibleFace == 'left',
        'show-top':    this.loaded && this.visibleFace == 'top',
        'show-bottom': this.loaded && this.visibleFace == 'bottom',
      };
    },
    modalContents() { return this.$store.state.modalContents; },
    visibleFace() { return this.$store.state.visibleFace; },
    currentContents() {
      const face = this.faces.find((f) => f.faceClass == this.visibleFace);
      if (!face) return null;
      const faceCmp = this.faceRefs[face.id];
      return faceCmp ? faceCmp.$refs.contents : null;
    },
    showPagination() {
      return this.loaded && (this.hasPrev || this.hasNext);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.loading = true;
    });
  },
  beforeUnmount() {
    if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler);
  },
  methods: {
    prev() { if (this.currentContents) this.currentContents.prev(); },
    next() { if (this.currentContents) this.currentContents.next(); },
    faceChanged() {
      this.$nextTick(() => {
        if (this.currentContents && typeof this.currentContents.contentDisplayed == 'function') {
          this.currentContents.contentDisplayed();
        } else {
          this.hasPrev = false;
          this.hasNext = false;
        }
      });
    },
    transitionToFace(dir) {
      const faces = this.$store.state.faceContents;
      const currentFace = faces[this.$store.state.visibleFace];
      this.$store.commit('setVisibleFace', currentFace[dir]);
      this.faceChanged();
    },
    loadingComplete() {
      this.loaded = true;
      this.loading = false;

      for (let i = 0; i < this.faces.length; i++) {
        const faceCmp = this.faceRefs[i];
        if (!faceCmp) continue;
        const ref = faceCmp.$refs.contents;
        if (ref && typeof ref.checkVerticalOverflows == 'function') {
          ref.checkVerticalOverflows();
        }
      }

      this._keyHandler = (e) => {
        switch (e.key) {
          case 'Up':
          case 'ArrowUp':
            this.transitionToFace('prev');
            break;
          case 'Down':
          case 'ArrowDown':
            this.transitionToFace('next');
            break;
        }
      };
      document.addEventListener('keydown', this._keyHandler);
    },
    setControls(ev = { hasPrev: false, hasNext: false }) {
      this.hasPrev = ev.hasPrev;
      this.hasNext = ev.hasNext;
    },
  },
};
</script>
