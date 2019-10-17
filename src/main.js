require('reset-css')
require('./assets/fonts/Patron/Patron.css')
require('./assets/styles/styles.scss')
require('./assets/svg/getthebuzz_logo.svg')
require('./assets/js/app.js')
require('./assets/png/pattern01.png')
require('./assets/png/pattern02.png')
require('./assets/png/pattern03.png')
require('./assets/png/pattern04.png')
require('./assets/png/pattern05.png')
require('./assets/png/pattern06.png')
require('./assets/png/pattern07.png')
require('./assets/png/pattern08.png')

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Meta from 'vue-meta'
import {VueMasonryPlugin} from 'vue-masonry'
import infiniteScroll from 'vue-infinite-scroll'
import VueAnalytics from 'vue-analytics'
import Siema from 'vue2-siema'

Vue.use(Siema)
Vue.use(VueMasonryPlugin)
Vue.use(Meta)
Vue.use(infiniteScroll)
Vue.use(VueAnalytics, {
    id: 'UA-55869643-1',
    router
  })

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  created: function() {
    console.log('https://bymarkbrand.com');
  }
})
