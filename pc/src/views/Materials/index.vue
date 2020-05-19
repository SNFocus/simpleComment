
<template>
  <div class="materials-wrapper">
    <div class="actions">
      <sc-switch
      v-model="useDarkTheme"
      :useText="true"
      label="主题"
      trueText="dark"
      falseText="light"
      @click.stop="_ => {}"
      @change="initCanvas"
      style="margin-left: 1rem;"></sc-switch>
      <a href="http://www.asciiworld.com/" target="_blank" class="link" :class="{light: !useDarkTheme}">
      采集自AsciiWorld等网络渠道网络
      </a>
    </div>
    <canvas class="canvas" :style="{background: getConfig().bgColor}"></canvas>
    <a-modal title="预览" v-model="visible" @ok="handleOk" width="700px" okText="Copy">
      <pre v-if="activeData">{{ activeData && activeData.value }}</pre>
    </a-modal>
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import comments from '@assets/commentStore/recommend.js'
import { CommentBox } from './CommentBox'
import { copyData } from '@assets/utils/index'

declare interface CommentItem {
  key: string;
  value: string;
}

declare interface Comment {
  [key: string]: string;
}
declare interface Config {
  letterWidth: number;
  fontSize: number;
  lineHeight: number;
  fontColor: string;
  bgColor: string;
}
declare interface ToolForm {
  dark: Config;
  light: Config;
}
@Component
export default class Materials extends Vue {
  theme = 'dark'
  commentList: any
  maxWidth !: number
  maxHeight !: number
  useDarkTheme = true
  config: ToolForm = {
    dark: {
      letterWidth: 5,
      fontSize: 7,
      lineHeight: 12,
      fontColor: 'white',
      bgColor: 'rgba(0, 0, 0, 0.85)'
    },
    light: {
      letterWidth: 5,
      fontSize: 8,
      lineHeight: 12,
      fontColor: 'dark',
      bgColor: '#f5f5f5'
    }
  }

  drawStep = 16
  currentIndex = 16

  ctx !: CanvasRenderingContext2D
  commBoxs: CommentBox[] = []
  activeData: CommentBox | null = null
  visible = false

  created () {
    const temp = comments as Comment
    this.commentList = Object.keys(temp).map((key: string) => ({
      key: key,
      value: temp[key]
    }))
  }

  getConfig () {
    return this.useDarkTheme ? this.config.dark : this.config.light
  }

  mounted (): void {
    this.initCanvas()
  }

  handleOk () {
    if (this.activeData) {
      copyData(this.activeData.value)
      this.$message.success('复制到你的剪贴板了！')
      this.visible = false
    }
  }

  showToolBar (data: CommentBox): void {
    this.activeData = data
    this.visible = true
  }

  initCanvas () {
    const wrapper = document.querySelector('.materials-wrapper') as HTMLCanvasElement
    const canvas = document.querySelector('.canvas') as HTMLCanvasElement
    canvas.height = 30000
    canvas.width = this.maxWidth = wrapper.clientWidth
    this.startDraw(canvas)
    this.initCanvasEvent(canvas)
  }

