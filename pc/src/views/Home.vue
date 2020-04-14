<template>
  <a-layout id="components-layout-demo-responsive">
    <a-layout-sider
      v-model="isCollapsed"
      collapsible
    >
      <div
        class="logo"
        @click="isCollapsed = !isCollapsed"
      >
        {{ isCollapsed ? "SC" : "SComment" }}
      </div>
      <a-menu
        theme="dark"
        mode="inline"
        v-model="current"
      >
        <a-menu-item v-for="(item) in navConfig" :key="item.key">
          <a-icon :type="item.icon" />
          <span class="nav-text">{{ item.label }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <!-- <a-layout-header :style="{ background: '#fff', padding: 0 }" /> -->
      <a-layout-content :style="{ margin: '24px 16px 16px', display: 'flex' }">
        <div style="flex: 1;">
          <div class="content-pane">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="54" height="14" viewBox="0 0 54 14"><g fill="none" fill-rule="evenodd" transform="translate(1 1)"><circle cx="6" cy="6" r="6" fill="#FF5F56" stroke="#E0443E" stroke-width=".5"></circle><circle cx="26" cy="6" r="6" fill="#FFBD2E" stroke="#DEA123" stroke-width=".5"></circle><circle cx="46" cy="6" r="6" fill="#27C93F" stroke="#1AAB29" stroke-width=".5"></circle></g></svg>
                <div class="actions">
                     <a-tooltip>
                        <template slot="title">
                            复制到剪贴板
                        </template>
                        <a-icon type="copy" @click="copyData" />
                    </a-tooltip>
                </div>
            </div>
            <pre>{{comment}}</pre>
          </div>
          <type-pane :activeNavKey="activeNavKey" :activeTypeKey.sync="activeTypeKey"></type-pane>
        </div>
        <ui-pane :activeNavKey="activeNavKey" :activeTypeKey="activeTypeKey" @genComment="getComment"></ui-pane>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { navConfig, NavItemIF } from '@assets/config/baseConfig'
import TypePane from '@components/TypePane'
import UiPane from '@components/UiPane'
import { wrapComment, genCommByCmd, multilineWrapper } from '@assets/utils'
// import { State, Mutation } from 'vuex-class'

declare interface Point {
  x: number;
  y: number;
}
@Component({
  components: {
    [TypePane.name]: TypePane,
    [UiPane.name]: UiPane
  }
})
export default class Home extends Vue {
    readonly navConfig: NavItemIF[] = navConfig
    // 控制侧边栏折叠
    isCollapsed = true;
    // 侧边栏当前Tab标识数组
    current: string[] = ['baseType'];
    // 侧边栏当前Tab标识
    activeNavKey = '';
    // 当前选中的展示类型
    activeTypeKey = '';
    // 当前展示的注释文本
    comment = ''

    created (): void {
      this.reloadGlobalKeys()
    }

    /**
 * 初始化默认侧边栏选项和类型面板选项
 */
    reloadGlobalKeys () {
      this.activeNavKey = this.current[0]
      this.activeTypeKey = this.navConfig.find(t => t.key === this.activeNavKey).typeList[0].key
    }

    /**
 * 监听UiPane数据变动，获取最新注释文本
 * @param {String} comment - 注释文本
 * @param {Number} payload - 最大宽度
 */
    getComment ({ comment, payload }: CommData): void{
      this.comment = comment
      console.log(wrapComment(comment), payload)
      const funcComm = genCommByCmd('@func  -d.发发的犯得上发射点发大夫士大夫..  -p.string.number. ID - 学生编号 .. -r.f犯得上反对法..   -p.string.number. Ifd - 学生fsdf编号 .. ')
      console.log(multilineWrapper(funcComm))
    }

    /**
 * 监听复制按钮点击事件，执行复制注释文本
 * @param {MouseEvent} ev - 鼠标事件对象
 */
    copyData (ev: MouseEvent): void {
      const textarea = document.createElement('textarea')
      textarea.value = this.comment
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('Copy')
      document.body.removeChild(textarea)
      this.showMouseMsg(this.getMousePoint(ev), '已复制')
    }

    /**
 * 响应用户操作，再鼠标旁显示消息
 * @param {Point} point - 鼠标坐标
 * @example {x: 0, y: 0}
 * @param {String} text - 消息文本
 */
    showMouseMsg (point: Point, text: string): void {
      const div = document.createElement('div')
      div.innerHTML = text
      div.style.position = 'fixed'
      div.style.left = point.x + 'px'
      div.style.top = (point.y - 12) + 'px'
      div.style.transition = 'top .6s'
      div.style.color = '#4caf50'
      div.style.fontSize = '12px'
      document.body.appendChild(div)
      setTimeout(() => {
        div.style.top = (point.y - 32) + 'px'
      }, 0)
      setTimeout(() => {
        document.body.removeChild(div)
      }, 600)
    }

    /**
 * 根据MouseEvent获取相对文档的鼠标坐标
 * @param {MouseEvent} event - 鼠标事件对象
 * @returns {Point} 相对于文档的坐标
 */
    getMousePoint (event: MouseEvent): Point {
      const ev = event || window.event
      const scrollX = document.documentElement.scrollLeft || document.body.scrollLeft
      const scrollY = document.documentElement.scrollTop || document.body.scrollTop
      const x = ev.pageX || ev.clientX + scrollX
      const y = ev.pageY || ev.clientY + scrollY
      return { x, y }
    }

    @Watch('current')
    onCurrentChange (): void {
      this.reloadGlobalKeys()
    }
}
</script>

<style lang="scss" scoped>
#components-layout-demo-responsive {
  height: 100%;
  .logo {
    height: 32px;
    cursor: pointer;
    margin: 16px;
    color: white;
    line-height: 32px;
    text-align: center;
    background: rgba(255, 255, 255, 0.2);
  }
}

.content-pane {
  color: $color-light;
  height: 60%;
  margin-right: 2%;
  margin-bottom: 2%;
  padding: 12px 24px;
  background: $bg-dark;
  box-shadow: $card-shadow;
  border-radius: $radius;
  overflow: auto;

  .actions{
      float: right;
      cursor: pointer;
      &:hover{
          color: $hover-bg-color;
      }
  }
}

</style>
