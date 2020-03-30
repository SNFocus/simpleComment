import { getRealStrLenth } from '@assets/utils'

export declare interface List2CommUtil {
    commentType: string;
    data: string[];
    rowDivider: string;
    genComment: () => string;
}

export default class List2Comm implements List2CommUtil {
    commentType: string;
    data: string[];
    rowDivider: string;
    constructor (commentType = 'multi', rowDivider = '——') {
      this.commentType = commentType
      this.rowDivider = rowDivider
      this.data = ['最是人间留不住', '朱颜辞镜花辞树', 'dfsffdsfdsf最是人间留不住']
    }

    genComment (): string {
      const maxWidth = this.data.reduce((pre, cur) => {
        const textLen = getRealStrLenth(cur)
        return pre <= textLen ? textLen : pre
      }, 0) + 3
      const dividerWidth = getRealStrLenth(this.rowDivider)
      return this.data
        .map((text, index) => `${index + 1}. ${text}`)
        .join('\n' + this.rowDivider.repeat(maxWidth / dividerWidth) + '\n')
    }
}
