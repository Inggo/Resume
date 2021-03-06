<template>
  <div v-if="content" :class="{ 'is-dynamic': overflow }">
    <h2>Work Experience</h2>
    <ul class="work-contents">
      <li
        v-for="(item, i) in content"
        :key="i"
        ref="contents"
        :class="{
          'is-active': i == companyIndex,
          'is-overflowing': contentOverflows && contentOverflows[i],
        }"
      >
        <div class="line" v-if="item.company || item.organization">
          <h3>{{ item.company || item.organization }}</h3>
          <span class="line-label">{{ item.company ? 'Company' : 'Organization' }}</span>
        </div>
        <div class="line" v-if="item.location">
          <p class="subtitle">{{ item.location }}</p>
          <span class="line-label">Location</span>
        </div>
        <ul class="work-titles" :ref="'titles-' + i">
          <li
            v-for="(title, j) in item.titles"
            :key="j"
            :class="{ 'is-active': i == companyIndex && j == titleIndex }"
          >
            <div class="line">
              <h4>{{ title.name }}</h4>
              <span class="line-label">Title</span>
            </div>
            <div class="line">
              <span class="subtitle">{{ title.date }}</span>
              <span class="line-label">Date</span>
            </div>
            <ul class="work-responsibilities">
              <li
                v-for="(responsibility, k) in title.responsibilities"
                :key="'responsibility-' + i + '-' + j + '-' + k"
              >
                {{ responsibility }}
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import mixins from "../mixins";

export default {
  name: "InggoContentWork",
  mixins: [
    mixins.animations,
    mixins.keyboardBindings,
    mixins.displaysContent,
    mixins.verticalOverflow
  ],
  data() {
    return {
      resetTitle: false,
      companyIndex: 0,
      titleIndex: 0,
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
      return "titles-" + this.titleIndex;
    },
    modalOpened() {
      return this.$store.state.modalContents;
    },
    currentCompany() {
      return this.content[this.companyIndex];
    },
    currentTitles() {
      return this.currentCompany.titles;
    },
    currentTitlesRef() {
      return this.$refs["titles-" + this.companyIndex];
    },
    lastCompanyIndex() {
      return this.content.length - 1;
    },
    lastTitleIndex() {
      return this.currentCompany.titles.length - 1;
    },
    hasPrev() {
      return this.companyIndex > 0 || this.titleIndex > 0;
    },
    hasNext() {
      return (
        this.companyIndex < this.lastCompanyIndex ||
        this.titleIndex < this.lastTitleIndex
      );
    },
  },
  methods: {
    prev() {
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

      this.contentDisplayed();
    },
    next() {
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

      this.contentDisplayed();
    },
  },
};
</script>
