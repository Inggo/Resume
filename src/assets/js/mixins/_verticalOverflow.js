export default {
  verticalOverflow: {
    data() {
      return {
        activeVerticalOverflow: false,
        contentOverflows: [],
        subcontentOverflows: []
      }
    },
    props: {
      isVisible: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      remVal() {
        if (window.innerWidth > 375 && window.innerHeight > 375) {
          return 16;
        }

        return 12;
      },
      topHeight() {
        let top = (window.innerWidth > 375 && window.innerHeight > 375) ? 2 : 1.75;

        return top * this.remVal + // heading height
          this.remVal + // top padding
          + 1; // border bottom
      },
    },
    methods: {
      checkVerticalOverflows() {
        let bounds = document.querySelector('section.is-visible').getBoundingClientRect().height;

        this.contentOverflows = [];
        this.subcontentOverflows = [];

        if (!this.$refs.contents || this.$refs.contents.length == 0) {
          return;
        }

        for (let i = 0, j = 0; i < this.$refs.contents.length; i++) {
          let currentContent = this.$refs.contents[i];
          let contentHeight = this.topHeight + currentContent.getBoundingClientRect().height;
          this.contentOverflows[i] = contentHeight > bounds;

          while (this.$refs.subcontents && this.$refs.subcontents[j] && currentContent.contains(this.$refs.subcontents[j])) {
            let currentSubontent = this.$refs.subcontents[j];
            let subcontentHeight = this.topHeight + currentSubontent.getBoundingClientRect().height;
            this.subcontentOverflows[j] = subcontentHeight > bounds;
            j++;
          }
        }
      },
      checkVerticalOverflow() {
        let activeHeight = (this.topHeight + this.activeRef.getBoundingClientRect().height);
        let bounds = document.querySelector('section.is-visible').getBoundingClientRect().height;
        this.activeVerticalOverflow = activeHeight > bounds;
      },
      toggleZoom() {
        this.$emit('toggle-zoom');
      }
    },
    watch: {
      itemIndex(itemIndex) {
        this.checkVerticalOverflow();
      },
      isVisible(now, before) {
        if (now) {
          window.setTimeout(() => {
            this.checkVerticalOverflows();
            this.checkVerticalOverflow();
          }, 1001);
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.checkVerticalOverflows();
        window.addEventListener("resize", this.checkVerticalOverflows);
      });
    }
  }
}