<template>
  <div class="main-container">
    <transition name="start" @after-enter="loadingComplete">
      <div :class="cubeClass" v-if="loading || loaded">
        <cube-face v-for="face in faces" :face="face" :key="face.id"></cube-face>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'InggoCube',
    data () {
      return {
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
      visibleFace () {
        return this.$store.state.visibleFace;
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.loading = true;
      });
    },
    methods: {
      loadingComplete (el) {
        this.loaded = true;
        this.loading = false;
      }
    }
  };
</script>

