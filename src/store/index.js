import { createStore } from 'vuex';

const emptyFace = (face, id, next, prev) => ({
  id, face, name: null, icon: null, content: null,
  showZoom: false, next, prev, cover: null,
});

export const store = createStore({
  state: () => ({
    modalContents: null,
    bgImage: null,
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
    // Images of the active item on the visible face. Populated by the
    // backgroundImage mixin; powers the show-gallery button visibility and
    // the gallery overlay contents.
    galleryImages: [],
    galleryActive: false,
    galleryIndex: 0,
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
    setBgImage(state, url) {
      state.bgImage = url;
    },
    setGalleryImages(state, images) {
      state.galleryImages = images || [];
      // Reset index whenever the underlying set changes so we don't end up
      // pointing past the end of a shorter list.
      state.galleryIndex = 0;
      // If we no longer have images to show, force the overlay closed.
      if (state.galleryImages.length === 0) state.galleryActive = false;
    },
    openGallery(state) {
      if (state.galleryImages.length === 0) return;
      state.galleryActive = true;
      state.galleryIndex = 0;
    },
    closeGallery(state) {
      state.galleryActive = false;
    },
    galleryPrev(state) {
      const n = state.galleryImages.length;
      if (n <= 1) return;
      state.galleryIndex = (state.galleryIndex - 1 + n) % n;
    },
    galleryNext(state) {
      const n = state.galleryImages.length;
      if (n <= 1) return;
      state.galleryIndex = (state.galleryIndex + 1) % n;
    },
  },
});
