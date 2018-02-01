require("./bootstrap");

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    visibleFace: 'front',
    faceContents: {
      front: {
        face: 'front',
        name: 'Front'
      },
      back: {
        face: 'back',
        name: 'Back'
      },
      right: {
        face: 'right',
        name: 'Right'
      },
      left: {
        face: 'left',
        name: 'Left'
      },
      top: {
        face: 'top',
        name: 'Top'
      },
      bottom: {
        face: 'bottom',
        name: 'Bottom'
      }
    }
  },
  mutations: {
    setVisibleFace (state, face) {
      state.visibleFace = face;
    }
  }
});

Vue.component("cube-controls", require("./components/InggoCubeControls.vue"));
Vue.component("cube-face", require("./components/InggoCubeFace.vue"));
Vue.component("cube", require("./components/InggoCube.vue"));

const app = new Vue({
  el: "#app",
  store,
  computed: {
    currentFace () {
      return store.state.visibleFace;
    }
  }
});
