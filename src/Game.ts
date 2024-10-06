import { Camera } from "./engine/Camera";
import { InputHandler } from "./engine/InputHandler";
import { NPC } from "./entities/npc/NPC";
import { Player } from "./entities/Player";
import { IRenderable, IUpdatable } from "./IBasicInterfaces";
import { Map } from "./map/Map";
import { Util } from "./util/Util";
import Vector2 from "./util/Vector2";

export class Game implements IRenderable, IUpdatable {

    public static RENDER_DEV = false;

    public msx: number = 64;
    public msy: number = 32; 

    private map: Map;
    private player: Player;

    /**
     *
     */
    constructor() {
        Camera.initMaxPos(new Vector2(this.msx, this.msy));
        const mapSize = new Vector2(this.msx, this.msy);
        this.map = new Map(this.msx, this.msy);
        this.player = new Player(mapSize);
        this.map.addEntity(this.player); 
        this.createNpcs(50);
    }

    createNpcs(numNpcs: number) {
        const tileSize = Util.getTileSize(); 
        for (let index = 0; index < numNpcs; index++) {
            const randomTileX = Math.floor(Math.random() * this.msx);
            const randomTileY = Math.floor(Math.random() * this.msy);
            const x = randomTileX * tileSize;
            const y = randomTileY * tileSize;
            const e = new NPC(new Vector2(this.msx, this.msy));
            e.position = new Vector2(x, y);
            this.map.addEntity(e);
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        this.map.render(ctx);
    }


    update(deltaTime: number): void {
        this.map.update(deltaTime);
    }

}