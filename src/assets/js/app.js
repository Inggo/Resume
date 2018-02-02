require("./bootstrap");

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    modalContents: null,
    visibleFace: 'front',
    faceContents: {
      front: {
        face: 'front',
        name: null,
        icon: null,
        content: null
      },
      right: {
        face: 'right',
        name: null,
        icon: null,
        content: null
      },
      left: {
        face: 'left',
        name: null,
        icon: null,
        content: null
      },
      top: {
        face: 'top',
        name: '',
        icon: null,
        content: null
      },
      bottom: {
        face: 'bottom',
        name: null,
        icon: null,
        content: null
      },
      back: {
        face: 'back',
        name: null,
        icon: null,
        content: null
      }
    }
  },
  mutations: {
    setFace (state, payload) {
      state.faceContents[payload.face] = payload;
    },
    setVisibleFace (state, face) {
      state.visibleFace = face;
    },
    setModal (state, payload) {
      state.modalContents = payload;
    },
    closeModal (state) {
      state.modalContents = null;
    }
  }
});

Vue.component("loading", require("./components/InggoLoading.vue"));
Vue.component("cube-controls", require("./components/InggoCubeControls.vue"));
Vue.component("content-bio", require("./components/InggoContentBio.vue"));
Vue.component("content-work", require("./components/InggoContentWork.vue"));
Vue.component("content-educ", require("./components/InggoContentEduc.vue"));
Vue.component("content-folio", require("./components/InggoContentFolio.vue"));
Vue.component("content-skills", require("./components/InggoContentSkills.vue"));
Vue.component("content-links", require("./components/InggoContentLinks.vue"));
Vue.component("cube-face", require("./components/InggoCubeFace.vue"));
Vue.component("cube", require("./components/InggoCube.vue"));
Vue.component("modal", require("./components/InggoModal.vue"));

const app = new Vue({
  el: "#app",
  store,
  data () {
    return {
      loaded: false
    };
  },
  computed: {
    currentFace () {
      return store.state.visibleFace;
    }
  },
  mounted () {
    // Load data
    axios.get('/data.json')
      .then((response) => {
        this.populateContents(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    populateContents (data) {

      // Commit Bio
      store.commit("setFace", {
        face: "front",
        name: "Bio",
        icon: "icon-bio",
        content: data.info,
        "content-type": "bio"
      });

      // Commit education
      store.commit("setFace", {
        face: "left",
        name: "Education",
        icon: "icon-education",
        content: data.education,
        "content-type": "education"
      });

      // Commit work
      store.commit("setFace", {
        face: "right",
        name: "Work Experience",
        icon: "icon-briefcase",
        content: data.work_experience,
        "content-type": "work"
      });

      // Commit portfolio
      store.commit("setFace", {
        face: "top",
        name: "Portfolio",
        icon: "icon-folder",
        content: data.portfolio,
        "content-type": "portfolio"
      });

      // Commit skills
      store.commit("setFace", {
        face: "bottom",
        name: "Skills",
        icon: "icon-tools",
        content: data.skills,
        "content-type": "skills"
      });

      // Commit links
      store.commit("setFace", {
        face: "back",
        name: "Links",
        icon: "icon-link",
        content: data.info,
        "content-type": "links"
      });

      this.loaded = true;
    }
  }
});
