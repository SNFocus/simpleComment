<template>
  <div style="height: 100%;">
    <div style="height: 60%;display: flex;overflow: auto;cursor:pointer;" @click="$refs.upload.click()">
      <img v-if="imgSource" :src="imgSource" style="margin: auto;max-width:100%;" @load="onImageLoad" />
      <span v-else style="margin: auto;">点击选择图片JPG/PNG</span>
    </div>
    <a-divider orientation="left"><a-icon  type="setting" /> &nbsp;设置</a-divider>
    <a-row>
      <a-col :span="0" >
        <sc-form-item label="上传图片">
          <span>{{fileName}}</span>
          <input ref="upload" type="file" accept="image/png, image/jpeg" @change="onImageUpload" />
        </sc-form-item>
      </a-col>
      <a-col :span="12">
        <sc-form-item label="压缩宽度">
          <input type="text" v-model="targetWidth" style="width: 220px;" @change="onConfigChange">
        </sc-form-item>
      </a-col>
      <a-col :span="12">
        <sc-form-item label="转换文字">
          <input type="text" v-model="customTransferText" style="width: 220px;" @change="onConfigChange">
        </sc-form-item>
      </a-col>
      <a-col :span="12">
        <sc-form-item label="预览缩放(CSS)">
         <a-slider v-model="previeScale"  style="width: 100%;" @change="onScaleChange"/>
        </sc-form-item>
      </a-col>
    </a-row>
    <canvas width="1000" height="1000" ref="canvas" style="display: none;"></canvas>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Bus from '@assets/utils/bus.ts'
import { debounce } from '@assets/utils/index.ts'
const changeScale = debounce((num: number) => {
  const pre = document.getElementById('preview-pane')
  if (pre) {
    pre.style.transform = `scale(${num / 100})`
  }
}, 200)
let ctx!: CanvasRenderingContext2D
@Component
export default class PictureText extends Vue {
  // 图片对象
  imageObj: HTMLImageElement;
  // 上传图片的链接
  imgSource = ''
  fileName = '未上传'
  // 照片缩放程度
  targetWidth = 200
  // 自定义转换文字
  customTransferText = '@#&$%863!i1uazvno~;*^+-. '
  // 控制预览界面transform scale 缩放比例
  previeScale = 60

  /**
   * 监听文件上传
   * @listener
   * @param {Event} event - 事件对象
   */
  onImageUpload (event: Event): void {
    const files = (event.currentTarget as HTMLInputElement).files
    if (files && files[0]) {
      this.fileName = files[0].name
      this.imgSource = URL.createObjectURL(files[0])
    }
  }

  onImageLoad (event: Event): void {
    this.imageObj = event.target as HTMLImageElement
    this.onConfigChange()
  }

  onConfigChange (): void {
    // transHeight 是原来的一半 是因为 字符的宽度和字符的高度物理距离不一致 导致转化后的文字有被竖向拉伸的错觉
    // 为了弥补字符宽度和高度（行间距）的不对等，将宽度转换为原始宽度的两倍
    const transWidth = this.targetWidth
    const scale = +((this.targetWidth / this.imageObj.width).toFixed(2))
    const transHeight = Math.ceil(this.imageObj.height * scale / 2)
    const canvas = this.$refs.canvas as HTMLCanvasElement
    canvas.width = transWidth
    canvas.height = transHeight
    try {
      ctx.drawImage(this.imageObj, 0, 0, transWidth, transHeight)
      const imgData: Uint8ClampedArray = ctx.getImageData(0, 0, transWidth, transHeight).data
      let text = ''
      this.getGrayscaleData(imgData, (grayscale: number, index: number) => {
        const rangeIdx = Math.floor(Math.abs(grayscale - 1) * this.customTransferText.length / 255)
        text += this.customTransferText.charAt(rangeIdx)
        index % transWidth === 0 && (text += '\n')
      })
      Bus.$emit('genComment', { comment: text })
    } catch (error) { }
  }

  onScaleChange () {
    changeScale(this.previeScale)
  }

  /**
   * 获取图片像素替换为对应的灰度值
   * @param { Uint8ClampedArray } data 图片数据  一般存在于ImageData.data中
   * @param { Function } callback - 每次像素点计算的回调函数
   */
  getGrayscaleData (data: Uint8ClampedArray, callback: Function): void {
    for (let i = 0, pxIndex = 0, len = data.length; i < len; i += 4) {
      const g = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11
      // data[i] = data[i + 1] = data[i + 2] = g
      callback && callback(g, pxIndex++)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    changeScale(100)
    next()
  }

  mounted (): void {
    ctx = (this.$refs.canvas as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D
  }
}
</script>
<style lang="scss" scoped>
.upload-btn{
  opacity: 0;
  z-index: 99;
  width: 100%;
  position: absolute;
}
</style>
