import { Camera } from "./engine/Camera";
import { InputHandler } from "./engine/InputHandler";
import { NPC } from "./entities/npc/NPC";
import { Player } from "./entities/Player";
import { IRenderable, IUpdatable } from "./IBasicInterfaces";
import { Map } from "./map/Map";
import { Util } from "./util/Util";
import Vector2 from "./util/Vector2";

export type GameState = "PLAY" | "PAUSE";

export class Game implements IRenderable, IUpdatable {

    public static RENDER_DEV = false;

    public State: GameState = "PAUSE";

    public mapTilesX: number = 64;
    public mapTilesY: number = 32;

    private map: Map;
    private player: Player;

    /**
     *
     */
    constructor() {
        Camera.initMaxPos(new Vector2(this.mapTilesX, this.mapTilesY));
        const mapSize = new Vector2(this.mapTilesX, this.mapTilesY);
        this.map = new Map(this.mapTilesX, this.mapTilesY);
        this.player = new Player(mapSize);
        this.map.addEntity(this.player);
        this.createNpcs(50);
    }

    createNpcs(numNpcs: number) {
        const tileSize = Util.getTileSize();
        for (let index = 0; index < numNpcs; index++) {
            const randomTileX = Math.floor(Math.random() * this.mapTilesX);
            const randomTileY = Math.floor(Math.random() * this.mapTilesY);
            const x = randomTileX * tileSize;
            const y = randomTileY * tileSize;
            const e = new NPC(new Vector2(this.mapTilesX, this.mapTilesY));
            e.position = new Vector2(x, y);
            this.map.addEntity(e);
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        // if (this.State === "PLAY") {
        // translate by camera offset
        ctx.save();
        ctx.translate(Camera.position.x, Camera.position.y);
        this.map.render(ctx);
        // }

        // render UI stuff
        ctx.restore();

        if (this.State === "PAUSE") {
            const size = Util.getCanvasSize();
            ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            ctx.fillRect(0, 0, size.x, size.y);
            ctx.fillStyle = "#fff";
            ctx.fillText("PAUSED", 200, 200);
        }
    }


    update(deltaTime: number): void {

        if (InputHandler.isKeyPressed(InputHandler.KEY_ESCAPE)) {
            this.State = this.State === "PLAY" ? "PAUSE" : "PLAY";
        }

        if (this.State === "PLAY") {
            this.map.update(deltaTime);
        }

        InputHandler.update();
    }

}