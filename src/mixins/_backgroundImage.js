import { imageUrl } from "../utils/images.js";

export default {
  backgroundImage: {
    data() {
      return { bgIndex: 0, bgTimer: null };
    },
    computed: {
      bgImage() {
        if (!this.activeImages?.length) return null;
        return imageUrl(this.activeImages[this.bgIndex]);
      },
    },
    watch: {
      bgImage(url) {
        if (this.isVisible) this.$store.commit("setBgImage", url);
      },
      activeImages(images) {
        this.bgIndex = 0;
        this.stopBg();
        if (this.isVisible) {
          this.startBg();
          this.$store.commit("setGalleryImages", images || []);
        }
      },
      isVisible(now) {
        if (now) {
          this.$store.commit("setBgImage", this.bgImage);
          this.$store.commit("setGalleryImages", this.activeImages || []);
          this.startBg();
        } else {
          this.stopBg();
          this.$store.commit("setBgImage", null);
          this.$store.commit("setGalleryImages", []);
        }
      },
    },
    methods: {
      startBg() {
        if ((this.activeImages?.length || 0) <= 1) return;
        this.bgTimer = setInterval(() => {
          this.bgIndex = (this.bgIndex + 1) % this.activeImages.length;
        }, 8000);
      },
      stopBg() {
        if (this.bgTimer) {
          clearInterval(this.bgTimer);
          this.bgTimer = null;
        }
      },
    },
    beforeUnmount() {
      this.stopBg();
    },
  },
};
