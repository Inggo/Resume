export default {
  displaysContent: {
    computed: {
      hasPrev () {
        return false
      },
      hasNext () {
        return false
      }
    },
    methods: {
      contentDisplayed () {
        let payload = {
          hasPrev: this.hasPrev,
          hasNext: this.hasNext
        };
        this.$emit('content-displayed', payload);
      }
    }
  }
}