import { store } from './store/index.js';
import AppIcon from './components/AppIcon.vue';

export default (app) => {
  app.use(store);
  app.component('AppIcon', AppIcon);
};
