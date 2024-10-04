import { Map } from "../../map/Map";
import { Util } from "../../util/Util";
import Vector2 from "../../util/Vector2";
import { Entity } from "../Entity";

export class NPC extends Entity {


    private direction: Vector2 = new Vector2(0, 0);;
    private moveDuration: number = 0;
    private moveTimer: number = 0;
    private pauseDuration: number = 0;
    private pauseTimer: number = 0;

    /**
     *
     */
    constructor(mapSize: Vector2) {
        super(mapSize);
        const tileSize = Util.getTileSize();
        this.size = new Vector2(tileSize, tileSize * 1.5);
        this.chooseNewDirection(); 
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#0f0';
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        super.render(ctx); 
    }

    public update(deltaTime: number, map: Map): void {
        
        if (this.moveTimer > 0 && this.direction.x !== 0 && this.direction.y !== 0) {
            const move = this.move(deltaTime, new Vector2(this.direction.x, this.direction.y), map);
            if(move.x == 0 && move.y == 0) this.moveTimer = 0; 
            else this.moveTimer -= deltaTime;
        } else {
            // Bewegung gestoppt, Timer für Pause runterzählen
            this.pauseTimer -= deltaTime;

            // Wenn die Pause vorbei ist, wähle eine neue Richtung
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