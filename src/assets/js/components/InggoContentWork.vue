<template>
  <div v-if="content">
    <h2>Work Experience</h2>
    <ul class="work-contents">
      <li v-for="item in content">
        <h3>{{ item.company }}</h3>
        <p class="subtitle">{{ item.location }}</p>
        <ul class="work-titles">
          <li v-for="title in item.titles">
            <h4>{{ title.name }}</h4>
            <p class="subtitle">{{ title.date }}</p>
            <ul class="work-responsibilities">
              <li v-for="responsibility in title.responsibilities">{{ responsibility }}</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'InggoContentWork',
  props: ['content']
}
</script>
