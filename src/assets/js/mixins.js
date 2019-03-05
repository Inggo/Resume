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
