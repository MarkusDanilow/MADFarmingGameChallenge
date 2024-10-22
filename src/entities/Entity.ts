import { Animator } from "../engine/Animator";
import { Game } from "../Game";
import { IMapUpdatable, IRenderable, IUpdatable } from "../IBasicInterfaces";
import { Map } from "../map/Map";
import { BoundBox2D } from "../util/BB2D";
import { Util } from "../util/Util";
import Vector2 from "../util/Vector2";

export abstract class Entity implements IRenderable, IMapUpdatable {

    public uuid: string; 

    public position: Vector2 = new Vector2(0, 0);
    public size: Vector2 = new Vector2(0, 0);

    protected mapSize: Vector2;

    public speed: number = Util.getTileSize() / 16;

    public collidable: boolean = true ; 
    public bb: BoundBox2D | undefined;

    protected animator: Animator; 

    /**
     *
     */
    constructor(mapSize: Vector2) {
        this.mapSize = mapSize;
        this.animator = new Animator(this); 
        this.uuid = Util.generateUuid(); 
    }

    public updateBB() {
        const bbSize = new Vector2(this.size.x * 0.9, this.size.y / 4);
        const offsetX = (this.size.x - bbSize.x) / 2
        this.bb = new BoundBox2D(this.position.x + offsetX, this.position.y + (this.size.y - bbSize.y), bbSize.x, bbSize.y);
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.animator.render(ctx); 
        if (!Game.RENDER_DEV) return;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.bb?.x!, this.bb?.y!, this.bb?.width!, this.bb?.height!);
    }

    public update(deltaTime: number, map: Map): void {
        this.updateBB();
        this.animator.update(deltaTime); 
    }

    

    public getCenter(): Vector2 {
        return new Vector2(
            this.position.x + this.size.x / 2,
            this.position.y + this.size.y / 2
        );
    }

    calculateDistance(entity: Entity): number {
        const dx = entity.position.x - this.position.x;
        const dy = entity.position.y - this.position.y;
        return Math.sqrt(dx * dx + dy * dy); // Euklidische Distanz
    }


}