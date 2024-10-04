export default class Vector2 {

    public static ZERO = new Vector2(0, 0); 

    constructor(public x: number, public y: number) { }

    // Vektoraddition
    add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    // Vektorsubtraktion
    subtract(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    // Vektorskalar-Multiplikation
    scale(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    // Berechnung des Betrags (Länge) des Vektors
    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Normalisierung des Vektors
    normalize(): Vector2 {
        const mag = this.magnitude();
        if (mag === 0) {
            throw new Error("Cannot normalize a zero-length vector");
        }
        return new Vector2(this.x / mag, this.y / mag);
    }

    // Dot-Produkt
    dot(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }

    // String-Repräsentation des Vektors
    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}

