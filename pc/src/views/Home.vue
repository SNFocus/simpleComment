<template>
  <a-layout id="components-layout-demo-responsive">
    <a-layout-sider
      v-model="isCollapsed"
      collapsible
    >
      <div
        class="logo"
        @click="isCollapsed = !isCollapsed" >
        {{ isCollapsed ? "SC" : "SComment" }}
      </div>
      <a-menu
        theme="dark"
        mode="inline"
        :defaultSelectedKeys="['base']" >
        <a-menu-item v-for="(item) in navConfig" :key="item.key">
          <router-link :to="'/' + item.key">
            <a-icon :type="item.icon" />
            <span class="nav-text">{{ item.label }}</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <!-- <a-layout-header :style="{ background: '#fff', padding: 0 }" /> -->
      <a-layout-content style="overflow: hidden;margin: 24px 16px 16px; display: flex;">
        <div style="width: 56%;">
          <div class="content-pane" :class="{big: detailMode}">
            <div style="padding: 0 24px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="54" height="14" viewBox="0 0 54 14"><g fill="none" fill-rule="evenodd" transform="translate(1 1)"><circle cx="6" cy="6" r="6" fill="#FF5F56" stroke="#E0443E" stroke-width=".5"></circle><circle cx="26" cy="6" r="6" fill="#FFBD2E" stroke="#DEA123" stroke-width=".5"></circle><circle cx="46" cy="6" r="6" fill="#27C93F" stroke="#1AAB29" stroke-width=".5"></circle></g></svg>
                <div class="actions">
                  <a-tooltip  placement="bottom">
                        <template slot="title">
                            {{detailMode ? '还原' : '最大化'}}
                        </template>
                        <a-icon v-if="detailMode" class="action-btn" type="close-square" @click="detailMode = false" />
                        <a-icon v-else class="action-btn" type="border" @click="detailMode = true" />
                    </a-tooltip>

                     <a-tooltip  placement="bottom">
                        <template slot="title">
                            复制到剪贴板
                        </template>
                        <a-icon class="action-btn" type="copy" @click="copyData" />
                    </a-tooltip>
                </div>
            </div>
            <div class="comment-box" :style="{height: getBaseType() === 'cmd' ? 'calc(100% - 50px)' : '100%'}">
              <pre style="margin: 0;overflow: unset;">{{comment}}</pre>
            </div>
            <div class="cmd-box" :class="{show: getBaseType() === 'cmd'}">
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
          <type-pane />
        </div>
        <div class="template-pane normal-padding ">
            <router-view />
        </div>
        <!-- <ui-pane :activeNavKey="activeNavKey" :activeTypeKey="activeTypeKey" @genComment="getComment"></ui-pane> -->
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import Bus from '@assets/utils/bus'
import TypePane from '@components/TypePane'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { navConfig, NavItemIF } from '@assets/config/baseConfig'
import { genCommByCmd, getRandomColor } from '@assets/utils'
// import { State, Mutation } from 'vuex-class'
// import { picStore } from '../assets/commentStore/picture'
declare interface Point {
  x: number;
  y: number;
}
@Component({
  components: {
    [TypePane.name]: TypePane
    // [UiPane.name]: UiPane
  }
})
export default class Home extends Vue {
    readonly navConfig: NavItemIF[] = navConfig
    // 控制侧边栏折叠
    isCollapsed = true;
    // 侧边栏当前Tab标识数组
    // 当前展示的注释文本
    comment = ''
    // 命令行输入内容
    cmdText = '@func -d.O(∩_∩)O .. -p.emoje./(ㄒoㄒ)/~~.. -r.string...'
    // 查看模式  会把注释面板最大化
    detailMode = false

    created (): void {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const vm = this
      /** **********    按下Esc时退出放大模式(detailMode)    ************/
      document.addEventListener('keydown', (event: KeyboardEvent) => {
        vm.detailMode && event.keyCode === 27 && (vm.detailMode = false)
      })
      Bus.$on('genComment', this.getComment)
    }

    /**
 * cmdInput失去焦点时更新面板注释
 */
    getCmdComment (): void {
      this.cmdText && this.getComment({ comment: genCommByCmd(this.cmdText) })
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
 * @callback
 * 路由变化时的回调 用于清空注释面板
 * @param {String} type - 基础类型菜单下的注释类型
 */
    refreshPropPane (type: string): void {
      this.comment = ''
      switch (type) {
        case 'cmd':
          this.getCmdComment()
      }
    }

    getBaseType (): string {
      const paths = this.$route.path.split('/').slice(1)
      return paths[0] === 'base' ? paths[1] : ''
    }

    @Watch('$route.path', { immediate: true })
    onPathChange (path: string): void{
      const paths = path.split('/').slice(1)
      this.getBaseType() && this.refreshPropPane(paths[1])
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
  width: 98%;
  height: 60%;
  z-index: 999;
  margin-right: 2%;
  margin-bottom: 2%;
  padding-top: 12px;
  padding-bottom: 12px;
  background: $bg-dark;
  box-shadow: $card-shadow;
  border-radius: $radius;
  overflow: hidden;
  position: relative;
  transition: width 1s, height 1s;

  &.big {
    top: 0;
    left: 0;
    width: 179%;
    height: 100%;
  }

  .comment-box {
    padding-left: 16px;
    padding-right: 16px;
    overflow: auto;
    height: 100%;
    width: calc(100% + 12px);
  }

  .actions{
      float: right;
      cursor: pointer;

      .action-btn{
        margin-left: 4px;
        margin-right: 4px;
        &:hover{
          color: $hover-bg-color;
        }
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

.template-pane {
  width: 44%;
  border-radius: $radius;
  background: $bg-light;
}

@keyframes blink {
  from{ opacity: 0; }
  to{ opacity: 1; }
}
</style>
