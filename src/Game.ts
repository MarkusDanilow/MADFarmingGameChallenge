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

    private map: Map;
    private player: Player;

    /**
     *
     */
    constructor() {

        const msx = 64, msy = 32, tileSize = Util.getTileSize();
        Camera.initMaxPos(new Vector2(msx, msy));

        const mapSize = new Vector2(msx, msy); 

        this.map = new Map(msx, msy);
        this.player = new Player(mapSize);

        for (let index = 0; index < 1; index++) {
            const randomTileX = Math.floor(Math.random() * msx);
            const randomTileY = Math.floor(Math.random() * msy);
            const x = randomTileX * tileSize;
            const y = randomTileY * tileSize;
            const e = new NPC(mapSize);
            e.position = new Vector2(250, 250); 
            this.map.addEntity(e); 
        }

    }

    render(ctx: CanvasRenderingContext2D): void {
        this.map.render(ctx);
        const entitiesBefore = this.map.entities.filter(e => e.getCenter().y < this.player.getCenter().y); 
        const entitiesAfter = this.map.entities.filter(e => e.getCenter().y >= this.player.getCenter().y); 
        entitiesBefore.forEach(e => e.render(ctx)); 
        this.player.render(ctx);
        entitiesAfter.forEach(e => e.render(ctx)); 
    }


    update(deltaTime: number): void {
        this.player.update(deltaTime, this.map);
        this.map.update(deltaTime); 
    }

}