import { AnimationType } from "../engine/Animator";
import { Map } from "../map/Map";
import { Util } from "../util/Util";
import Vector2 from "../util/Vector2";
import { Entity } from "./Entity";

export class MovingEntity extends Entity { 

    animBaseName: string; 

    constructor(mapSize: Vector2, speedMultiply: number, sizeMultiply: Vector2, animBaseName: string) {
        super(mapSize);
        this.animBaseName = animBaseName; 
        const tileSize = Util.getTileSize();
        this.size = new Vector2(tileSize * sizeMultiply.x, tileSize * sizeMultiply.y);
        this.speed *= speedMultiply; 
        this.initAnimations(animBaseName); 
    }

    protected initAnimations(animBaseName: string){
        this.animator.addAnimation(`${animBaseName}_${AnimationType.IDLE}_front`, this.speed * 12); 
        this.animator.addAnimation(`${animBaseName}_${AnimationType.RUN}_front`, this.speed * 12); 
        this.animator.addAnimation(`${animBaseName}_${AnimationType.IDLE}_side`, this.speed * 14); 
        this.animator.addAnimation(`${animBaseName}_${AnimationType.RUN}_side`, this.speed * 14); 
        // this.animator.addAnimation(`${animBaseName}_${AnimationType.RUN}`, 90); 
        this.animator.setCurrentAnimation(`${animBaseName}_${AnimationType.IDLE}_front`); 
    }

    protected move(deltaTime: number, moveVector: Vector2, map: Map): Vector2 {

        moveVector.x *= deltaTime;
        moveVector.y *= deltaTime;

        const magnitude = Math.sqrt(moveVector.x * moveVector.x + moveVector.y * moveVector.y);

        if (magnitude > 0) {
            moveVector.x = (moveVector.x / magnitude) * this.speed;
            moveVector.y = (moveVector.y / magnitude) * this.speed;
        }

        const tileSize = Util.getTileSize();

        // check for map borders
        if (this.position.x + moveVector.x < 0) moveVector.x = 0;
        if (this.position.x + this.size.x + moveVector.x > this.mapSize.x * tileSize) moveVector.x = 0;
        if (this.position.y + moveVector.y < 0) moveVector.y = 0;
        if (this.position.y + this.size.y + moveVector.y > this.mapSize.y * tileSize) moveVector.y = 0;

        // check for map collisions
        moveVector = map.entityMoveCheck(this, moveVector);

        // change move animation based on x-direction of movement vector
        if(moveVector.x !== 0 || moveVector.y !== 0){
            if(moveVector.x !== 0){
                this.animator.setCurrentAnimation(`${this.animBaseName}_${AnimationType.RUN}_side`); 
            }else{
                this.animator.setCurrentAnimation(`${this.animBaseName}_${AnimationType.RUN}_front`); 
            }
        }else{
            this.animator.setCurrentAnimation(`${this.animBaseName}_${AnimationType.IDLE}_front`); 
        }
        this.animator.mirror = moveVector.x < 0; 

        this.position = this.position.add(moveVector);

        return moveVector;
    }

}