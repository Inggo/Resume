<template>
  <div v-if="content">
    <footer>{{ content.copyright }}</footer>
  </div>
</template>

<script>
export default {
  name: 'InggoContentLinks',
  props: ['content']
}
</script>
