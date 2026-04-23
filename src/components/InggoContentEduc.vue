<template>
  <div v-if="content">
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
        <ul class="educ-institutes" :ref="(el) => setDyn('institutes-' + i, el)">
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
                <a v-if="item.link" :href="item.link" target="_blank">{{ item.link }}</a>
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
import mixins from '../mixins/index.js';

export default {
  name: 'InggoContentEduc',
  emits: ['content-displayed', 'toggle-zoom', 'face-loaded'],
  mixins: [
    mixins.animations,
    mixins.keyboardBindings,
    mixins.displaysContent,
    mixins.verticalOverflow,
  ],
  data() {
    return {
      fields: [
        { key: 'tertiary', label: 'Tertiary Education' },
        { key: 'primary-secondary', label: 'Primary and Secondary Education' },
      ],
      fieldIndex: 0,
      instituteIndex: 0,
      dynRefs: {},
    };
  },
  props: {
    content: { type: Object, default: () => ({}) },
    overflow: { type: Boolean, default: false },
  },
  computed: {
    activeRef() { return this.dynRefs[this.activeRefIndex]; },
    activeRefIndex() { return 'institutes-' + this.instituteIndex; },
    currentField() { return this.fields[this.fieldIndex]; },
    currentFieldInstitutes() { return this.content[this.currentField.key]; },
    currentInstitute() { return this.content[this.currentField.key][this.instituteIndex]; },
    currentInstitutesRef() { return this.dynRefs['institutes-' + this.fieldIndex]; },
    lastFieldIndex() { return this.fields.length - 1; },
    lastInstituteIndex() { return this.currentFieldInstitutes.length - 1; },
    hasPrev() { return false; },
    hasNext() { return false; },
  },
  methods: {
    setDyn(name, el) { if (el) this.dynRefs[name] = el; },
    prev() {
      if (this.animating) return;
      this.animating = true;

      if (this.instituteIndex == 0) {
        this.fieldIndex--;
        this.instituteIndex = this.lastInstituteIndex;
        this.$refs.contents.forEach((el) => this.animateTranslate(el, -100 * this.fieldIndex));
      } else {
        this.instituteIndex--;
      }

      if (this.currentInstitutesRef) this.animateTranslate(this.currentInstitutesRef, -100 * this.instituteIndex);
      this.contentDisplayed();
    },
    next() {
      if (this.animating) return;
      this.animating = true;

      if (this.instituteIndex == this.lastInstituteIndex) {
        this.fieldIndex++;
        this.instituteIndex = 0;
        this.$refs.contents.forEach((el) => this.animateTranslate(el, -100 * this.fieldIndex));
      } else {
        this.instituteIndex++;
      }

      if (this.currentInstitutesRef) this.animateTranslate(this.currentInstitutesRef, -100 * this.instituteIndex);
      this.contentDisplayed();
    },
  },
};
</script>
