import { getRealStrLenth, genSpace } from '@assets/utils'
export declare interface ListItem{
    content: string;
    childs?: ListItem[];
}

export declare interface List2CommUtil {
    tabSize: number|string;
    rowDivider: string;
    showDivider: boolean;
    dividerWidth: number;
    isOrdered: boolean;
    genComment: (x: ListItem[]) => CommData;
}

export class List2Comm implements List2CommUtil {
    tabSize: number|string;
    rowDivider: string;
    isOrdered !: boolean;
    showDivider: boolean;

    dividerWidth !: number;

    constructor (tabSize = 1, rowDivider = '——', showDivider = false, isOrdered = false) {
      this.isOrdered = isOrdered
      this.rowDivider = rowDivider
      this.tabSize = tabSize
      this.showDivider = showDivider
    }

    isListItem (data: ListItem | ListItem[]): data is ListItem {
      return 'content' in data
    }

    genComment (listData: ListItem[]): CommData {
      this.dividerWidth = getRealStrLenth(this.rowDivider)
      return {
        comment: this.flatList(0, -1, listData)
      }
    }

    flatList (level: number, index: number, data: ListItem[] | ListItem): string {
      if (this.isListItem(data)) {
        const childsText = Array.isArray(data.childs) && data.childs.length
          ? this.flatList(level, -1, data.childs)
          : ''
        return this.listItem2Text(level, index, data.content) + childsText
      }
      return data.reduce((prev: string | ListItem, cur: ListItem, idx: number): string => {
        return prev + this.flatList(level + 1, idx, cur)
      }, '')
    }

    listItem2Text (level: number, index: number, text: string): string {
      const levelStyle = this.isOrdered ? `${level}.${index + 1}.` : '·'
      const paddingText = level === 1 ? '' : genSpace(+this.tabSize * level)
      let lineContent = `${paddingText}${levelStyle}  ${text}` + '\n'
      if (this.showDivider) {
        lineContent += paddingText + genSpace(getRealStrLenth(levelStyle)) + this.rowDivider.repeat(getRealStrLenth(text) / this.dividerWidth) + '\n'
      }
      return lineContent
    }
}
