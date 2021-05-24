<template>
  <div class="app-container">
    <cube-controls
      :is-mobile="true"
      v-show="loaded"
      @set-face="faceChanged"
    ></cube-controls>
    <div class="main-container">
      <transition name="start" @after-enter="loadingComplete">
        <div :class="cubeClass" v-show="loading || loaded">
          <cube-face
            v-for="face in faces"
            :face="face"
            :key="face.id"
            @face-loaded="setControls"
            @set-face="faceChanged"
            ref="faces"
          ></cube-face>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <page-controls
        :has-prev="hasPrev"
        :has-next="hasNext"
        v-if="showPagination"
        @prev="prev"
        @next="next"
      ></page-controls>
    </transition>
    <transition name="fade-zoom">
      <modal v-show="modalContents" :contents="modalContents"></modal>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'InggoCube',
    data () {
      return {
        hasNext: false,
        hasPrev: false,
        loading: false,
        loaded: false,
        faces: [
          { id: 0, faceClass: 'front' },
          { id: 1, faceClass: 'back' },
          { id: 2, faceClass: 'right' },
          { id: 3, faceClass: 'left' },
          { id: 4, faceClass: 'top' },
          { id: 5, faceClass: 'bottom' }
        ]
      };
    },
    computed: {
      cubeClass () {
        return {
          'cube-container': true,
          'loading': this.loading,
          'active': this.loaded,
          'show-front': this.loaded && this.visibleFace == 'front',
          'show-back': this.loaded && this.visibleFace == 'back',
          'show-right': this.loaded && this.visibleFace == 'right',
          'show-left': this.loaded && this.visibleFace == 'left',
          'show-top': this.loaded && this.visibleFace == 'top',
          'show-bottom': this.loaded && this.visibleFace == 'bottom'
        };
      },
      modalContents () {
        return this.$store.state.modalContents;
      },
      visibleFaceId () {
        let face = this.faces.find((face) => {
          return face.faceClass === this.visibleFace
        });
        return face ? face.id : 0;
      },
      visibleFace () {
        return this.$store.state.visibleFace;
      },
      currentContents () {
        let face = this.faces.find((face) => {
          return face.faceClass == this.visibleFace;
        });
        return face ? this.$refs.faces[face.id]?.$refs.contents : null;
      },
      showPagination () {
        return this.loaded && (this.hasPrev || this.hasNext);
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.loading = true;
      });
    },
    methods: {
      prev () {
        this.currentContents.prev();
      },
      next () {
        this.currentContents.next();
      },

      faceChanged () {
        this.$nextTick(() => {
          if (this.currentContents && typeof this.currentContents.contentDisplayed == 'function') {
            this.currentContents.contentDisplayed();
          } else {
            this.hasPrev = false;
            this.hasNext = false;
          }
        });
      },

      transitionToFace (dir) {
        let faces = this.$store.state.faceContents;
        let currentFace = faces[this.$store.state.visibleFace];
        this.$store.commit('setVisibleFace', currentFace[dir]);
        this.faceChanged();
      },

      loadingComplete () {
        this.loaded = true;
        this.loading = false;

        for (let i = 0; i < this.faces.length; i++) {
          let ref = this.$refs.faces[i].$refs.contents;
          if (typeof ref.checkVerticalOverflows == 'function') {
            ref.checkVerticalOverflows();
          }
        }

        document.addEventListener('keydown', (e) => {
          switch (e.key) {
            case "Up":
            case "ArrowUp":
              this.transitionToFace('prev');
              break;
            case "Down":
            case "ArrowDown":
              this.transitionToFace('next');
              break;
          }
        });
      },
      setControls (ev = { hasPrev: false, hasNext: false }) {
        this.hasPrev = ev.hasPrev;
        this.hasNext = ev.hasNext;
      }
    }
  };
</script>

