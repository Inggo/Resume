<template>
  <div id="app">
    <div class="app-bg" aria-hidden="true">
      <transition name="app-bg">
        <img :key="bgImage" :src="bgImage" v-if="bgImage" />
      </transition>
    </div>
    <Cube v-if="loaded" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Cube from './InggoCube.vue';
import { imageUrl, applyImageConfig, collectAllImages } from '../utils/images.js';

const loaded = ref(false);
const store = useStore();
const bgImage = computed(() => store.state.bgImage);

onMounted(() => {
  fetch('/data.json')
    .then((r) => r.json())
    .then((data) => populateContents(data))
    .catch((err) => console.error(err));
});

function populateContents(data) {
  applyImageConfig(data);
  store.commit('setFace', {
    face: 'front', name: 'Bio', icon: 'icon-bio',
    content: data.info, 'content-type': 'bio',
  });
  store.commit('setFace', {
    face: 'right', name: 'Portfolio', icon: 'icon-folder',
    content: data.portfolio, 'content-type': 'portfolio',
    showZoom: true, cover: true,
  });
  store.commit('setFace', {
    face: 'left', name: 'Work Experience', icon: 'icon-briefcase',
    content: data.work_experience, 'content-type': 'work',
    showZoom: true, cover: true,
  });
  store.commit('setFace', {
    face: 'top', name: 'Education', icon: 'icon-education',
    content: data.education, 'content-type': 'education',
    showZoom: true, cover: true,
  });
  store.commit('setFace', {
    face: 'bottom', name: 'Skills', icon: 'icon-tools',
    content: data.skills, 'content-type': 'skills',
    showZoom: true, cover: true,
  });
  store.commit('setFace', {
    face: 'back', name: 'Links', icon: 'icon-link',
    content: data.info, 'content-type': 'links',
    showZoom: false,
  });
  loaded.value = true;
  collectAllImages().forEach((id) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.type = 'image/avif';
    link.href = imageUrl(id);
    document.head.appendChild(link);
  });
}
</script>

<style scoped>
.app-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  opacity: 0.2;
  pointer-events: none;
}
.app-bg img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}
.app-bg-enter-active,
.app-bg-leave-active {
  transition: opacity 1.2s ease;
}
.app-bg-enter-from,
.app-bg-leave-to {
  opacity: 0;
}
</style>
