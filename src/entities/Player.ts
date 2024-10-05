import { Camera } from "../engine/Camera";
import { InputHandler } from "../engine/InputHandler";
import { IRenderable, IUpdatable } from "../IBasicInterfaces";
import { Util } from "../util/Util";
import Vector2 from "../util/Vector2";
import { Map } from "../map/Map";
import { Entity } from "./Entity";

export class Player extends Entity {

    /**
     *
     */
    constructor(mapSize: Vector2) {
        super(mapSize);
        const tileSize = Util.getTileSize();
        this.size = new Vector2(tileSize, tileSize * 1.5);
        this.speed *= 1.15 ; 
        this.position = new Vector2(200, 200); 
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        super.render(ctx); 
    }

    update(deltaTime: number, map: Map): void {
        this.move(deltaTime, new Vector2(0, 0), map);
        super.update(deltaTime, map); 
    }

    protected move(deltaTime: number, inputVector: Vector2, map: Map): Vector2 {
        if (InputHandler.isKeyDown('a')) inputVector.x = -1;
        if (InputHandler.isKeyDown('d')) inputVector.x = 1;
        if (InputHandler.isKeyDown('w')) inputVector.y = -1;
        if (InputHandler.isKeyDown('s')) inputVector.y = 1;

        inputVector = super.move(deltaTime, inputVector, map);

        const screenSize = Util.getScreenSize();
        if (inputVector.x > 0 && this.getCenter().x < screenSize.x / 2) inputVector.x = 0;
        if (inputVector.x < 0 && this.getCenter().x + Camera.position.x > screenSize.x / 2) inputVector.x = 0;
        if (inputVector.y > 0 && this.getCenter().y < screenSize.y / 2) inputVector.y = 0;
        if (inputVector.y < 0 && this.getCenter().y + Camera.position.y > screenSize.y / 2) inputVector.y = 0;
        Camera.move(inputVector.x, inputVector.y)

        return inputVector;

    }


}