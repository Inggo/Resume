<template>
  <span
    class="app-icon"
    :class="{ 'app-icon--spin': spin }"
    v-html="svg"
    aria-hidden="true"
  ></span>
</template>

<script>
// Inline-SVG icon registry. Every file in src/icons/*.svg is bundled at build
// time and exposed by its filename, e.g. `github.svg` -> <AppIcon name="github" />.
// To add an icon, drop a Tabler (or any) SVG into src/icons/ — no code changes.
const modules = import.meta.glob('../icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const registry = {};
for (const path in modules) {
  const name = path.split('/').pop().replace('.svg', '');
  // Tabler ships its SVGs with an `icon icon-tabler icons-tabler-outline …`
  // class and explicit width/height="24" attributes. Both collide with
  // app CSS — that `icon` class matches rules like `.cube-controls .icon`
  // and applies flex layout to the SVG element itself — so strip them and
  // let our own CSS drive sizing/styling.
  registry[name] = modules[path]
    .replace(/\s+(?:width|height)="[^"]*"/g, '')
    .replace(/\s+class="[^"]*"/g, '');
}

export default {
  name: 'AppIcon',
  props: {
    // Accepts either a bare name ("github") or a legacy "icon-github" string.
    name: { type: String, required: true },
    spin: { type: Boolean, default: false },
  },
  computed: {
    svg() {
      const key = this.name.replace(/^icon-/, '');
      const found = registry[key];
      if (!found && import.meta.env?.DEV) {
        console.warn(`[AppIcon] unknown icon "${this.name}" (looked up "${key}")`);
      }
      return found || '';
    },
  },
};
</script>
