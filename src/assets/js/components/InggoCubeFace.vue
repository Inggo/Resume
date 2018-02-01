<template>
  <section :class="faceClass">
    <cube-controls :current-face="faceClass"></cube-controls>
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
    computed: {
      faceClass () {
        return this.face.faceClass;
      }
    }
  }
</script>

