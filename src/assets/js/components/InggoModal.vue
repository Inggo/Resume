<template>
  <div class="modal">
    <a class="hide-zoom" @click="close">
      <span class="icon">
        <i class="icon-zoom-out"></i>
      </span>
    </a>
    <div class="modal-contents" v-html="contents"></div>
  </div>
</template>

<script>
  export default {
    name: 'InggoModal',
    props: ['contents'],
    methods: {
      close () {
        this.$store.commit('closeModal');
      }
    }
  };
</script>

