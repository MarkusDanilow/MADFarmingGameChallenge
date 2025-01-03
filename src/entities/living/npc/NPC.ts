import { Map } from "../../../map/Map";
import Vector2 from "../../../util/Vector2";
import { MovingEntity } from "../MovingEntity";

export class NPC extends MovingEntity {


    private direction: Vector2 = new Vector2(0, 0);;
    private moveDuration: number = 0;
    private moveTimer: number = 0;
    private pauseDuration: number = 0;
    private pauseTimer: number = 0;

    /**
     *
     */
    constructor(mapSize: Vector2) {
        const type = "npc" ; 
        super(mapSize, 1, new Vector2(1, 1), type);
        this.chooseNewDirection(); 
    }

    public update(deltaTime: number, map: Map): void {
        
        if (this.moveTimer > 0 && this.direction.x !== 0 && this.direction.y !== 0) {
            const move = this.move(deltaTime, new Vector2(this.direction.x, this.direction.y), map);
            if(move.x == 0 && move.y == 0) this.moveTimer = 0; 
            else this.moveTimer -= deltaTime;
        } else {
            this.pauseTimer -= deltaTime;
            if (this.pauseTimer <= 0) {
                this.chooseNewDirection();
            }
        }
        super.update(deltaTime, map); 

    }



    chooseNewDirection() {
        this.direction.x = Math.random() < 0.5 ? -1 : 1;
        this.direction.y = Math.random() < 0.5 ? -1 : 1;

        this.moveDuration = Math.random() * 2000 + 1000; 
        this.moveTimer = this.moveDuration;

        this.pauseDuration = Math.random() * 1000 + 500; 
        this.pauseTimer = this.pauseDuration;
    }


}