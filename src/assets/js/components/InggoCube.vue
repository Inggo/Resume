<template>
  <div class="main-container">
    <div :class="cubeClass">
      <cube-face v-for="face in faces" :face="face" :key="face.id"></cube-face>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'InggoCube',
    data () {
      return {
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
          'show-front': this.visibleFace == 'front',
          'show-back': this.visibleFace == 'back',
          'show-right': this.visibleFace == 'right',
          'show-left': this.visibleFace == 'left',
          'show-top': this.visibleFace == 'top',
          'show-bottom': this.visibleFace == 'bottom'
        };
      },
      visibleFace () {
        return this.$store.state.visibleFace;
      }
    }
  };
</script>

