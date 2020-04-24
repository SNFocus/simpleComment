import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import { Button, Layout, Menu, Icon, Tooltip, Divider, Dropdown, Row, Col, Tree, Popover } from 'ant-design-vue'
import ScFormItem from '@components/ScFormItem/index.vue'
import ScSwitch from '@components/ScSwitch/index.vue'

Vue.component(ScFormItem.name, ScFormItem)
Vue.component(ScSwitch.name, ScSwitch)
Vue.use(Button)
Vue.use(Layout)
Vue.use(Menu)
Vue.use(Icon)
Vue.use(Tooltip)
Vue.use(Divider)
Vue.use(Dropdown)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tree)
Vue.use(Popover)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
