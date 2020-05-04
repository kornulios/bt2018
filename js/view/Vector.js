export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get() {
    return { x: this.x, y: this.y };
  }

  add(vec2) {
    return new Vector(this.x + vec2.x, this.y + vec2.y);
  }

  addTo(vec2) {
    this.x += vec2.x;
    thix.y += vec2.y;
  }

  substract(vec2) {
    return new Vector(this.x - vec2.x, this.y - vec2.y);
  }

  substractFrom(vec2) {
    this.x -= vec2.x;
    this.y -= vec2.y;
  }

  normalize() {
    const vectorLength = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    return new Vector(this.x / vectorLength, this.y / vectorLength);
  }

  getLength() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

}