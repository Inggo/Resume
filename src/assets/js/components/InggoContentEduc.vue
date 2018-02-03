<template>
  <div v-if="content">
    <ul class="educ-contents">
      <li v-for="field in fields">
        <h2>{{ field.label }}</h2>
        <ul class="educ-institutes">
          <li v-for="item in content[field.key]">
            <h3>{{ item.institution }}</h3>
            <aside class="educ-info">
              <p>
                <span v-if="item.location">{{ item.location }}</span>
                <a v-if="item.link" :href="item.link" target="_blank">
                  {{ item.link }}
                </a>
              </p>
              <p>{{ item.date }}</p>
            </aside>
            <p>{{ item.degree }}</p>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'InggoContentEduc',
  props: ['content'],
  data () {
    return {
      fields: [
        {
          key: 'secondary',
          label: 'Secondary Education'
        },
        {
          key: 'primary',
          label: 'Primary Education'
        }
      ]
    }
  }
}
</script>
