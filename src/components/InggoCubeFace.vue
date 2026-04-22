<template>
  <section :class="faceClass" :id="faceID">
    <CubeControls
      :current-face="face.faceClass"
      @set-face="faceChanged"
    />
    <div
      :class="{
        'face-content-container': true,
        'is-overflowed': showZoom,
        'is-currently-shown': isVisible,
      }"
      ref="container"
    >
      <div class="face-contents">
        <a v-if="showZoom" class="show-zoom" @click="toggleZoom">
          <span class="icon"><i class="icon-zoom-in"></i></span>
        </a>
        <transition name="fade">
          <component
            ref="contents"
            v-show="!modalActive"
            :is="currentView"
            :content="content"
            :overflow="showZoom"
            :is-visible="isVisible"
            @toggle-zoom="toggleZoom"
            @content-displayed="contentDisplayed"
          />
        </transition>
      </div>
    </div>
    <transition name="cover">
      <div class="face-cover" v-if="faceContents.cover" v-show="!isVisible">
        <div class="face-cover-bg">
          <h2>
            <span class="icon" v-if="faceContents.icon">
              <i :class="faceContents.icon"></i>
            </span>
            {{ faceContents.name }}
          </h2>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import CubeControls from './InggoCubeControls.vue';
import ContentBio from './InggoContentBio.vue';
import ContentWork from './InggoContentWork.vue';
import ContentEducation from './InggoContentEduc.vue';
import ContentPortfolio from './InggoContentFolio.vue';
import ContentSkills from './InggoContentSkills.vue';
import ContentLinks from './InggoContentLinks.vue';

export default {
  name: 'InggoCubeFace',
  emits: ['face-loaded', 'set-face'],
  components: {
    CubeControls,
    'content-bio': ContentBio,
    'content-work': ContentWork,
    'content-education': ContentEducation,
    'content-portfolio': ContentPortfolio,
    'content-skills': ContentSkills,
    'content-links': ContentLinks,
  },
  props: {
    face: {
      type: Object,
      default: () => ({ faceClass: 'front', showCover: false }),
    },
  },
  computed: {
    currentView() { return 'content-' + this.faceID; },
    faceClass() {
      const classes = { 'is-visible': this.isVisible };
      classes[this.face.faceClass] = true;
      return classes;
    },
    faceID() { return this.faceContents['content-type']; },
    isVisible() { return this.face.faceClass == this.$store.state.visibleFace; },
    faceContents() { return this.$store.state.faceContents[this.face.faceClass]; },
    content() { return this.faceContents.content; },
    modalActive() { return this.$store.state.modalContents; },
    showZoom() { return this.$store.state.faceContents[this.face.faceClass].showZoom; },
  },
  methods: {
    contentDisplayed(payload) { this.$emit('face-loaded', payload); },
    toggleZoom() { this.$store.commit('setModal', this.$refs.contents.$el.innerHTML); },
    faceChanged(payload) { this.$emit('set-face', payload); },
  },
};
</script>
