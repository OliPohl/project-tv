/**
 * 2D Vector Class
 * 
 * Represents a two-dimensional vector with common mathematical operations.
 * Provides both static methods for operations between vectors and instance methods.
 * 
 * @example
 * const v1 = new Vector2(2, 3);
 * const v2 = new Vector2(4, 5);
 * const sum = Vector2.add(v1, v2); // Static method
 * const normalized = v1.normalize(); // Instance method
 */


// #region Class
export class Vector2 {
  /**
   * Creates a new Vector2 instance
   * @param x - The x component
   * @param y - The y component
   */
  constructor(public x: number, public y: number) {}

  // #region Static Vectors
  // Common static vectors for convenience
  static ZERO = new Vector2(0, 0);
  static ONE = new Vector2(1, 1);
  static UP = new Vector2(0, -1);
  static DOWN = new Vector2(0, 1);
  static LEFT = new Vector2(-1, 0);
  static RIGHT = new Vector2(1, 0);
  // #endregion Static Vectors

  // #region Static Methods
  /**
   * Adds two vectors
   * @param a - First vector
   * @param b - Second vector
   * @returns New vector representing the sum
   */
  static add(a: Vector2, b: Vector2) {
    return new Vector2(a.x + b.x, a.y + b.y);
  }

  /**
   * Subtracts vector b from vector a
   * @param a - First vector
   * @param b - Second vector to subtract
   * @returns New vector representing the difference
   */
  static subtract(a: Vector2, b: Vector2) {
    return new Vector2(a.x - b.x, a.y - b.y);
  }

  /**
   * Multiplies two vectors component-wise
   * @param a - First vector
   * @param b - Second vector
   * @returns New vector representing the product
   */
  static multiply(a: Vector2, b: Vector2) {
    return new Vector2(a.x * b.x, a.y * b.y);
  }

  /**
   * Divides vector a by vector b component-wise
   * @param a - First vector (dividend)
   * @param b - Second vector (divisor)
   * @returns New vector representing the quotient
   */
  static divide(a: Vector2, b: Vector2) {
    return new Vector2(a.x / b.x, a.y / b.y);
  }

  /**
   * Calculates the distance between two vectors
   * @param a - First vector
   * @param b - Second vector
   * @returns Euclidean distance between the vectors
   */
  static distance(a: Vector2, b: Vector2) {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  }

  /**
   * Linearly interpolates between two vectors
   * @param a - Start vector
   * @param b - End vector
   * @param t - Interpolation factor (0-1)
   * @returns Interpolated vector
   */
  static lerp(a: Vector2, b: Vector2, t: number) {
    return new Vector2(
      a.x + (b.x - a.x) * t,
      a.y + (b.y - a.y) * t
    );
  }

  /**
   * Moves vector a towards vector b by maxDistanceDelta
   * @param a - Current vector
   * @param b - Target vector
   * @param maxDistanceDelta - Maximum distance to move
   * @returns New vector moved towards target
   */
  static moveTowards(a: Vector2, b: Vector2, maxDistanceDelta: number) {
    const direction = Vector2.subtract(b, a);
    const distance = direction.magnitude();
    
    if (distance <= maxDistanceDelta || distance === 0) {
      return b.copy();
    }
    
    return Vector2.add(
      a,
      Vector2.multiply(
        direction.normalize(),
        new Vector2(maxDistanceDelta, maxDistanceDelta)
      )
    );
  }
  // #endregion Static Methodes


  // #region Properties
  /**
   * Returns the magnitude (length) of the vector
   */
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Returns the squared magnitude (faster than magnitude for comparisons)
   */
  sqrMagnitude() {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Returns a normalized copy of the vector (magnitude 1)
   */
  normalize() {
    const mag = this.magnitude();
    return mag > 0 ? new Vector2(this.x / mag, this.y / mag) : Vector2.ZERO;
  }

  /**
   * Returns a copy of this vector
   */
  copy() {
    return new Vector2(this.x, this.y);
  }

  /**
   * Returns the dot product with another vector
   * @param other - Vector to calculate dot product with
   */
  dot(other: Vector2) {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Returns the angle (in radians) between this vector and another
   * @param other - Vector to calculate angle with
   */
  angleTo(other: Vector2) {
    const denominator = Math.sqrt(this.sqrMagnitude() * other.sqrMagnitude());
    if (denominator === 0) return 0;
    
    const dot = this.dot(other) / denominator;
    return Math.acos(Math.min(Math.max(dot, -1), 1));
  }

  /**
   * Returns a string representation of the vector
   */
  toString() {
    return `Vector2(${this.x}, ${this.y})`;
  }
}