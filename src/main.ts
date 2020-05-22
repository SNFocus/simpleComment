import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store/store'
import { Button, Layout, Menu, Icon, Tooltip, Divider, Dropdown, Row, Col, Tree, Popover, Modal, message, Input, Select, Slider } from 'ant-design-vue'
import ScFormItem from '@components/ScFormItem/index.vue'
import ScSwitch from '@components/ScSwitch/index.vue'
import ScTree from '@components/ScTree/index.vue'
// class-component-hooks.js
import Component from 'vue-class-component'
import { copyData } from '@assets/utils'
Vue.component('sc-form-item', ScFormItem)
Vue.component('sc-switch', ScSwitch)
Vue.component('sc-tree', ScTree)
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
Vue.use(Slider)
Vue.prototype.$message = message
Vue.config.productionTip = false

const comment = `


█████▒█    ██  ▄████▄   ██ ▄█▀         ██████╗ ██╗   ██╗ ██████╗
▓██   ▒ ██  ▓██▒▒██▀ ▀█   ██▄█▒        ██╔══██╗██║   ██║██╔════╝
▒████ ░▓██  ▒██░▒▓█    ▄ ▓███▄░        ██████╔╝██║   ██║██║  ███╗
░▓█▒  ░▓▓█  ░██░▒▓▓▄ ▄██▒▓██ █▄        ██╔══██╗██║   ██║██║   ██║
░▒█░   ▒▒█████▓ ▒ ▓███▀ ░▒██▒ █▄       ██████╔╝╚██████╔╝╚██████╔╝
▒ ░   ░▒▓▒ ▒ ▒ ░ ░▒ ▒  ░▒ ▒▒ ▓▒       ╚═════╝  ╚═════╝  ╚═════╝
░     ░░▒░ ░ ░   ░  ▒   ░ ░▒ ▒░
░ ░    ░░░ ░ ░ ░        ░ ░░ ░
        ░     ░ ░      ░  ░

`
const data = {
  id: 1,
  shortCuts: ['Ctrl', 'g'],
  comment: comment
}
window._customComments = JSON.parse(localStorage.getItem('customComments') || JSON.stringify([data]))
document.addEventListener('keydown', function (e) {
  if (!e.shiftKey) return
  const target = window._customComments.find(t => t.shortCuts[1] === e.key.toLowerCase())
  if (target && target.comment) {
    copyData(target.comment)
    message.success('您的注释已经复制到剪贴板啦！')
  }
})

// Register the router hooks with their names
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate' // for vue-router 2.2+
])

new Vue({
  router,
  // store,
  render: h => h(App)
}).$mount('#app')
