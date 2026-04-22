export default {
  verticalOverflow: {
    data() {
      return {
        activeVerticalOverflow: false,
        contentOverflows: [],
        subcontentOverflows: [],
      };
    },
    props: {
      isVisible: { type: Boolean, default: false },
    },
    computed: {
      remVal() {
        if (window.innerWidth > 375 && window.innerHeight > 375) return 16;
        return 12;
      },
      topHeight() {
        const top = (window.innerWidth > 375 && window.innerHeight > 375) ? 2 : 1.75;
        return top * this.remVal + this.remVal + 1;
      },
    },
    methods: {
      checkVerticalOverflows() {
        const visible = document.querySelector('section.is-visible');
        if (!visible) return;
        const bounds = visible.getBoundingClientRect().height;
        this.contentOverflows = [];
        this.subcontentOverflows = [];

        if (!this.$refs.contents || this.$refs.contents.length == 0) return;

        for (let i = 0, j = 0; i < this.$refs.contents.length; i++) {
          const currentContent = this.$refs.contents[i];
          const contentHeight = this.topHeight + currentContent.getBoundingClientRect().height;
          this.contentOverflows[i] = contentHeight > bounds;

          while (this.$refs.subcontents && this.$refs.subcontents[j] && currentContent.contains(this.$refs.subcontents[j])) {
            const currentSubcontent = this.$refs.subcontents[j];
            const subcontentHeight = this.topHeight + currentSubcontent.getBoundingClientRect().height;
            this.subcontentOverflows[j] = subcontentHeight > bounds;
            j++;
          }
        }
      },
      checkVerticalOverflow() {
        if (!this.activeRef) return;
        const activeHeight = (this.topHeight + this.activeRef.getBoundingClientRect().height);
        const visible = document.querySelector('section.is-visible');
        if (!visible) return;
        const bounds = visible.getBoundingClientRect().height;
        this.activeVerticalOverflow = activeHeight > bounds;
      },
      toggleZoom() {
        this.$emit('toggle-zoom');
      },
    },
    watch: {
      itemIndex() { this.checkVerticalOverflow(); },
      isVisible(now) {
        if (now) {
          window.setTimeout(() => {
            this.checkVerticalOverflows();
            this.checkVerticalOverflow();
          }, 1001);
        }
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.checkVerticalOverflows();
        this._resizeHandler = () => this.checkVerticalOverflows();
        window.addEventListener('resize', this._resizeHandler);
      });
    },
    beforeUnmount() {
      if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
    },
  },
};
