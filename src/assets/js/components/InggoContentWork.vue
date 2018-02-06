<template>
  <div v-if="content" :class="{ 'is-dynamic': overflow }">
    <h2>Work Experience</h2>
    <transition-group name="list" class="work-contents" tag="ul" @after-leave="resetTitleIndex">
      <li v-for="(item, index) in content" v-show="!overflow || index == companyIndex" :key="index">
        <div class="line">
          <h3>{{ item.company }}</h3>
          <span class="line-label">Company</span>
          <transition-group name="fade" tag="div" class="dynamic-controls" v-if="content.length > 1">
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
          </transition-group>
        </div>
        <div class="line">
          <p class="subtitle">{{ item.location }}</p>
          <span class="line-label">Location</span>
        </div>
        <transition-group name="list" class="work-titles" tag="ul">
          <li v-for="(title, index) in item.titles" v-show="!overflow || index == titleIndex" :key="index">
            <div class="line">
              <h4>{{ title.name }}</h4>
              <span class="line-label">Title</span>
            </div>
            <div class="line">
              <span class="subtitle">{{ title.date }}</span>
              <span class="line-label">Date</span> 
            </div>
            <div class="line">
              <ul class="work-responsibilities">
                <li v-for="responsibility in title.responsibilities">{{ responsibility }}</li>
              </ul>
              <span class="line-label">Responsibilities &amp; Accomplishments</span>
            </div>
          </li>
        </transition-group>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'InggoContentWork',
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
      if (this.titleIndex == 0) {
        this.companyIndex--;
        this.titleIndex = this.lastTitleIndex;
      } else {
        this.titleIndex--;
      }
    },
    next () {
      if (this.titleIndex == this.lastTitleIndex) {
        this.companyIndex++;
        this.resetTitle = true;
      } else {
        this.titleIndex++;
      }
    },
    checkTitleIndex (index) {
      if (index < 0) {
        this.titleIndex = 0;
      }
      if (index >= this.currentTitles.length) {
        this.titleIndex = this.currentTitles.length - 1;
      }
    },
    resetTitleIndex () {
      if (this.resetTitle) {
        this.titleIndex = 0;
        this.resetTitle = false;
      }
    }
  }
}
</script>
