import { getRealStrLenth } from '@assets/utils'
export declare interface ListItem{
    key: number;
    content: string;
    childs?: ListItem[];
}

export declare interface List2CommUtil {
    data: ListItem[];
    tabSize: number|string;
    rowDivider: string;
    showDivider: boolean;
    dividerWidth: number;
    maxWidth: number;
    isOrdered: boolean;
    baseId: number;
    genComment: () => string;
}

export class List2Comm implements List2CommUtil {
    data: ListItem[];

    tabSize: number|string;
    rowDivider: string;
    isOrdered !: boolean;
    showDivider: boolean;

    dividerWidth !: number;
    maxWidth !: number;
    baseId = 5;

    constructor (tabSize = 1, rowDivider = '——', showDivider = false, isOrdered = false, data?: ListItem[]) {
      this.isOrdered = isOrdered
      this.rowDivider = rowDivider
      this.tabSize = tabSize
      this.showDivider = showDivider
      this.data = data || [{
        key: 1,
        content: '1最是人间留不住',
        childs: [{
          key: 4,
          content: '2朱颜辞镜花辞树2'
        }]
      },
      {
        key: 2,
        content: '3朱颜辞镜花辞树'
      },
      {
        key: 3,
        content: '4最是人间留不住'
      }]
    }

    isListItem (data: ListItem | ListItem[]): data is ListItem {
      return 'content' in data
    }

    setData (data: ListItem[]): void {
      this.data = data
    }

    genComment (): string {
      this.dividerWidth = getRealStrLenth(this.rowDivider)
      this.maxWidth = this.data.reduce((pre, cur) => {
        const textLen = +getRealStrLenth(cur.content)
        return pre <= textLen ? textLen : pre
      }, 0) + 4
      return this.flatList(0, -1, this.data)
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
      const paddingText = level === 1 ? '' : ' '.repeat(+this.tabSize * level)
      let lineContent = `${paddingText}${levelStyle}  ${text}` + '\n'
      if (this.showDivider) {
        const orderWidth = 2
        lineContent += paddingText + ' '.repeat(orderWidth) + this.rowDivider.repeat(this.maxWidth / this.dividerWidth) + '\n'
      }
      return lineContent
    }
}
