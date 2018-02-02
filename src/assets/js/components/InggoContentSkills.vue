<template>
  <div v-if="content">
    <p class="info"><loading></loading> Check Back Soon</p>
  </div>
</template>

<script>
export default {
  name: 'InggoContentSkills',
  props: ['content']
}
</script>
