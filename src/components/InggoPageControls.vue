<template>
  <div class="page-controls">
    <transition name="fade">
      <button @click="$emit('prev')" v-show="hasPrev" key="prev">
        <span class="icon"><i class="icon-left"></i></span>
      </button>
    </transition>
    <transition name="fade">
      <button @click="$emit('next')" v-show="hasNext" key="next">
        <span class="icon"><i class="icon-right"></i></span>
      </button>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'InggoPageControls',
  emits: ['prev', 'next'],
  props: {
    hasPrev: { type: Boolean, default: false },
    hasNext: { type: Boolean, default: false },
  },
};
</script>
