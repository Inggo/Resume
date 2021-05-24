<template>
  <div
    v-if="content"
    :class="{
      'is-dynamic': overflow,
      'has-overflow': activeVerticalOverflow,
      'is-animating': animating,
    }"
  >
    <ul class="skills-contents">
      <li
        v-for="(skill, i) in categories"
        :class="{
          'is-active': i == categoryIndex,
          'is-overflowing': contentOverflows && contentOverflows[i]
        }"
        :key="i"
        ref="contents"
      >
        <div :ref="'category-' + i" :class="classify(skill.category)">
          <h2 v-html="skill.category.replace(/,/g, ',<br>')"></h2>
          <ul class="skills-items">
            <li v-for="(item, j) in skill.items" :key="j">
              <div v-if="typeof item == 'object'">
                <span
                  v-if="item.description"
                  v-html="highlightTitle(item.description)"
                ></span>
                <ul v-if="item.subitems">
                  <li v-for="(subitem, k) in item.subitems" :key="k">
                    <div v-if="typeof subitem == 'object'">
                      <span class="subitem-description">{{
                        subitem.description
                      }}</span>
                      <span
                        v-if="subitem.date || subitem.venue"
                        class="subitem-date-venue"
                        >held on
                        <span v-if="subitem.date">{{ subitem.date }}</span
                        ><span v-if="subitem.venue">
                          @ {{ subitem.venue }}</span
                        ></span
                      >
                      <span v-if="subitem.role" class="subitem-role"
                        >({{ subitem.role }})</span
                      >.
                    </div>
                    <span v-else>{{ subitem }}</span>
                  </li>
                </ul>
                <a
                  v-if="item.link"
                  class="item-publication"
                  :href="item.link"
                  target="_blank"
                >
                  {{ item.publication }}
                </a>
                <span v-else class="item-publication">
                  {{ item.publication }}
                  <a v-if="item.doi" :href="doi(item.doi)"
                    >doi: {{ item.doi }}</a
                  >
                </span>
                <span
                  v-if="item.publicationExtra"
                  class="item-publication-extra"
                  >{{ item.publicationExtra }}</span
                >
                <span v-if="item.date" class="item-publication-date"
                  >({{ item.date }})</span
                >
              </div>
              <span v-else>
                {{ item }}
              </span>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <transition name="fade">
      <div
        class="vertical-overflow"
        v-if="activeVerticalOverflow"
        @click="toggleZoom"
      ></div>
    </transition>
  </div>
</template>

<script>
import mixins from "../mixins";

export default {
  name: "InggoContentSkills",
  mixins: [
    mixins.animations,
    mixins.verticalOverflow,
    mixins.keyboardBindings,
    mixins.displaysContent,
  ],
  data() {
    return {
      categoryIndex: 0,
    };
  },
  props: {
    content: {
      type: Array,
      default: [],
    },
    overflow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    activeRef() {
      return this.$refs[this.activeRefIndex][0];
    },
    activeRefIndex() {
      return "category-" + this.categoryIndex;
    },
    itemIndex() {
      return this.categoryIndex;
    },
    categories() {
      return this.content;
    },
    currentCategory() {
      return this.categories[this.categoryIndex];
    },
    lastCategoryIndex() {
      return this.categories.length - 1;
    },
    hasPrev() {
      return this.categoryIndex > 0;
    },
    hasNext() {
      return this.categoryIndex < this.lastCategoryIndex;
    },
  },
  methods: {
    classify(category) {
      return (
        "category-" +
        category
          .replace(/\W+/g, "-")
          .replace(/[^A-Za-z0-9\-]/g, "")
          .toLowerCase()
      );
    },
    doi(num) {
      return " https://doi.org/" + num;
    },
    highlightTitle(desc) {
      return desc
        .replace(/“/, '<span class="item-title">“')
        .replace(/”/, "”</span>");
    },
    doAnimate() {
      var $vm = this;

      this.$refs.contents.forEach((el) => {
        $vm.animateTranslate(el, -100 * $vm.categoryIndex);
      });
      
      this.contentDisplayed();
    },
    prev() {
      if (this.animating) {
        return;
      }

      this.categoryIndex--;

      this.doAnimate();
    },
    next() {
      if (this.animating) {
        return;
      }

      this.animating = true;

      this.categoryIndex++;

      this.doAnimate();
    },
  },
};
</script>
