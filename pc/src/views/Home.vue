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
        <div style="flex: 1;max-width: 52%;">
          <div class="content-pane">
            <div style="padding-right: 24px;">
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
            <div class="comment-box"><pre>{{comment}}</pre></div>
            <div class="cmd-box" :class="{show: activeTypeKey === 'cmd'}">
              <a-icon type="right" style="margin-right:16px;" />
              <textarea
                type="textarea"
                placeholder="命令行在这儿(＾Ｕ＾)ノ~ＹＯ"
                v-model="cmdText"
                class="cmd-input"
                @keydown.enter="getCmdComment"
                @focus="getCmdComment"
                @blur="getCmdComment" >
              </textarea>
            </div>
          </div>
          <type-pane :activeNavKey="activeNavKey" :activeTypeKey.sync="activeTypeKey" @change="onTypeChange"></type-pane>
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
import { genCommByCmd, getRandomColor, wrapComment } from '@assets/utils'
// import { State, Mutation } from 'vuex-class'
import { picStore } from '../assets/commentStore/picture'
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
    // 命令行输入内容
    cmdText = '@func -d.O(∩_∩)O .. -p.emoje./(ㄒoㄒ)/~~.. -r.string...'

    created (): void {
      this.reloadGlobalKeys()
    }

    /**
 * cmdInput失去焦点时更新面板注释
 */
    getCmdComment (): void {
      this.cmdText && this.getComment({ comment: genCommByCmd(this.cmdText) })
      this.comment = wrapComment(picStore.alien4)
    }

    /**
 * 初始化默认侧边栏选项和类型面板选项
 */
    reloadGlobalKeys (): void {
      this.activeNavKey = this.current[0]
      this.activeTypeKey = this.navConfig.find(t => t.key === this.activeNavKey).typeList[0].key
    }

    /**
 * 监听UiPane数据变动，获取最新注释文本
 * @param {String} comment - 注释文本
 * @param {Number} payload - 最大宽度
 */
    getComment ({ comment }: CommData): void{
      this.comment = comment
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
      div.style.color = getRandomColor()
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

    /**
 * 清除注释展示文本
 */
    clearComment (): void{
      this.comment = ''
    }

    onTypeChange () {
      switch (this.activeTypeKey) {
        case 'cmd':
          this.clearComment()
          this.getCmdComment()
      }
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
  padding-right: 0;
  background: $bg-dark;
  box-shadow: $card-shadow;
  border-radius: $radius;
  overflow: hidden;
  position: relative;

  .comment-box {
    overflow: auto;
    height: calc(100% - 50px);
    width: calc(100% + 12px);
  }

  .actions{
      float: right;
      cursor: pointer;

      &:hover{
          color: $hover-bg-color;
      }
  }
}
.cmd-box{
  width: 88%;
  height: 0;
  line-height: 24px;
  position: absolute;
  left: 0;
  overflow: hidden;
  bottom: 10px;
  color: $color-light;
  padding-left: 20px;
  transition: height 1s;
  &.show{
    height: 24px;
  }
  .cmd-input{
    position: absolute;
    top: 0;
    left: 20px;
    right: 0;
    bottom: 0;
    background: inherit;
    border: none;
    padding-left: 20px;
    width: 100%;
    letter-spacing: 1px;

    &:focus{
      outline: none;
    }

  }
  .type-char{
    animation: blink 1s linear infinite;
  }
}

@keyframes blink {
  from{ opacity: 0; }
  to{ opacity: 1; }
}
</style>
