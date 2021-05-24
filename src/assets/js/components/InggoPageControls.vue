<template>
  <div class="page-controls">
    <transition name="fade">
      <button @click="prev" v-show="hasPrev" key="prev">
        <span class="icon">
          <i class="icon-left"></i>
        </span>
      </button>
    </transition>
    <transition name="fade">
      <button @click="next" v-show="hasNext" key="next">
        <span class="icon">
          <i class="icon-right"></i>
        </span>
      </button>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'InggoPageControls',
    props: {
      hasPrev: {
        type: Boolean,
        default: false
      },
      hasNext: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      prev () {
        this.$emit('prev');
      },
      next () {
        this.$emit('next');
      }
    }
  }
</script>
