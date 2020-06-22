import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import router from './router/router.js'
import store from './store/index'
import { messages } from './libs/language'

import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

Vue.use(ViewUI);
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages
})

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
