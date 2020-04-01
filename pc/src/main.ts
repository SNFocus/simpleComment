import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import { Button, Layout, Menu, Icon, Tooltip, Divider, Dropdown } from 'ant-design-vue'
import ScFormItem from '@components/ScFormItem'

Vue.component(ScFormItem.name, ScFormItem)
Vue.use(Button)
Vue.use(Layout)
Vue.use(Menu)
Vue.use(Icon)
Vue.use(Tooltip)
Vue.use(Divider)
Vue.use(Dropdown)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
