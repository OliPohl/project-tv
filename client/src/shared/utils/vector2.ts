export class Vector2 {
  constructor(public x: number, public y: number) {}

  static ZERO = new Vector2(0, 0);
  static ONE = new Vector2(1, 1);
  static UP = new Vector2(0, -1);
  static DOWN = new Vector2(0, 1);
  static LEFT = new Vector2(-1, 0);
  static RIGHT = new Vector2(1, 0);

  static add(a: Vector2, b: Vector2) {
    return new Vector2(a.x + b.x, a.y + b.y);
  }

  static subtract(a: Vector2, b: Vector2) {
    return new Vector2(a.x - b.x, a.y - b.y);
  }

  static multiply(a: Vector2, b: Vector2) {
    return new Vector2(a.x * b.x, a.y * b.y);
  }

  static divide(a: Vector2, b: Vector2) {
    return new Vector2(a.x / b.x, a.y / b.y);
  }

  // Move towards
  // distance
}