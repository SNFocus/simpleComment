export const getRealStrLenth: (str: string) => number = (str): number => {
  let len = 0

  for (let i = 0; i < str.length; i++) {
    if (!['—'].includes(str[i]) && (str.charCodeAt(i) & 0xff00) !== 0) {
      len += 0.8333333333333334 // 每个汉字是数字的物理长度的11/6倍  也就是1.8xxx倍 （11- 6 == 5）
    }
    len++
  }
  return Math.ceil(len)
}

export const getDoubleByteLen: (str: string) => number = (str): number => {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    if (!['—'].includes(str[i]) && (str.charCodeAt(i) & 0xff00) !== 0) {
      len++
    }
  }
  return len
}

export function replaceStr (text: string, replacetext: string, start: number, end: number): string {
  return text.substring(0, start) + replacetext + text.substring(end)
}

export function splitStringByLength (text: string, length: number): string[] {
  let count = 0; let lastIndex = 0
  const res = []
  for (let i = 0; i < text.length; i++) {
    if ((text.charCodeAt(i) & 0xff00) !== 0) {
      count++
    }
    count++

    if (count >= length) {
      count = 0
      res.push(text.slice(lastIndex, i + 1))
      lastIndex = i + 1
    }
  }
  if (lastIndex <= text.length - 1) {
    res.push(text.slice(lastIndex))
  }
  return res
}
