import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import { preset } from 'vue-cli-plugin-vuetify-preset-basil/preset'
import { firestorePlugin } from 'vuefire';

Vue.use(Vuetify);
Vue.use(firestorePlugin);

export default new Vuetify({
  preset,
});
