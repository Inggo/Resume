<template>
  <transition name="fade">
    <div :class="{
      'cube-controls': true,
      'is-mobile': isMobile
    }" v-if="isActive">
      <a v-for="face in faces" :class="{ 'is-active': (isMobile || face.face == currentFace) && face.face == visibleFace }" @click="setVisibleFace(face.face)" :title="face.name" :key="face.name">
        <span class="icon" v-if="face.icon">
          <i :class="face.icon"></i>
        </span>
        <span class="label" v-if="!isMobile">
          {{ face.name }}
        </span>
      </a>
    </div>
  </transition>
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
      isActive () {
        return this.isMobile || this.visibleFace == this.currentFace;
      },
      faces () {
        return this.$store.state.faceContents;
      },
      visibleFace () {
        return this.$store.state.visibleFace;
      }
    },
    methods: {
      setVisibleFace (face) {
        this.$store.commit('setVisibleFace', face);
        this.$emit('set-face', face);
      }
    }
  }
</script>
