import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { Button, Layout, Menu, Icon, Radio } from 'ant-design-vue'
Vue.use(Button)
Vue.use(Layout)
Vue.use(Menu)
Vue.use(Icon)
Vue.use(Radio)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
