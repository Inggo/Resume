<template>
  <div v-if="content" :class="{ 'is-dynamic': overflow }">
    <ul class="educ-contents">
      <li
        v-for="(field, i) in fields"
        :key="i"
        ref="contents"
        :class="{
          'is-active': i == fieldIndex,
          'is-overflowing': contentOverflows && contentOverflows[i],
        }"
      >
        <h2>{{ field.label }}</h2>
        <ul class="educ-institutes" :ref="'institutes-' + i">
          <li
            v-for="(item, j) in content[field.key]"
            :key="j"
            :class="{ 'is-active': i == fieldIndex && j == instituteIndex }"
          >
            <h3>{{ item.institution }}</h3>
            <h4 v-if="item.campus">{{ item.campus }}</h4>
            <aside class="educ-info">
              <p class="educ-info-location">
                <span v-if="item.location">{{ item.location }}</span>
                <a v-if="item.link" :href="item.link" target="_blank">
                  {{ item.link }}
                </a>
              </p>
              <p class="educ-info-date">{{ item.date }}</p>
            </aside>
            <p>{{ item.degree }}</p>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import mixins from "../mixins";

export default {
  name: "InggoContentEduc",
  mixins: [
    mixins.animations,
    mixins.keyboardBindings,
    mixins.displaysContent,
    mixins.verticalOverflow,
  ],
  data() {
    return {
      fields: [
        {
          key: "tertiary",
          label: "Tertiary Education",
        },
        {
          key: "primary-secondary",
          label: "Primary and Secondary Education",
        },
      ],
      fieldIndex: 0,
      instituteIndex: 0,
    };
  },
  props: {
    content: {
      type: Object,
      default: {},
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
      return "institutes-" + this.instituteIndex;
    },
    currentField() {
      return this.fields[this.fieldIndex];
    },
    currentFieldInstitutes() {
      return this.content[this.currentField.key];
    },
    currentInstitute() {
      return this.content[this.currentField.key][this.instituteIndex];
    },
    currentInstitutesRef() {
      return this.$refs["institutes-" + this.fieldIndex];
    },
    lastFieldIndex() {
      return this.fields.length - 1;
    },
    lastInstituteIndex() {
      return this.currentFieldInstitutes.length - 1;
    },
    hasPrev() {
      return this.fieldIndex > 0 || this.instituteIndex > 0;
    },
    hasNext() {
      return (
        this.fieldIndex < this.lastFieldIndex ||
        this.instituteIndex < this.lastInstituteIndex
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

      if (this.instituteIndex == 0) {
        this.fieldIndex--;
        this.instituteIndex = this.lastInstituteIndex;

        $vm = this;

        this.$refs.contents.forEach((el) => {
          $vm.animateTranslate(el, -100 * $vm.fieldIndex);
        });
      } else {
        this.instituteIndex--;
      }

      $vm = this;

      this.currentInstitutesRef.forEach((el) => {
        $vm.animateTranslate(el, -100 * $vm.instituteIndex);
      });

      this.contentDisplayed();
    },
    next() {
      if (this.animating) {
        return;
      }

      this.animating = true;

      var $vm = this;

      if (this.instituteIndex == this.lastInstituteIndex) {
        this.fieldIndex++;
        this.instituteIndex = 0;

        $vm = this;

        this.$refs.contents.forEach((el) => {
          $vm.animateTranslate(el, -100 * $vm.fieldIndex);
        });
      } else {
        this.instituteIndex++;
      }

      $vm = this;

      this.currentInstitutesRef.forEach((el) => {
        $vm.animateTranslate(el, -100 * $vm.instituteIndex);
      });

      this.contentDisplayed();
    },
  },
};
</script>
