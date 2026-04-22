import { createStore } from 'vuex';

const emptyFace = (face, id, next, prev) => ({
  id, face, name: null, icon: null, content: null,
  showZoom: false, next, prev, cover: null,
});

export const store = createStore({
  state: () => ({
    modalContents: null,
    visibleFace: 'front',
    faceContents: {
      front:  emptyFace('front',  0, 'right',  'back'),
      right:  emptyFace('right',  1, 'left',   'front'),
      left:   emptyFace('left',   2, 'top',    'right'),
      top:    emptyFace('top',    3, 'bottom', 'left'),
      bottom: emptyFace('bottom', 4, 'back',   'top'),
      back:   emptyFace('back',   5, 'front',  'bottom'),
    },
    animating: false,
  }),
  mutations: {
    setFace(state, payload) {
      Object.assign(state.faceContents[payload.face], payload);
    },
    setVisibleFace(state, face) {
      state.visibleFace = face;
      state.animating = true;
    },
    setModal(state, payload) {
      state.modalContents = payload;
    },
    closeModal(state) {
      state.modalContents = null;
    },
  },
});
