<template>
  <section :class="faceClass" :id="faceID">
    <cube-controls :current-face="faceClass"></cube-controls>
    <div class="face-content-container">
      <!-- TODO: Componentialize the face contents -->
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

      <div class="face-contents" v-if="faceID == 'work'">
        <h2>Work Experience</h2>
        <ul class="work-contents">
          <li v-for="item in content">
            <h3>{{ item.company }}</h3>
            <p class="subtitle">{{ item.location }}</p>
            <ul class="work-titles">
              <li v-for="title in item.titles">
                <h4>{{ title.name }}</h4>
                <p class="subtitle">{{ title.date }}</p>
                <ul class="work-responsibilities">
                  <li v-for="responsibility in title.responsibilities">{{ responsibility }}</li>
                </ul>
              </li>
            </ul>
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

