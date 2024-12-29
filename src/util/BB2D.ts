import { Entity } from "../entities/Entity";
import { Tile } from "../map/Map";
import Vector2 from "./Vector2";

export class BoundBox2D {
    // Position und Dimensionen der Bounding Box
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    // Prüfen, ob diese BoundBox eine andere überlappt (Kollision)
    public intersects(other: BoundBox2D): boolean {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }

    // Prüfen, ob ein Punkt (px, py) innerhalb der BoundBox liegt
    public containsPoint(px: number, py: number): boolean {
        return (
            px >= this.x &&
            px <= this.x + this.width &&
            py >= this.y &&
            py <= this.y + this.height
        );
    }

    // Verschiebe die Bounding Box um dx in der x-Richtung und dy in der y-Richtung
    public move(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
    }

    // Setze die Position der Bounding Box
    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    // Setze die Größe der Bounding Box
    public setSize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    // Prüfen, ob die Bounding Box vollständig innerhalb einer anderen Bounding Box liegt
    public isInside(other: BoundBox2D): boolean {
        return (
            this.x >= other.x &&
            this.y >= other.y &&
            this.x + this.width <= other.x + other.width &&
            this.y + this.height <= other.y + other.height
        );
    }

    // Prüfen, ob diese BoundBox außerhalb der gegebenen Grenzen liegt
    public isOutOfBounds(bounds: BoundBox2D): boolean {
        return (
            this.x + this.width < bounds.x || // links
            this.x > bounds.x + bounds.width || // rechts
            this.y + this.height < bounds.y || // oben
            this.y > bounds.y + bounds.height // unten
        );
    }

    public getCenter(): Vector2 {
        return new Vector2(this.x + this.width / 2, this.y + this.height / 2);
    }

}

export type CollisionCheckObject = {
    collidable: boolean,
    bb: BoundBox2D | undefined,
    obj: Entity | Tile
}


export type CollisionResult = {
    vector: Vector2,
    entity: Entity | Tile | undefined;
}

export type MoveCheckResult = {
    collidingTiles: Tile[],
    collidingEntities: Entity[],
    moveVector: Vector2
}