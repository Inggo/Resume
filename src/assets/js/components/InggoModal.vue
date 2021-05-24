<template>
  <div class="modal" ref="modal">
    <div class="modal-backdrop" ref="backdrop">
      <a class="hide-zoom" @click="close">
        <span class="icon">
          <i class="icon-zoom-out"></i>
        </span>
      </a>
      <div class="modal-contents" v-html="htmlContent" ref="contents"></div>
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

          this.$nextTick(() => {
            let active = this.$refs.contents.getElementsByClassName('is-active');

            if (active.length == 0) {
              return;
            }

            let scrollTo = active.length * -24;

            for (let i = 0; i < active.length; i++) {
               scrollTo += active[i].offsetTop;
            }

            this.$refs.modal.scrollTop = scrollTo;
          });
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

