export interface Point {
  x: number;
  y: number;
}
export class CommentBox {
  belong: string;
  startPoint: Point;
  endPoint: Point;
  value: string;

  constructor (belong: string, startPoint: Point, endPoint: Point, value: string) {
    this.belong = belong
    this.startPoint = Object.assign({}, startPoint)
    this.endPoint = Object.assign({}, endPoint)
    this.value = value
  }

  inBox (location: Point): boolean {
    return this.inRange(location.x, this.startPoint.x, this.endPoint.x) && this.inRange(location.y, this.startPoint.y, this.endPoint.y)
  }

  inRange (v: number, start: number, end: number): boolean {
    return v > start && v < end
  }
}
