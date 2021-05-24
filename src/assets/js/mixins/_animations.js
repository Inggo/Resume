import Velo from 'velocity-animate';

export default {
  animations: {
    data() {
      return {
        animating: false,
        animateDirection: null
      };
    },
    methods: {
      animateTranslate(el, to, duration) {
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
  }
}