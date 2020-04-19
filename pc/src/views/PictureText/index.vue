<template>
  <div>
    <img :src="imgSource" style="width: 90%;height: auto;transition: height 2s;" @load="onImageLoad" />
    <a-divider orientation="left"><a-icon  type="setting" /> &nbsp;设置</a-divider>
    <input type="file" accept="image/png, image/jpeg" @change="onImageUpload" />
    <canvas id="pictureCanvas" style="display:none;"></canvas>
    <!-- 压缩  自定义文字  自定义容差   上传-->
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Bus from '../../assets/utils/bus'
let ctx!: CanvasRenderingContext2D
@Component
export default class PictureText extends Vue {
  // 图片对象
  imageObj: HTMLImageElement;
  // 上传图片的链接
  imgSource = ''
  // 照片缩放程度
  scale = 0.07
  // 自定义转换文字
  customTransferText = ['@', '#', '&', '$', '%', '8', '6', '3', '!', 'i', '1', 'u', 'a', 'z', 'v', 'n', 'o', '~', ';', '*', '^', '+', '-', '.', ' ']

  /**
   * 监听文件上传
   * @listener
   * @param {Event} event - 事件对象
   */
  onImageUpload (event: Event): void {
    const files = (event.currentTarget as HTMLInputElement).files
    if (files) {
      this.imgSource = URL.createObjectURL(files[0])
    }
  }

  onImageLoad (event: Event): void {
    this.imageObj = event.target as HTMLImageElement
    this.onConfigChange()
  }

  onConfigChange (): void {
    const scaleWidth = Math.ceil(this.imageObj.width * this.scale)
    const scaleHeight = Math.ceil(this.imageObj.height * this.scale)
    ctx.drawImage(this.imageObj, 0, 0, scaleWidth, scaleHeight)
    const imgData: Uint8ClampedArray = ctx.getImageData(0, 0, scaleWidth, scaleHeight).data
    let text = ''
    this.getGrayscaleData(imgData, (grayscale: number, index: number) => {
      text += this.customTransferText[Math.floor(Math.abs(grayscale - 1) * this.customTransferText.length / 255)]
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
      data[i] = g
      data[i + 1] = g
      data[i + 2] = g
      callback && callback(g, pxIndex++)
    }
  }

  mounted (): void {
    ctx = (document.querySelector('#pictureCanvas') as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D
  }
}
</script>
