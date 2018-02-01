<template>
  <section :class="faceClass" :id="faceID">
    <cube-controls :current-face="faceClass"></cube-controls>
    <div class="face-content-container">
      <div class="face-contents" v-if="faceID == 'bio'">
        <h1>{{ content.full_name }}</h1>
        <p class="subtitle">{{ content.title }}</p>
        <ul class="bio-links">
          <li>
            <a :href="content.links.website" target="_blank">
              <span class="icon">
                <i class="icon-link"></i>
              </span>
              <span class="label link">{{ content.links.website }}</span>
            </a>
          </li>
          <li>
            <a :href="content.links.github" target="_blank">
              <span class="icon">
                <i class="icon-github"></i>
              </span>
              <span class="label link">{{ content.links.github }}</span>
            </a>
          </li>
          <li>
            <a :href="'mailto:' + content.links.email" target="_blank">
              <span class="icon">
                <i class="icon-mail"></i>
              </span>
              <span class="label link">{{ content.links.email }}</span>
            </a>
          </li>
          <li>
            <a :href="content.links.mobile.link" target="_blank">
              <span class="icon">
                <i class="icon-mobile"></i>
              </span>
              <span class="label link">{{ content.links.mobile.label }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'InggoCubeFace',
  props: {
    face: {
      type: Object,
      default: {
        faceClass: 'front'
      }
    }
  },
  computed: {
    faceClass () {
      return this.face.faceClass;
    },
    faceID () {
      return this.$store.state.faceContents[this.faceClass]['content-type'];
    },
    content () {
      return this.$store.state.faceContents[this.faceClass].content;
    }
  }
}
</script>