  startDraw (canvas: HTMLCanvasElement): void {
    console.time()
    let width = this.getConfig().letterWidth
    let height = this.getConfig().lineHeight
    let lastRowMaxHeight = 0 // 记录上一行注释块的最大高度
    const startPoint = { x: 0, y: 0 }
    const endPoint = { x: 0, y: 0 }
    let currentRowMaxHeight = 0
    this.commentList.forEach((t: CommentItem) => {
      const [commWidth, commHeight] = this.getCommentProp(t.value)
      if (commHeight > currentRowMaxHeight) {
        currentRowMaxHeight = commHeight
      }
      if (width + commWidth > this.maxWidth) { // 换行
        width = this.getConfig().letterWidth
        lastRowMaxHeight += this.getConfig().lineHeight * 2 + currentRowMaxHeight
        height = lastRowMaxHeight
        currentRowMaxHeight = 0
      }
      // this.drawComment(t.value, width, height)
      startPoint.x = width
      startPoint.y = height
      endPoint.x = width + commWidth
      endPoint.y = height + commHeight
      width = endPoint.x + 30
      this.commBoxs.push(new CommentBox(t.key, startPoint, endPoint, t.value))
      // const imgData = this.ctx.getImageData(0, 0, this.maxWidth, lastRowMaxHeight + currentRowMaxHeight)
      // canvas = document.querySelector('.canvas') as HTMLCanvasElement
      // canvas.height = lastRowMaxHeight + currentRowMaxHeight
      // this.ctx.putImageData(imgData, 0, 0)
    })
    canvas.height = this.commBoxs[this.commBoxs.length - 1].endPoint.y + 30
    console.timeEnd()
    console.time()
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.ctx.font = `${this.getConfig().fontSize}px Georgia`
    this.ctx.fillStyle = this.getConfig().fontColor
    this.ctx.shadowColor = this.getConfig().fontColor
    this.useDarkTheme && (this.ctx.shadowBlur = 5)

    this.commBoxs.forEach((t: CommentBox, idx: number) => {
      const delay = idx > 20 ? (idx * 1000 / 20) : 0
      console.log(delay, t.startPoint.y)
      setTimeout(() => {
        this.drawComment(t.value, t.startPoint.x, t.startPoint.y)
        if (idx === this.commBoxs.length - 1) {
          console.timeEnd()
        }
      }, delay)
    })
  }

  drawComment (comment: string, startWidth: number, startHeight: number) {
    let width = startWidth
    let height = startHeight
    for (let i = 0, len = comment.length; i < len; i++) {
      const char = comment.charAt(i)
      this.ctx.fillText(char, width, height)
      width += this.getConfig().letterWidth
      if (char === '\n') {
        height += this.getConfig().lineHeight
        width = startWidth
      }
    }
  }

  getCommentProp (comment: string): number[] {
    let heightCounter = 1
    let lastIndex = 0
    let from = lastIndex
    let maxWidth = 0
    while (true) {
      from = comment.indexOf('\n', lastIndex + 1) // 下一个换行符的索引
      if (from < 0) break
      if (maxWidth < from - lastIndex) {
        maxWidth = from - lastIndex
      }
      lastIndex = from
      heightCounter++
    }
    return [maxWidth * this.getConfig().letterWidth, heightCounter * this.getConfig().lineHeight]
  }

  initCanvasEvent (canvas: HTMLCanvasElement) {
    canvas.addEventListener('click', (event: MouseEvent) => {
      const target = this.commBoxs.find(t => t.inBox({ x: event.offsetX, y: event.offsetY }))
      target && this.showToolBar(target)
    })
  }
}
</script>

<style lang="scss" scoped>
.materials-wrapper{
  .actions {
    position: absolute;
    top: -1.5rem;
    right: 3rem;
    text-align: center;
    z-index: 99;
    transition: top .5s;

    &:hover{
      top: 0;
    }
  }
  height: 100%;
  width: 100%;
  overflow: auto;
  position: relative;

  .link{
    font-size: 10px;
    color: white;
    padding: 1rem;

    &.light{
      color: #333;
    }

    &:hover{
      text-shadow: 0 0 6px rgba($color: #fff, $alpha: .7);
    }
  }
}
.materials{
  height: 100%;
  width: 100%;
  padding-top: 1rem;
  padding-left: 1rem;
  overflow: auto;
  color: $bg-dark;
  .box{
    width: 48%;
    margin-right: 2%;
    overflow: auto;
    display: inline-block;
    border: 4px dashed #e5e5e5;
    background: $bg-light;
    &:hover{
        box-shadow: $shadow;
    }
    pre{
      float: left;
      margin: 1rem;
    }
  }
}

.tool-pane{
  position: fixed;
  right: 15px;
  top: 0;
  padding: .5rem 1rem;
  background: $bg-light;
  z-index: 999;

  .form-item{
    .label{
      margin-right: 1rem;
      vertical-align: middle;
      line-height: 32px;
    }
  }
}

</style>
