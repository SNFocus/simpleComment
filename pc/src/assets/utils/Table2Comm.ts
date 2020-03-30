import { getRealStrLenth, replaceStr, splitStringByLength, getDoubleByteLen } from '@assets/utils'

export declare interface Table2CommUtil {
  maxCellWidth: number;
  customHoriTemp: string;
  verticleTemplate: string;
  tableHeader: string[];
  tableData: string[][];
  genComment: () => string;
  getTableWH: () => number[][];
}

export default class Table2Comm implements Table2CommUtil {
  maxCellWidth: number // 每个单元格最大宽度（字节数 汉字占两个字节）
  customHoriTemp: string // 用户自定义水平线的绘图符号
  verticleTemplate: string
  tableHeader: string[] = ['header1', 'header2', 'header3', 'header4'];
  tableData: string[][] = [
    ['header1', 'header2', 'header3', 'header4'],
    ['comment1', 'comment2', 'comment3', 'comment4'],
    ['comment1', 'comment3', 'comment3', 'comment4'],
    ['comment1', 'comment2', 'comment3', 'comment4'],
    ['comment1', 'comment2', 'comment3', 'comment4']
  ];

  constructor (maxCellWidth = 24, customHoriTemp = '———', verticleTemplate = '·') {
    this.maxCellWidth = maxCellWidth
    this.customHoriTemp = customHoriTemp
    this.verticleTemplate = verticleTemplate
  }

  genComment (): string {
    let horiDividerLine = '' // 分隔线
    const [colWidths, rowHeights] = this.getTableWH() // 获取表格每列的宽度， 每行的高度
    const TABLE_WIDTH = colWidths.reduce((pre, cur) => pre + cur, 0) // 将每列宽度相加 得到所有列（整个表格）的总宽度
    const templateLen = getRealStrLenth(this.customHoriTemp) // 获取字符串物理长度 字母数字为1 汉字为1.82
    // 绘制行分隔线
    for (let i = 0; i < TABLE_WIDTH; i++) {
      (i + 1) % templateLen === 0 && (horiDividerLine += this.customHoriTemp)
    }
    horiDividerLine += '\n' // 换行
    // 绘制指定宽度的行的内容模板  在此模板上填充用户输入的内容
    const contentLine = this.verticleTemplate + (Array(TABLE_WIDTH - 1).join(' ')) + this.verticleTemplate + '\n'

    let res = horiDividerLine
    // 根据计算出的每个单元格的长宽  将内容填充进每个单元格
    for (let i = 0; i < rowHeights.length; i++) {
      // 填充文本时 索引和物理宽度有出入 以此记录已经写入的文本的模拟物理宽度 方便下一单元格的开始位置的计算
      let writedLenth = 0
      // 每个单元格可能会分行 按行高事先准备好行模板  在模板上替换单元格内容
      const contentArr = new Array(rowHeights[i]).fill(contentLine)
      for (let j = 0; j < colWidths.length; j++) {
        // 单元格内容可能会超出单元格最大宽度并分行，
        // splitStringByLength 将会把文本内容按最大宽度分割成不同的字符串
        // 每个字符串代表单元格中某一行的内容
        const rows = splitStringByLength(this.tableData[i][j], this.maxCellWidth)
        // contentArr.length 代表这一整行的高度（其他单元格撑大导致的）
        // 自己的单元格不够的时候 会导致 每个单元格的竖线分割线丢失  所以填充空白数据冒充分行
        // 暂时没什么用就注释了
        /**
         * while (rows.length < contentArr.length) {
         *  rows.push('')
         * }
         * */

        // 对单元格中的分行后的每一行进行文本填充
        rows.forEach((t, index) => {
          const text = this.verticleTemplate + ' ' + t // t => 用户输入文本 每个单元格文本前需要加分隔符和空白padding保证美观性
          const byteLen = getRealStrLenth(text) // 获取占用的物理宽度 字母为1 汉字为1.82
          // 获取所在单元格在这一行中的起始位置
          const startIndex = writedLenth - getDoubleByteLen(contentArr[index]) * 0.822222
          contentArr[index] = replaceStr(contentArr[index], text, startIndex, byteLen + startIndex) // 填充替换文本到模板中
        })
        writedLenth = colWidths[j] + writedLenth // 记录已经写入的单元格的合计长度 方便计算下一次写入的起始位置
      }
      res += contentArr.join('') + horiDividerLine
    }
    return res
  }

  getTableWH (): number[][] {
    const ROW_LEN: number = this.tableData.length
    const COL_LEN: number = this.tableData[0].length
    const colWidthArr: number[] = new Array(COL_LEN).fill(0)
    const rowHeightArr: number[] = new Array(ROW_LEN).fill(1)

    for (let i = 0; i < ROW_LEN; i++) {
      for (let j = 0; j < COL_LEN; j++) {
        let strLength = getRealStrLenth(this.tableData[i][j])
        if (strLength > this.maxCellWidth) {
          const height = Math.ceil(strLength / this.maxCellWidth)
          rowHeightArr[i] < height && (rowHeightArr[i] = height)
          strLength = this.maxCellWidth
        }
        strLength > colWidthArr[j] && (colWidthArr[j] = strLength)
      }
    }
    for (let i = 0; i < colWidthArr.length; i++) {
      colWidthArr[i] += i === colWidthArr.length - 1 ? 4 : 8
    }
    return [colWidthArr, rowHeightArr]
  }
}
