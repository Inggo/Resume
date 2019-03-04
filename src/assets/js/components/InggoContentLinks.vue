<template>
  <div v-if="content">
    <ul class="links">
      <li>
        <label>Website</label>
        <span class="icon">
          <i class="icon-link"></i>
        </span>
        <a :href="content.links.website" target="_blank">
          <span class="label link">{{ content.links.website }}</span>
        </a>
      </li>
      <li>
        <label>Blog</label>
        <span class="icon">
          <i class="icon-feather"></i>
        </span>
        <a :href="content.links.blog" target="_blank">
          <span class="label feather">{{ content.links.blog }}</span>
        </a>
      </li>
      <li>
        <label>Github</label>
        <span class="icon">
          <i class="icon-github"></i>
        </span>
        <a :href="content.links.github" target="_blank">
          <span class="label link">{{ content.links.github }}</span>
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
          <span class="label link">{{ content.links.mobile.label }}</span>
        </a>
      </li>
    </ul>
    <footer class="copyright">{{ content.copyright }}</footer>
  </div>
</template>

<script>
export default {
  name: 'InggoContentLinks',
  props: ['content']
}
</script>
