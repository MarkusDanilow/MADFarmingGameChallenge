import { Util } from "../../util/Util";
import Vector2 from "../../util/Vector2";
import { Entity } from "../Entity";

export class Item extends Entity {

    /**
     *
     */
    constructor(mapSize: Vector2, position: Vector2) {
        super(mapSize);
        const tileSize = Util.getTileSize();
        this.size = new Vector2(tileSize * 0.5, tileSize * 0.5);
        this.position = new Vector2(position.x + tileSize * 0.25, position.y + tileSize * 0.25);
        this.collidable = true; 
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#f00';
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }

}