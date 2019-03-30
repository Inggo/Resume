<template>
  <div v-if="content" :class="{ 'is-dynamic': overflow }">
    <ul class="skills-contents">
      <li v-for="(skill, i) in categories" :key="i" ref="contents" :class="{ 'is-active': i == categoryIndex }">
        <div :ref="'category-' + i">
          <h2>{{ skill.category }}</h2>
          <ul class="skills-items">
            <li v-for="(item, j) in skill.items" :key="j">{{ item }}</li>
          </ul>
        </div>
      </li>
    </ul>
    <div class="dynamic-controls" v-if="categories.length > 1">
      <a @click="prev" v-show="hasPrev" key="prev">
        <span class="icon">
          <i class="icon-left"></i>
        </span>
      </a>
      <a @click="next" v-show="hasNext" key="next">
        <span class="icon">
          <i class="icon-right"></i>
        </span>
      </a>
    </div>
    <transition name="fade">
      <div class="vertical-overflow" v-if="activeVerticalOverflow"></div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'InggoContentSkills',
  mixins: [mixins.animations, mixins.verticalOverflow],
  data () {
    return {
      categoryIndex: 0
    }
  },
  props: {
    content: {
      type: Array,
      default: []
    },
    overflow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    activeRef () {
      return this.$refs[this.activeRefIndex][0];
    },
    activeRefIndex () {
      return 'category-' + this.categoryIndex;
    },
    itemIndex () {
      return this.categoryIndex;
    },
    categories () {
      return this.content;
    },
    currentCategory () {
      return this.categories[this.categoryIndex];
    },
    lastCategoryIndex () {
      return this.categories.length - 1;
    },
    hasPrev () {
      return this.categoryIndex > 0;
    },
    hasNext () {
      return this.categoryIndex < this.lastCategoryIndex;
    }
  },
  methods: {
    doAnimate () {
      var $vm = this;
      this.$refs.contents.forEach((el) => {
        $vm.animateTranslate(el, -100 * $vm.categoryIndex);
      });
    },
    prev () {
      if (this.animating) {
        return;
      }

      this.categoryIndex--;

      this.doAnimate();
    },
    next () {
      if (this.animating) {
        return;
      }

      this.animating = true;

      this.categoryIndex++;

      this.doAnimate();
    }
  }
}
</script>
