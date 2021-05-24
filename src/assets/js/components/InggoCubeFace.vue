<template>
  <section :class="faceClass" :id="faceID">
    <cube-controls
      :current-face="face.faceClass"
      @set-face="faceChanged"
    ></cube-controls>
    <div :class="{
      'face-content-container': true,
      'is-overflowed': showZoom,
      'is-currently-shown': isVisible
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
            @toggle-zoom="toggleZoom"
            @content-displayed="contentDisplayed"
          ></component>
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
export default {
  name: 'InggoCubeFace',
  props: {
    face: {
      timeout: null,
      type: Object,
      default: {
        faceClass: 'front',
        showCover: false
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
      return this.faceContents['content-type'];
    },
    isVisible () {
      return this.face.faceClass == this.$store.state.visibleFace;
    },
    isMobile () {
      return window.innerWidth < 768;
    },
    faceContents () {
      return this.$store.state.faceContents[this.face.faceClass];
    },
    content () {
      return this.faceContents.content;
    },
    modalActive () {
      return this.$store.state.modalContents;
    },
    showZoom () {
      return this.$store.state.faceContents[this.face.faceClass].showZoom;
    }
  },
  methods: {
    contentDisplayed (payload) {
      this.$emit('face-loaded', payload);
    },
    toggleZoom () {
      this.$store.commit('setModal', this.$refs.contents.$el.innerHTML);
    },
    faceChanged (payload) {
      this.$emit('set-face', payload);
    }
  }
}
</script>

