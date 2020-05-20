import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import { Button, Layout, Menu, Icon, Tooltip, Divider, Dropdown, Row, Col, Tree, Popover, Modal, message, Input, Select } from 'ant-design-vue'
import ScFormItem from '@components/ScFormItem/index.vue'
import ScSwitch from '@components/ScSwitch/index.vue'
import ScTree from '@components/ScTree/index.vue'
import { copyData } from '@assets/utils'
Vue.component(ScFormItem.name, ScFormItem)
Vue.component(ScSwitch.name, ScSwitch)
Vue.component(ScTree.name, ScTree)
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
Vue.use(Modal)
Vue.use(Input)
Vue.use(Select)
Vue.prototype.$message = message
Vue.config.productionTip = false

window._customComments = JSON.parse(localStorage.getItem('customComments') || '[]')
document.addEventListener('keydown', function (e) {
  if (!e.ctrlKey) return
  const target = window._customComments.find(t => {
    return t.shortCuts[1] === e.key
  })
  if (target && target.comment) {
    copyData(target.comment)
    message.success('您的注释已经复制到剪贴板啦！')
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
