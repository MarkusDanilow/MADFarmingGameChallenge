import { Camera } from "../engine/Camera";
import Vector2 from "./Vector2";

export class Util {

    public static TILES_VISIBLE = 32;

    public static getScreenSize() {
        return new Vector2(window.innerWidth, window.innerHeight);
    }

    public static getCanvasSize() {
        return this.getScreenSize(); 
    }

    public static getTileSize() {
        const screenSize = Util.getScreenSize();
        return screenSize.x > screenSize.y ? Math.ceil(screenSize.x / Util.TILES_VISIBLE) : Math.ceil(screenSize.y / Util.TILES_VISIBLE);
    }

    public static WorldPos2TileIndex(worldPos: Vector2, useCamOffset: boolean = false): Vector2{
        if(worldPos === undefined) return new Vector2(0,0); 
        const tileSize = Util.getTileSize(); 
        const offset = useCamOffset ? Camera.position : new Vector2(0, 0); 
        return new Vector2(
            Math.floor((worldPos.x - offset.x) / tileSize),
            Math.floor((worldPos.y - offset.y) / tileSize)
        );
    }

    public static generateUuid(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

}

