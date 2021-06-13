import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    modalContents: null,
    visibleFace: 'front',
    faceContents: {
      front: {
        id: 0,
        face: 'front',
        name: null,
        icon: null,
        content: null,
        showZoom: false,
        next: 'right',
        prev: 'back',
        cover: null
      },
      right: {
        id: 1,
        face: 'right',
        name: null,
        icon: null,
        content: null,
        showZoom: false,
        next: 'left',
        prev: 'front',
        cover: null
      },
      left: {
        id: 2,
        face: 'left',
        name: null,
        icon: null,
        content: null,
        showZoom: false,
        next: 'top',
        prev: 'right',
        cover: null
      },
      top: {
        id: 3,
        face: 'top',
        name: '',
        icon: null,
        content: null,
        showZoom: false,
        next: 'bottom',
        prev: 'left',
        cover: null
      },
      bottom: {
        id: 4,        
        face: 'bottom',
        name: null,
        icon: null,
        content: null,
        showZoom: false,
        next: 'back',
        prev: 'top',
        cover: null
      },
      back: {
        id: 5,
        face: 'back',
        name: null,
        icon: null,
        content: null,
        showZoom: false,
        next: 'front',
        prev: 'bottom',
        cover: null
      }
    },
    animating: false
  },
  mutations: {
    setFace (state, payload) {
      Object.assign(state.faceContents[payload.face], payload);
    },
    setVisibleFace (state, face) {
      state.visibleFace = face;
      state.animating = true;
    },
    setModal (state, payload) {
      state.modalContents = payload;
    },
    closeModal (state) {
      state.modalContents = null;
    }
  }
});

Vue.component("loading", require("./components/InggoLoading.vue").default);
Vue.component("cube-controls", require("./components/InggoCubeControls.vue").default);
Vue.component("page-controls", require("./components/InggoPageControls.vue").default);
Vue.component("content-bio", require("./components/InggoContentBio.vue").default);
Vue.component("content-work", require("./components/InggoContentWork.vue").default);
Vue.component("content-education", require("./components/InggoContentEduc.vue").default);
Vue.component("content-portfolio", require("./components/InggoContentFolio.vue").default);
Vue.component("content-skills", require("./components/InggoContentSkills.vue").default);
Vue.component("content-links", require("./components/InggoContentLinks.vue").default);
Vue.component("cube-face", require("./components/InggoCubeFace.vue").default);
Vue.component("cube", require("./components/InggoCube.vue").default);
Vue.component("modal", require("./components/InggoModal.vue").default);

const app = new Vue({
  el: "#app",
  store: store,
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

      // Commit portfolio
      store.commit("setFace", {
        face: "right",
        name: "Portfolio",
        icon: "icon-folder",
        content: data.portfolio,
        "content-type": "portfolio",
        showZoom: true,
        cover: true
      });

      // Commit work
      store.commit("setFace", {
        face: "left",
        name: "Work Experience",
        icon: "icon-briefcase",
        content: data.work_experience,
        "content-type": "work",
        showZoom: true,
        cover: true
      });

      // Commit education
      store.commit("setFace", {
        face: "top",
        name: "Education",
        icon: "icon-education",
        content: data.education,
        "content-type": "education",
        showZoom: true,
        cover: true
      });

      // Commit skills
      store.commit("setFace", {
        face: "bottom",
        name: "Skills",
        icon: "icon-tools",
        content: data.skills,
        "content-type": "skills",
        showZoom: true,
        cover: true
      });

      // Commit links
      store.commit("setFace", {
        face: "back",
        name: "Links",
        icon: "icon-link",
        content: data.info,
        "content-type": "links",
        showZoom: false
      });

      this.loaded = true;
    }
  }
});
