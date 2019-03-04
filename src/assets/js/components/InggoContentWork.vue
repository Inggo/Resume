<template>
  <div v-if="content" :class="{ 'is-dynamic': overflow }">
    <h2>Work Experience</h2>
    <ul class="work-contents">
      <li v-for="(item, i) in content" :key="i" ref="contents" :class="{ 'is-active': i == companyIndex }">
        <div class="line">
          <h3>{{ item.company }}</h3>
          <span class="line-label">Company</span>
        </div>
        <div class="line">
          <p class="subtitle">{{ item.location }}</p>
          <span class="line-label">Location</span>
        </div>
        <ul class="work-titles" :ref="'titles-' + i">
          <li v-for="(title, j) in item.titles" :key="j" :class="{ 'is-active': i == companyIndex && j == titleIndex }">
            <div class="line">
              <h4>{{ title.name }}</h4>
              <span class="line-label">Title</span>
            </div>
            <div class="line">
              <span class="subtitle">{{ title.date }}</span>
              <span class="line-label">Date</span> 
            </div>
            <ul class="work-responsibilities">
              <li v-for="responsibility in title.responsibilities">{{ responsibility }}</li>
            </ul>
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
  name: 'InggoContentWork',
  mixins: [mixins.animations],
  data () {
    return {
      resetTitle: false,
      companyIndex: 0,
      titleIndex: 0
    };
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
    modalOpened () {
      return this.$store.state.modalContents;
    },
    currentCompany () {
      return this.content[this.companyIndex];
    },
    currentTitles () {
      return this.currentCompany.titles;
    },
    currentTitlesRef () {
      return this.$refs['titles-' + this.companyIndex];
    },
    lastCompanyIndex () {
      return this.content.length -1;
    },
    lastTitleIndex () {
      return this.currentCompany.titles.length - 1;
    },
    hasPrev () {
      return this.companyIndex > 0 || this.titleIndex > 0;
    },
    hasNext () {
      return this.companyIndex < this.lastCompanyIndex ||
        this.titleIndex < this.lastTitleIndex;
    }
  },
  methods: {
    prev () {
      if (this.animating) {
        return;
      }

      this.animating = true;
      var $vm = this;

      if (this.titleIndex == 0) {
        this.companyIndex--;
        this.titleIndex = this.lastTitleIndex;

        $vm = this;

        this.$refs.contents.forEach((el) => {
          $vm.animateTranslate(el, -100 * $vm.companyIndex);
        });
      } else {
        this.titleIndex--;
      }

      $vm = this;

      this.currentTitlesRef.forEach((el) => {
        $vm.animateTranslate(el, -100 * $vm.titleIndex);
      });
    },
    next () {
      if (this.animating) {
        return;
      }

      this.animating = true;

      var $vm = this;

      if (this.titleIndex == this.lastTitleIndex) {
        this.companyIndex++;
        this.titleIndex = 0;

        $vm = this;

        this.$refs.contents.forEach((el) => {
          $vm.animateTranslate(el, -100 * $vm.companyIndex);
        });
      } else {
        this.titleIndex++;
      }

      $vm = this;

      this.currentTitlesRef.forEach((el) => {
        $vm.animateTranslate(el, -100 * $vm.titleIndex);
      });
    }
  }
}
</script>
