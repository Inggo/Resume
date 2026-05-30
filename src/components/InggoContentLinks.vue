<template>
  <div v-if="content">
    <ul class="links">
      <li>
        <label>Website</label>
        <span class="icon"><AppIcon name="link" /></span>
        <a :href="content.links.website" target="_blank">
          <span class="label link">{{ removeProtocol(content.links.website) }}</span>
        </a>
      </li>
      <li>
        <label>Blog</label>
        <span class="icon"><AppIcon name="feather" /></span>
        <a :href="content.links.blog" target="_blank">
          <span class="label feather">{{ removeProtocol(content.links.blog) }}</span>
        </a>
      </li>
      <li>
        <label>Github</label>
        <span class="icon"><AppIcon name="github" /></span>
        <a :href="content.links.github" target="_blank">
          <span class="label link">{{ removeProtocol(content.links.github, true) }}</span>
        </a>
      </li>
      <li>
        <label>Email</label>
        <span class="icon"><AppIcon name="mail" /></span>
        <a :href="'mailto:' + content.links.email" target="_blank">
          <span class="label link">{{ content.links.email }}</span>
        </a>
      </li>
      <li>
        <label>Mobile</label>
        <span class="icon"><AppIcon name="mobile" /></span>
        <a :href="content.links.mobile.link" target="_blank">
          <span class="label link">
            {{ content.links.mobile.label }}
            <span v-if="content.links.mobile.tooltip" class="tooltip">{{ content.links.mobile.tooltip }}</span>
          </span>
        </a>
      </li>
      <li v-for="link in content.extraLinks.filter(l => l.showInLinks !== false)" :key="link.id">
        <label>{{ link.label }}</label>
        <span class="icon"><AppIcon :name="link.icon" /></span>
        <a :href="link.url" target="_blank">
          <span class="label link">{{ removeProtocol(link.url, link.showPath) }}
            <span v-if="link.tooltip" class="tooltip">{{ link.tooltip }}</span>
          </span>
        </a>
      </li>
    </ul>
    <footer class="copyright">{{ content.copyright }}</footer>
  </div>
</template>

<script>
import mixins from '../mixins/index.js';

export default {
  name: 'InggoContentLinks',
  mixins: [mixins.backgroundImage, mixins.removesProtocol],
  props: { content: { type: Object, default: null } },
  computed: {
    activeImages() { return this.content?.linksImages || []; },
  },
};
</script>
