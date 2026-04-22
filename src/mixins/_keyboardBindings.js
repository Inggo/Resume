export default {
  keyboardBindings: {
    props: {
      isVisible: { type: Boolean, default: false },
    },
    mounted() {
      this._keyHandler = (e) => {
        if (!this.isVisible || this.animating || this.$store.state.modalContents) return;
        switch (e.key) {
          case 'Right':
          case 'ArrowRight':
            if (this.hasNext) this.next();
            break;
          case 'Left':
          case 'ArrowLeft':
            if (this.hasPrev) this.prev();
            break;
        }
      };
      document.addEventListener('keydown', this._keyHandler);
    },
    beforeUnmount() {
      if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler);
    },
  },
};
