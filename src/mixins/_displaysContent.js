export default {
  displaysContent: {
    emits: ['content-displayed'],
    computed: {
      hasPrev() { return false; },
      hasNext() { return false; },
    },
    methods: {
      contentDisplayed() {
        this.$emit('content-displayed', {
          hasPrev: this.hasPrev,
          hasNext: this.hasNext,
        });
      },
    },
  },
};
