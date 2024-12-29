import { Camera } from "../../engine/Camera";
import { InputHandler } from "../../engine/InputHandler";
import { Util } from "../../util/Util";
import Vector2 from "../../util/Vector2";
import { Map } from "../../map/Map";
import { MovingEntity } from "./MovingEntity";
import { Item } from "../items/Item";

export class Player extends MovingEntity {

    private inventory: Item[] = [];


    /**
     *
     */
    constructor(mapSize: Vector2) {
        super(mapSize, 1, new Vector2(1, 1), "player");
        this.position = new Vector2(200, 200);
    }

    update(deltaTime: number, map: Map): void {
        this.move(deltaTime, new Vector2(0, 0), map);

        // collect items if collision is detected
        if(this.latestMoveCheck !== undefined){
            this.latestMoveCheck.collidingEntities.forEach(entity => {
                if (entity instanceof Item) {
                    this.inventory.push(entity);
                    map.removeEntity(entity);
                }
            });
        }

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