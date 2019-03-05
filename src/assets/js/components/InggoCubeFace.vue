<template>
  <section :class="faceClass" :id="faceID">
    <cube-controls :current-face="face.faceClass"></cube-controls>
    <div :class="{
      'face-content-container': true,
      'is-overflowed': showZoom
    }" ref="container">
      <div class="face-contents">
        <a v-if="showZoom" class="show-zoom" @click="toggleZoom">
          <span class="icon">
            <i class="icon-zoom-in"></i>
          </span>
        </a>
        <transition name="fade">
          <component
            ref="contents"
            v-show="!modalActive"
            :is="currentView"
            :content="content"
            :overflow="showZoom"
            :is-visible="isVisible"
          ></component>
        </transition>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'InggoCubeFace',
  props: {
    face: {
      timeout: null,
      type: Object,
      default: {
        faceClass: 'front'
      }
    }
  },
  computed: {
    currentView () {
      return 'content-' + this.faceID;
    },
    faceClass () {
      var classes = {
        'is-visible': this.isVisible
      };
      classes[this.face.faceClass] = true;
      return classes;
    },
    faceID () {
      return this.$store.state.faceContents[this.face.faceClass]['content-type'];
    },
    isVisible () {
      return this.face.faceClass == this.$store.state.visibleFace;
    },
    isMobile () {
      return window.innerWidth < 768;
    },
    content () {
      return this.$store.state.faceContents[this.face.faceClass].content;
    },
    modalActive () {
      return this.$store.state.modalContents;
    },
    showZoom () {
      return this.$store.state.faceContents[this.face.faceClass].showZoom;
    }
  },
  methods: {
    toggleZoom () {
      this.$store.commit('setModal', this.$refs.contents.$el.innerHTML);
    }
  }
}
</script>

