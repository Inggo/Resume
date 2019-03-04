<template>
  <div v-if="content" :class="{ 'is-dynamic': overflow }">
    <ul class="folio-contents">
      <li v-for="(category, i) in content" :key="i" ref="contents" :class="{ 'is-active': i == categoryIndex }">
        <h2>{{ category.category }}</h2>
        <ul class="folio-items" :ref="'category-' + i">
          <li v-for="(item, j) in category.items" :key="j" :class="{ 'is-active': i == categoryIndex && j == itemIndex }">
            <h3>{{ item.name }}</h3>
            <aside class="folio-role" v-if="item.role">
              <label>Role: </label>
              <strong>{{ item.role }}</strong>
            </aside>
            <p class="folio-item-link" v-if="item.link">
              <a :href="item.link" target="_blank">
                <i class="icon-link"></i>
                <span>{{ item.link }}</span>
              </a>
              <span class="folio-item-status" v-if="item.status">{{ item.status }}</span>
            </p>
            <p class="folio-item-description">{{ item.description }}</p>
            <ul class="folio-item-links" v-if="item.links">
              <li v-for="(link, k) in item.links" :key="k">
                <a :href="link.url" target="_blank">
                  <label v-if="link.label">{{ link.label }}</label>
                  <i class="icon-link"></i>
                  <span>{{ link.url }}</span>
                </a>
                <span class="folio-link-status" v-if="link.status">{{ link.status }}</span>
              </li>
            </ul>
            <aside class="folio-responsibilities" v-if="item.responsibilities">
              <h5>Responsibilities</h5>
              <ul>
                <li v-for="(resp, k) in item.responsibilities" :key="k">{{ resp }}</li>
              </ul>
            </aside>
            <ul v-if="item.samples" class="folio-samples">
              <li v-for="(sample, k) in item.samples" :key="k">
                <h4>{{ sample.name }}</h4>
                <p class="folio-item-link" v-if="sample.url">
                <a :href="sample.url" target="_blank">
                  <i v-if="sample.icon" class="icon-github"></i>
                  <i v-else class="icon-link"></i>
                  <span>{{ sample.label }}</span>
                </a>
                <span class="folio-item-status" v-if="sample.status">{{ sample.status }}</span>
              </p>
              </li>
            </ul>
            <aside class="folio-info">
              <div v-if="item.features">
                <h5>Features</h5>
                <ul>
                  <li v-for="(feature, l) in item.features" :key="l">{{ feature }}</li>
                </ul>
              </div>
              <div v-if="item.technologies">
                <h5>Technologies</h5>
                <ul>
                  <li v-for="(tech, m) in item.technologies" :key="m">{{ tech }}</li>
                </ul>
              </div>
            </aside>
          </li>
        </ul>
      </li>
    </ul>
    <div class="dynamic-controls" v-if="content.length > 1">
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
  </div>
</template>
<script>
export default {
  name: 'InggoContentFolio',
  mixins: [mixins.animations],
  data () {
    return {
      categoryIndex: 0,
      itemIndex: 0
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
    currentCategoryRef () {
      return this.$refs['category-' + this.categoryIndex];
    },
    hasPrev () {
      return this.categoryIndex > 0 || this.itemIndex > 0;
    },
    hasNext () {
      return this.categoryIndex < this.lastCategoryIndex ||
        this.itemIndex < this.lastItemIndex;
    },
    items () {
      return this.content[this.categoryIndex].items;
    },
    lastItemIndex () {
      return this.items.length - 1;
    },
    lastCategoryIndex () {
      return this.content.length -1;
    },
  },
  methods: {
    prev () {
      if (this.animating) {
        return;
      }

      this.animating = true;

      var $vm = this;

      if (this.itemIndex == 0) {
        this.categoryIndex--;
        this.itemIndex = this.lastItemIndex;

        $vm = this;

        this.$refs.contents.forEach((el) => {
          $vm.animateTranslate(el, -100 * $vm.categoryIndex);
        });
      } else {
        this.itemIndex--;
      }

      $vm = this;

      this.currentCategoryRef.forEach((el) => {
        $vm.animateTranslate(el, -100 * $vm.itemIndex);
      });
    },
    next () {
      if (this.animating) {
        return;
      }

      this.animating = true;

      var $vm = this;

      if (this.itemIndex == this.lastItemIndex) {
        this.categoryIndex++;
        this.itemIndex = 0;

        $vm = this;

        this.$refs.contents.forEach((el) => {
          $vm.animateTranslate(el, -100 * $vm.categoryIndex);
        });
      } else {
        this.itemIndex++;
      }

      $vm = this;

      this.currentCategoryRef.forEach((el) => {
        $vm.animateTranslate(el, -100 * $vm.itemIndex);
      });
    }
  }
}
</script>
