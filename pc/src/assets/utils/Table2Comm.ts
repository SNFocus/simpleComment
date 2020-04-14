import { getRealStrLenth, replaceStr, splitStringByLength, getDoubleByteLen } from '@assets/utils'

export declare interface Table2CommUtil {
  maxCellWidth: number;
  horiTemplate: string;
  verticalTemplate: string;
  tableData: string[][];
  genComment: () => CommData;
  setData: (data: string[][]) => void;
  getTableWH: () => number[][];
}

export class Table2Comm implements Table2CommUtil {
  public maxCellWidth: number // 每个单元格最大宽度（字节数 汉字占两个字节）
  public horiTemplate: string // 用户自定义水平线的绘图符号
  public verticalTemplate: string
  public tableData: string[][] ;

  constructor (maxCellWidth = 24, horiTemplate = '———', verticalTemplate = '·') {
    this.maxCellWidth = maxCellWidth
    this.horiTemplate = horiTemplate
    this.verticalTemplate = verticalTemplate
  }

  setData (tableData: string[][]): void{
    this.tableData = tableData
  }

  setConfigData (key: string, val: string | number): void{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)[key] = val
  }

  genComment (): CommData {
    let horiDividerLine = '' // 分隔线
    const [colWidths, rowHeights] = this.getTableWH() // 获取表格每列的宽度， 每行的高度
    const TABLE_WIDTH = colWidths.reduce((pre, cur) => pre + cur, 0) // 将每列宽度相加 得到所有列（整个表格）的总宽度
    const templateLen = getRealStrLenth(this.horiTemplate) // 获取字符串物理长度 字母数字为1 汉字为1.82
    // 绘制行分隔线
    for (let i = 0; i < TABLE_WIDTH; i++) {
      (i + 1) % templateLen === 0 && (horiDividerLine += this.horiTemplate)
    }
    horiDividerLine += '\n' // 换行
    // 绘制指定宽度的行的内容模板  在此模板上填充用户输入的内容
    const contentLine = this.verticalTemplate + (Array(TABLE_WIDTH).join(' ')) + '\n'

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
          const text = this.verticalTemplate + ' ' + t // t => 用户输入文本 每个单元格文本前需要加分隔符和空白padding保证美观性
          const byteLen = getRealStrLenth(text) // 获取占用的物理宽度 字母为1 汉字为1.82
          // 获取所在单元格在这一行中的起始位置
          const startIndex = writedLenth - getDoubleByteLen(contentArr[index]) * 0.822222
          contentArr[index] = replaceStr(contentArr[index], text, startIndex, byteLen + startIndex) // 填充替换文本到模板中
        })
        writedLenth = colWidths[j] + writedLenth // 记录已经写入的单元格的合计长度 方便计算下一次写入的起始位置
      }
      res += contentArr.join('') + horiDividerLine
    }
    return {
      comment: res,
      payload: TABLE_WIDTH
    }
  }

  getTableWH (): number[][] {
    const ROW_LEN: number = this.tableData.length // 总共的行数
    const COL_LEN: number = this.tableData[0].length // 总共的列数
    const colWidthArr: number[] = new Array(COL_LEN).fill(0) // 每个单元格的宽度 以字母数字宽度为1 汉字为2 为标准
    const rowHeightArr: number[] = new Array(ROW_LEN).fill(1) // 每一行的高度 一行字为1 两行为2

    // 遍历表格数据
    for (let i = 0; i < ROW_LEN; i++) {
      for (let j = 0; j < COL_LEN; j++) {
        let strLength = getRealStrLenth(this.tableData[i][j]) // 获取该单元格内容的实际长度
        if (strLength > this.maxCellWidth) { // 内容长于最大宽度时分行
          const height = Math.ceil(strLength / this.maxCellWidth) // 计算该单元格的行高
          rowHeightArr[i] < height && (rowHeightArr[i] = height) // 比较已经计算的最高单元格高度 取更大的作为整行的高度
          strLength = this.maxCellWidth
        }
        strLength > colWidthArr[j] && (colWidthArr[j] = strLength) // 比较该列的单元格最大宽度
      }
    }
    // 给每个单元格进行padding填充 保证美观  最后一列单元格填充宽度更少
    for (let i = 0; i < colWidthArr.length; i++) {
      colWidthArr[i] += i === colWidthArr.length - 1 ? 4 : 8
    }
    return [colWidthArr, rowHeightArr]
  }
}
