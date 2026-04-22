<template>
  <div
    v-if="content"
    :class="{
      'is-dynamic': overflow,
      'has-overflow': activeVerticalOverflow,
      'is-animating': animating,
    }"
  >
    <ul class="folio-contents">
      <li
        v-for="(category, i) in content"
        :key="i"
        ref="contents"
        :class="{
          'is-active': i == categoryIndex,
          'is-overflowing': contentOverflows && contentOverflows[i],
        }"
      >
        <h2>{{ category.category }}</h2>
        <ul class="folio-items" :ref="(el) => setDyn('category-' + i, el)">
          <li
            v-for="(item, j) in category.items"
            :key="j"
            :class="{ 'is-active': i == categoryIndex && j == itemIndex }"
            ref="subcontents"
          >
            <div class="folio-item" :ref="(el) => setDyn('folio' + i + '_' + j, el)">
              <h3>{{ item.name }}</h3>
              <h4 v-if="item.subtitle">{{ item.subtitle }}</h4>
              <aside class="folio-role" v-if="item.role">
                <label>Role: </label>
                <strong>{{ item.role }}</strong>
              </aside>
              <p class="folio-item-link" v-if="item.link">
                <a v-if="typeof item.link == 'object'" :href="item.link.url">
                  <i v-if="item.link.icon" :class="item.link.icon"></i>
                  <i v-else-if="item.active === false" class="icon-unlink"></i>
                  <i v-else class="icon-link"></i>
                  <span>{{ item.link.label }}</span>
                </a>
                <a v-else :href="item.active === false ? null : item.link" target="_blank">
                  <i v-if="item.active === false" class="icon-unlink"></i>
                  <i v-else class="icon-link"></i>
                  <span>{{ removeProtocol(item.link, item.showPath) }}</span>
                </a>
                <span class="folio-item-status" v-if="item.status">{{ item.status }}</span>
              </p>
              <p class="folio-item-description">{{ item.description }}</p>
              <ul class="folio-item-links" v-if="item.links" ref="itemLinks">
                <li v-for="(link, k) in item.links" :key="k">
                  <a :href="link.active === false ? null : link.url" target="_blank" :title="link.url">
                    <label v-if="link.label">{{ link.label }}</label>
                    <i v-if="link.active === false" class="icon-unlink"></i>
                    <i v-else class="icon-link"></i>
                    <span>{{ removeProtocol(link.url, link.showPath) }}</span>
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
                <div v-if="item.features" class="folio-features">
                  <h5>Features</h5>
                  <ul>
                    <li v-for="(feature, l) in item.features" :key="l">{{ feature }}</li>
                  </ul>
                </div>
                <div v-if="item.technologies" class="folio-techs">
                  <h5>Technologies</h5>
                  <ul>
                    <li v-for="(tech, m) in item.technologies" :key="m">{{ tech }}</li>
                  </ul>
                </div>
              </aside>
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <transition name="fade">
      <div class="vertical-overflow" v-if="activeVerticalOverflow" @click="toggleZoom"></div>
    </transition>
  </div>
</template>

<script>
import mixins from '../mixins/index.js';

export default {
  name: 'InggoContentFolio',
  emits: ['content-displayed', 'toggle-zoom', 'face-loaded'],
  mixins: [
    mixins.animations,
    mixins.removesProtocol,
    mixins.verticalOverflow,
    mixins.keyboardBindings,
    mixins.displaysContent,
  ],
  data() {
    return {
      categoryIndex: 0,
      itemIndex: 0,
      dynRefs: {},
    };
  },
  props: {
    content: { type: Array, default: () => [] },
    overflow: { type: Boolean, default: false },
  },
  computed: {
    activeRef() { return this.dynRefs[this.activeRefIndex]; },
    activeRefIndex() { return 'folio' + this.categoryIndex + '_' + this.itemIndex; },
    currentCategoryRef() { return this.dynRefs['category-' + this.categoryIndex]; },
    hasPrev() { return this.categoryIndex > 0 || this.itemIndex > 0; },
    hasNext() {
      return this.categoryIndex < this.lastCategoryIndex
        || this.itemIndex < this.lastItemIndex;
    },
    items() { return this.content[this.categoryIndex].items; },
    lastItemIndex() { return this.items.length - 1; },
    lastCategoryIndex() { return this.content.length - 1; },
  },
  watch: {
    itemIndex() { this.checkVerticalOverflow(); },
    isVisible(now) {
      if (now) {
        window.setTimeout(() => {
          const itemLinks = this.$refs.itemLinks;
          if (itemLinks && itemLinks.forEach) {
            itemLinks.forEach((links) => {
              const labels = links.querySelectorAll('label');
              let maxWidth = 0;
              labels.forEach((label) => {
                label.style.width = null;
                const width = label.getBoundingClientRect().width;
                if (width > maxWidth) maxWidth = width;
              });
              maxWidth = Math.round(maxWidth);
              labels.forEach((label) => { label.style.width = maxWidth + 'px'; });
            });
          }
          this.checkVerticalOverflow();
        }, 1001);
      }
    },
  },
  methods: {
    setDyn(name, el) { if (el) this.dynRefs[name] = el; },
    prev() {
      if (this.animating) return;
      this.animating = true;

      if (this.itemIndex == 0) {
        this.categoryIndex--;
        this.itemIndex = this.lastItemIndex;
        this.$refs.contents.forEach((el) => this.animateTranslate(el, -100 * this.categoryIndex));
      } else {
        this.itemIndex--;
      }

      if (this.currentCategoryRef) this.animateTranslate(this.currentCategoryRef, -100 * this.itemIndex);
      this.contentDisplayed();
    },
    next() {
      if (this.animating) return;
      this.animating = true;

      if (this.itemIndex == this.lastItemIndex) {
        this.categoryIndex++;
        this.itemIndex = 0;
        this.$refs.contents.forEach((el) => this.animateTranslate(el, -100 * this.categoryIndex));
      } else {
        this.itemIndex++;
      }

      if (this.currentCategoryRef) this.animateTranslate(this.currentCategoryRef, -100 * this.itemIndex);
      this.contentDisplayed();
    },
  },
};
</script>
