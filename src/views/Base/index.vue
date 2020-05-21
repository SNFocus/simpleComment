<template>
    <div style="width: 100%;height: 100%;padding: 24px 16px 16px;display:flex;">
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
          <pre id="preview-pane">{{comment}}</pre>
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
    </div>
</template>

<script lang="ts">
import Bus from '@assets/utils/bus'
import TypePane from '@components/TypePane/index.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { navConfig, NavItemIF } from '@assets/config/baseConfig'
import { genCommByCmd, copyData } from '@assets/utils'
// import { State, Mutation } from 'vuex-class'
declare interface Point {
  x: number;
  y: number;
}
@Component({
  components: {
    [TypePane.name]: TypePane
  }
})
export default class Home extends Vue {
    readonly navConfig: NavItemIF[] = navConfig
    // 控制侧边栏折叠
    isCollapsed = true;
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
 * 复制文本到剪贴板
 */
    copyData () {
      copyData(this.comment)
      this.$message.success('您的注释已经复制到剪贴板啦！')
    }

    /**
 * 路由变化时的回调 用于清空注释面板
 * @callback
 * @param {String} type - 基础类型菜单下的注释类型
 */
    refreshPropPane (type: string): void {
      this.comment = ''
      switch (type) {
        case 'cmd':
          this.getCmdComment()
      }
    }

    /**
 * 获取基础类型菜单下的子类型
 * @returns {String}
 */
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
#preview-pane{
  margin: 0;
  overflow: unset;
  transform-origin: left top;
  transform: scale(.5)
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
