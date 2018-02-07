<template>
  <div v-if="content" :class="{ 'is-dynamic': overflow }">
    <h2>Work Experience</h2>
    <transition-group
      tag="ul" 
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
      @after-leave="afterLeave"
      class="work-contents"
    >
      <li v-for="(item, index) in content" v-show="!overflow || index == companyIndex" :key="index">
        <div class="line">
          <h3>{{ item.company }}</h3>
          <span class="line-label">Company</span>
        </div>
        <div class="line">
          <p class="subtitle">{{ item.location }}</p>
          <span class="line-label">Location</span>
        </div>
        <transition-group
          tag="ul" 
          :css="false"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
          class="work-titles"
        >
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
</template>

<script>
export default {
  name: 'InggoContentWork',
  data () {
    return {
      animateDirection: null,
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
      this.animateDirection = 'left';
    },
    next () {
      if (this.titleIndex == this.lastTitleIndex) {
        this.companyIndex++;
        this.resetTitle = true;
      } else {
        this.titleIndex++;
      }
      this.animateDirection = 'right';
    },
    // Animation
    animateDelay (el, to, duration, delay, done) {
      var conf = { duration: duration }
      if (done) {
        conf.complete = done;
      }

      setTimeout(() => {
        Velo(
          el,
          to,
          conf
        );
      }, delay);
    },
    beforeEnter (el) {
      var translate = this.animateDirection == 'left' ? '100%' : '-100%';
      el.style.transform = 'translateX(' + translate + ')';
      el.style.translateX = translate;
      el.style.opacity = 0;

      this.animateDelay(el, { translateX: translate, opacity: 0 }, 1, 0);

      if (this.resetTitle) {
        this.titleIndex = 0;
        this.resetTitle = false;
      }
    },
    enter (el, done) {
      this.animateDelay(
        el,
        {
          translateX: 0,
          opacity: 1
        },
        400,
        400,
        done
      );
    },
    leave (el, done) {
      var translate = this.animateDirection == 'left' ? '-100%' : '100%';
      this.animateDelay(
        el,
        { 
          translateX: translate,
          opacity: 0
        },
        400,
        0,
        done
      )
    },
    afterLeave (el) {
      if (this.resetTitle) {
        this.titleIndex = 0;
        this.resetTitle = false;
      }
    }
  }
}
</script>
