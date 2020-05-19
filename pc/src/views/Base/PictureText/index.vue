<template>
  <div style="height: 100%;">
    <div style="height: 60%;display: flex;overflow: auto;">
      <img :src="imgSource" style="margin: auto;width:100%;" @load="onImageLoad" />
    </div>
    <a-divider orientation="left"><a-icon  type="setting" /> &nbsp;设置</a-divider>
    <a-row>
      <a-col :span="12">
        <sc-form-item label="上传图片">
          <span>{{fileName}}</span>
          <input class="upload-btn" type="file" accept="image/png, image/jpeg" @change="onImageUpload" />
        </sc-form-item>
      </a-col>
      <a-col :span="12">
        <sc-form-item label="压缩比例">
          <input type="text" v-model="targetWidth" style="width: 220px;" @change="onConfigChange">
        </sc-form-item>
      </a-col>
      <a-col :span="12">
        <sc-form-item label="转换文字">
          <input type="text" v-model="customTransferText" style="width: 220px;" @change="onConfigChange">
        </sc-form-item>
      </a-col>
    </a-row>
    <canvas id="pictureCanvas" width="1000" height="1000" style="display:none;"></canvas>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Bus from '@assets/utils/bus.ts'
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

  /**
   * 监听文件上传
   * @listener
   * @param {Event} event - 事件对象
   */
  onImageUpload (event: Event): void {
    const files = (event.currentTarget as HTMLInputElement).files
    if (files.length) {
      this.fileName = files[0].name
      this.imgSource = URL.createObjectURL(files[0])
    }
  }

  onImageLoad (event: Event): void {
    this.imageObj = event.target as HTMLImageElement
    this.onConfigChange()
  }

  onConfigChange (): void {
    // scaleWidth 是原来的两倍 是因为 字符的宽度和字符的高度物理距离不一致 导致转化后的文字有被竖向拉伸的错觉
    // 为了弥补字符宽度和高度（行间距）的不对等，将宽度转换为原始宽度的两倍
    const scaleWidth = this.targetWidth
    const scale = +((this.targetWidth / this.imageObj.width).toFixed(2))
    const scaleHeight = Math.ceil(this.imageObj.height * scale)
    console.log(scaleWidth, scaleHeight)
    ctx.drawImage(this.imageObj, 0, 0, scaleWidth, scaleHeight)
    const imgData: Uint8ClampedArray = ctx.getImageData(0, 0, scaleWidth, scaleHeight).data
    let text = ''
    this.getGrayscaleData(imgData, (grayscale: number, index: number) => {
      text += this.customTransferText.charAt(Math.floor(Math.abs(grayscale - 1) * this.customTransferText.length / 255))
      if (index % scaleWidth === 0) {
        text += '\n'
      }
    })
    Bus.$emit('genComment', { comment: text })
  }

  /**
   * 获取图片像素替换为对应的灰度值
   * @param { Uint8ClampedArray } data 图片数据  一般存在于ImageData.data中
   * @param { Function } callback - 每次像素点计算的回调函数
   */
  getGrayscaleData (data: Uint8ClampedArray, callback: Function): void {
    for (let i = 0, pxIndex = 0, len = data.length; i < len; i += 4) {
      const g = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11
      // data[i] = g
      // data[i + 1] = g
      // data[i + 2] = g
      callback && callback(g, pxIndex++)
    }
  }

  mounted (): void {
    ctx = (document.querySelector('#pictureCanvas') as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D
  }
}
</script>
<style lang="scss" scoped>
.upload-btn{
  opacity: 0;
  z-index: 99;
  position: absolute;
}
</style>
