<template>
  <section :class="faceClass" :id="faceID">
    <cube-controls :current-face="face.faceClass"></cube-controls>
    <div class="face-content-container" ref="container">
      <div class="face-contents">
        <a v-if="showZoom" class="show-zoom" @click="toggleZoom">
          <span class="icon">
            <i class="icon-zoom-in"></i>
          </span>
        </a>
        <transition name="fade">
          <component ref="contents" v-show="!modalActive" :is="currentView" :content="content"></component>
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
      type: Object,
      default: {
        faceClass: 'front'
      }
    }
  },
  data () {
    return {
      showZoom: false
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
    }
  },
  methods: {
    adjustForContentHeight () {
      var containerHeight = this.$el.offsetHeight;
      var contentHeight = this.$refs.contents.$el.offsetHeight;
      this.showZoom = contentHeight > containerHeight;
    },
    resetScroll (step) {
      setTimeout(() => {
        this.$refs.container.scrollTop -= step;
        if (this.$refs.container.scrollTop > 0) {
          this.resetScroll(step);
        }
      }, 15);
    },
    toggleZoom () {
      this.$store.commit('setModal', this.$refs.contents.$el.innerHTML);
    }
  },
  watch: {
    isVisible: function (isVisibleNow, wasVisible) {
      if (isVisibleNow && !wasVisible) {
        return this.adjustForContentHeight();
      }

      if (wasVisible && !isVisibleNow) {
        var step = this.$refs.container.scrollTop / (1000 / 15);
        return this.resetScroll(step);
      }
    }
  }
}
</script>

