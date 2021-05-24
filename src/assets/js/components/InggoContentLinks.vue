<template>
  <div v-if="content">
    <ul class="links">
      <li>
        <label>Website</label>
        <span class="icon">
          <i class="icon-link"></i>
        </span>
        <a :href="content.links.website" target="_blank">
          <span class="label link">{{ removeProtocol(content.links.website) }}</span>
        </a>
      </li>
      <li>
        <label>Blog</label>
        <span class="icon">
          <i class="icon-feather"></i>
        </span>
        <a :href="content.links.blog" target="_blank">
          <span class="label feather">{{ removeProtocol(content.links.blog) }}</span>
        </a>
      </li>
      <li>
        <label>Github</label>
        <span class="icon">
          <i class="icon-github"></i>
        </span>
        <a :href="content.links.github" target="_blank">
          <span class="label link">{{ removeProtocol(content.links.github, true) }}</span>
        </a>
      </li>
      <li>
        <label>Email</label>
        <span class="icon">
          <i class="icon-mail"></i>
        </span>
        <a :href="'mailto:' + content.links.email" target="_blank">
          <span class="label link">{{ content.links.email }}</span>
        </a>
      </li>
      <li>
        <label>Mobile</label>
        <span class="icon">
          <i class="icon-mobile"></i>
        </span>
        <a :href="content.links.mobile.link" target="_blank">
          <span class="label link">
            {{ content.links.mobile.label }}
            <span v-if="content.links.mobile.tooltip" class="tooltip">{{ content.links.mobile.tooltip }}</span>
          </span>
        </a>
      </li>
      <li v-for="link in content.extraLinks" :key="link.id">
        <label>{{ link.label }}</label>
        <span class="icon">
          <i :class="link.icon"></i>
        </span>
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
import mixins from '../mixins';

export default {
  name: 'InggoContentLinks',
  mixins: [mixins.removesProtocol],
  props: ['content']
}
</script>
