
<template>
  <div class="materials-wrapper">
    <a href="http://www.asciiworld.com/" target="_blank" class="link">大部分采集自AsciiWorld</a>
    <canvas class="canvas" :style="{background: config.bgColor}"></canvas>
    <!-- <div class="tool-pane">
      <div class="form-item">
        <span class="label">前景色</span>
      </div>
      <div class="form-item">
        <span class="label">背景色</span>
      </div>
    </div> -->
    <a-modal title="Basic Modal" v-model="visible" @ok="handleOk" width="700px" okText="Copy">
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
declare interface ToolForm {
  letterWidth: number;
  fontSize: number;
  lineHeight: number;
  fontColor: string;
  bgColor: string;
}
@Component
export default class Materials extends Vue {
  commentList: any
  maxWidth !: number
  maxHeight !: number
  config: ToolForm = {
    letterWidth: 5,
    fontSize: 5,
    lineHeight: 12,
    fontColor: 'white',
    bgColor: 'rgba(0, 0, 0, 0.85)'
  }

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
    canvas.height = 10000 || wrapper.clientHeight
    canvas.width = this.maxWidth = wrapper.clientWidth

    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.ctx.font = `${this.config.fontSize}px Georgia`
    this.ctx.fillStyle = this.config.fontColor
    this.ctx.shadowColor = this.config.fontColor
    this.ctx.shadowBlur = 5
    this.startDraw()
    this.initCanvasEvent(canvas)
  }

  startDraw (): void {
    let width = this.config.letterWidth
    let height = this.config.lineHeight
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
        width = this.config.letterWidth
        lastRowMaxHeight += this.config.lineHeight * 2 + currentRowMaxHeight
        height = lastRowMaxHeight
        currentRowMaxHeight = 0
      }
      this.drawComment(t.value, width, height)
      startPoint.x = width
      startPoint.y = height
      endPoint.x = width + commWidth
      endPoint.y = height + commHeight
      width = endPoint.x + 30
      this.commBoxs.push(new CommentBox(t.key, startPoint, endPoint, t.value))
    })
    const imgData = this.ctx.getImageData(0, 0, this.maxWidth, lastRowMaxHeight + currentRowMaxHeight)
    const canvas = document.querySelector('.canvas') as HTMLCanvasElement
    canvas.height = lastRowMaxHeight + currentRowMaxHeight
    this.ctx.putImageData(imgData, 0, 0)
  }

  drawComment (comment: string, startWidth: number, startHeight: number) {
    let width = startWidth
    let height = startHeight
    for (let i = 0, len = comment.length; i < len; i++) {
      const char = comment.charAt(i)
      this.ctx.fillText(char, width, height)
      width += this.config.letterWidth
      if (char === '\n') {
        height += this.config.lineHeight
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
    return [maxWidth * this.config.letterWidth, heightCounter * this.config.lineHeight]
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
  height: 100%;
  width: 100%;
  overflow: auto;
  position: relative;

  .link{
    font-size: 10px;
    color: white;
    position: absolute;
    padding: 1rem;

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
