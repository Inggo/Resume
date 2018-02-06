<template>
  <div class="modal">
    <div class="modal-backdrop">
      <a class="hide-zoom" @click="close">
        <span class="icon">
          <i class="icon-zoom-out"></i>
        </span>
      </a>
      <div class="modal-contents" v-html="htmlContent"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'InggoModal',
    data () {
      return {
        htmlContent: ""
      }
    },
    props: ['contents'],
    watch: {
      contents (newContent, oldContent) {
        if (newContent) {
          this.htmlContent = newContent;
        }
      }
    },
    methods: {
      close () {
        this.$store.commit('closeModal');
      }
    }
  };
</script>

