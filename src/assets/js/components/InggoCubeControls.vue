<template>
  <div :class="{
    'cube-controls': true,
    'is-mobile': isMobile
  }">
    <a v-for="face in faces" :class="controlClass(face.face)" @click="setVisibleFace(face.face)" v-if="face.name && (isMobile || face.face != currentFace)">
      <span class="icon" v-if="face.icon">
        <i :class="face.icon"></i>
      </span>
      <span class="label" v-if="!isMobile">
        {{ face.name }}
      </span>
    </a>
  </div>
</template>

<script>
  export default {
    name: 'InggoCubeControls',
    props: {
      currentFace: {
        type: String,
        default: 'front'
      },
      isMobile: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      faces () {
        return this.$store.state.faceContents;
      }
    },
    methods: {
      setVisibleFace (face) {
        this.$store.commit('setVisibleFace', face);
      },
      controlClass (face) {
        return 'to-' + face;
      }
    }
  }
</script>
