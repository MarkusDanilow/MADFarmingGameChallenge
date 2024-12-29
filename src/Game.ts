import { Camera } from "./engine/Camera";
import { InputHandler } from "./engine/InputHandler";
import { Item } from "./entities/items/Item";
import { NPC } from "./entities/living/npc/NPC";
import { Player } from "./entities/living/Player";
import { IRenderable, IUpdatable } from "./IBasicInterfaces";
import { Map } from "./map/Map";
import { PauseScreen } from "./ui/screens/PauseScreen";
import { Util } from "./util/Util";
import Vector2 from "./util/Vector2";

export type GameState = "PLAY" | "PAUSE";

export class Game implements IRenderable, IUpdatable {

    public static RENDER_DEV = false;

    private _gameState: GameState = "PLAY";
    public get gameState(): GameState {
        return this._gameState;
    }
    public set gameState(value: GameState) {
        this._gameState = value;
    }

    public mapTilesX: number = 64;
    public mapTilesY: number = 32;

    private map: Map;
    private player: Player;

    private pauseScreen: PauseScreen | undefined = undefined;

    /**
     *
     */
    constructor() {
        Camera.initMaxPos(new Vector2(this.mapTilesX, this.mapTilesY));
        const mapSize = new Vector2(this.mapTilesX, this.mapTilesY);
        this.map = new Map(this.mapTilesX, this.mapTilesY);
        this.player = new Player(mapSize);
        this.map.addEntity(this.player);

        this.populateWorld();

        // this.togglePauseScreen();
    }

    togglePauseScreen() {
        this.pauseScreen = this.gameState === "PAUSE" ? new PauseScreen(this) : undefined;
    }


    populateWorld() {
        // this.createNpcs(50);
        this.createItems(50);
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

    createItems(numItems: number) {
        const tileSize = Util.getTileSize();
        for (let index = 0; index < numItems; index++) {
            const randomTileX = Math.floor(Math.random() * this.mapTilesX);
            const randomTileY = Math.floor(Math.random() * this.mapTilesY);
            const x = randomTileX * tileSize;
            const y = randomTileY * tileSize;
            const e = new Item(new Vector2(this.mapTilesX, this.mapTilesY), new Vector2(x, y));
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

        if (this.gameState === "PAUSE") {
            this.pauseScreen?.render(ctx);
        }
    }


    update(deltaTime: number): void {
        if (this.gameState === "PLAY") {
            this.map.update(deltaTime);
            if (InputHandler.isKeyPressed(InputHandler.KEY_ESCAPE)) {
                this.gameState = "PAUSE";
                this.togglePauseScreen();
            }
        } else if (this.gameState === "PAUSE") {
            this.pauseScreen?.update(deltaTime);
        }
    }

}