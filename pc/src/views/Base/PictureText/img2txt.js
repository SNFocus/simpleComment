// 原本是用来压缩图片的 然后发现这种方法压缩成度太高 不灵活 故设置为
const COMPRESS_W = 1
const COMPRESS_H = 1

const getReadIndex = (row, col, IMG_WIDTH) => (row * IMG_WIDTH + col) * 4

/**
 * 获取图片像素替换为对应的灰度值
 * @param { Uint8ClampedArray } data 图片数据  一般存在于ImageData.data中
 */
const getGrayscaleData = data => {
  for (let i = 0, len = data.length; i < len; i += 4) {
    const g = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11
    data[i] = g
    data[i + 1] = g
    data[i + 2] = g
  }
}

// img.src = 'https://s1.ax1x.com/2020/04/18/JmDgfJ.png'
export const drawImg = function (ctx, img) {
  const IMG_WIDTH = img.width
  const IMG_HEIGHT = img.height
  const newArr = []
  ctx.drawImage(img, 0, 0, IMG_WIDTH, IMG_HEIGHT)
  const imgData = ctx.getImageData(0, 0, IMG_WIDTH, IMG_HEIGHT)
  console.log('0000000000000000000000000')
  console.log(imgData)

  const data = imgData.data
  // getGrayscaleData(data)
  // ctx.putImageData(imgData, 0, 0)

  for (let i = 0; i < data.length;) {
    // 将图片看成像素的位图 也就是像素组成的方格图
    // 通过计算某个像素点和其周围像素平均值  实现压缩
    // i = 0 时和 i = 3 时包含的四个数值都是同一个像素，为了计算像素点的排序，需要除以4
    const pIndex = i / 4 // 这是像素点在方格中的排序索引

    //  因为图片是有长宽的  类似于二维数组  所以通过图片的宽计算像素点所在的二维数组的索引
    const col = pIndex % IMG_WIDTH // 像素点所在列
    const row = (pIndex - col) / IMG_WIDTH // (row, col)

    // 以九个方格为一组计算平均值
    let MIN_COL = col
    let MIN_ROW = row
    const MAX_COL = IMG_WIDTH - 1 > MIN_COL + COMPRESS_W - 1 ? MIN_COL + COMPRESS_W - 1 : IMG_WIDTH - 1
    const MAX_ROW = IMG_HEIGHT - 1 > MIN_ROW + COMPRESS_H - 1 ? MIN_ROW + COMPRESS_H - 1 : IMG_HEIGHT - 1
    const rgbaArr = [0, 0, 0, 0]

    for (; MIN_ROW <= MAX_ROW; MIN_ROW++) {
      for (; MIN_COL <= MAX_COL; MIN_COL++) {
        [0, 1, 2, 3].forEach(idx => { rgbaArr[idx] += data[getReadIndex(MIN_ROW, MIN_COL, IMG_WIDTH) + idx] })
      }
      MIN_COL = col
    }

    const num = (MAX_ROW - row + 1) * (MAX_COL - col + 1) // 计算这组像素组的像素个数
    rgbaArr.forEach(c => newArr.push(~~(c / num))) // 计算像素组平均值(合并为一个)并写入新数组

    // 寻找下一个像素点
    // MAX_COL >= IMG_WIDTH - 1 时说明循环到某列的最后一个了 开始向下换行  否则向右平移
    if (MAX_COL >= IMG_WIDTH - 1) {
      i = getReadIndex(MAX_ROW + 1, 0, IMG_WIDTH)
    } else {
      i = getReadIndex(row, MAX_COL + 1, IMG_WIDTH)
    }
  }
  const newWidth = Math.ceil(IMG_WIDTH / COMPRESS_W)
  const newHeight = Math.ceil(IMG_HEIGHT / COMPRESS_H)
  const padLen = newArr.length - (newWidth * newHeight * 4)
  const padContent = newArr[newArr.length - 1]
  for (let i = 0; i < Math.abs(padLen); i++) {
    padLen > 0 ? newArr.push(padContent) : newArr.pop()
  }
  ctx.clearRect(0, 0, IMG_WIDTH, IMG_HEIGHT)
  console.log(newWidth, newHeight, newArr.length, newWidth * newHeight * 4 === newArr.length)
  ctx.putImageData(new ImageData(new Uint8ClampedArray(newArr), newWidth, newHeight), 0, 0)
}
