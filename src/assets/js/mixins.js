if (!window.mixins) {
    window.mixins = [];
}

window.mixins.removesProtocol = {
  methods: {
    removeProtocol (url) {
      return url.replace(/(^\w+:|^)\/\//, '');
    }
  }
}

window.mixins.animations = {
  data () {
      return {
        animating: false,
        animateDirection: null
      };
  },
  methods: {
    animateTranslate (el, to, duration) {
      var $vm = this;
      duration = duration ? duration : 400;
      Velo(
        el,
        { translateX: to + '%' },
        {
          duration: duration,
          complete: () => {
            $vm.animating = false;
          }
        }
      );
    }
  }
};

window.mixins.verticalOverflow = {
  data () {
    return {
      activeVerticalOverflow: false
    }
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    remVal () {
      if (window.innerWidth > 375 && window.innerHeight > 375) {
        return 16;
      }

      return 12;
    },
    topHeight () {
      let top = (window.innerWidth > 375 && window.innerHeight > 375) ? 2 : 1.75;

      return top * this.remVal + // heading height
        this.remVal + // top padding
        + 1; // border bottom
    },
  },
  methods: {
    checkVerticalOverflow () {
      let activeHeight = (this.topHeight + this.activeRef.getBoundingClientRect().height);
      let bounds = document.querySelector('section.is-visible').getBoundingClientRect().height;
      this.activeVerticalOverflow = activeHeight > bounds;
    }
  },
  watch: {
    itemIndex (itemIndex) {
      this.checkVerticalOverflow();
    },
    isVisible (now, before) {
      if (now) {
        window.setTimeout(() => {
          this.checkVerticalOverflow();
        }, 1001);
      }
    }
  }
}
