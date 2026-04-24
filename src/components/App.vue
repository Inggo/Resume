<template>
  <div id="app">
    <Cube v-if="loaded" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Cube from './InggoCube.vue';

const loaded = ref(false);
const store = useStore();

onMounted(() => {
  fetch('/data.json')
    .then((r) => r.json())
    .then((data) => populateContents(data))
    .catch((err) => console.error(err));
});

function populateContents(data) {
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
}
</script>
