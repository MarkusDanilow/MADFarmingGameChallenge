import { Util } from "../util/Util";
import Vector2 from "../util/Vector2";

export class Camera {

    static position: Vector2 = new Vector2(0, 0);
    static maxPos: Vector2 = new Vector2(0, 0);

    static initMaxPos(mapSize: Vector2) {
        const screenSize = Util.getScreenSize();
        const tileSize = Util.getTileSize();
        this.maxPos = new Vector2(
            (mapSize.x * tileSize - screenSize.x) * -1,
            (mapSize.y * tileSize - screenSize.y) * -1
        );
    }

    static move(dx: number, dy: number) {

        const rdx = dx * -1, rdy = dy * -1;

        if (rdx > 0 && this.position.x >= 0) this.position.x = 0;
        else if (rdx < 0 && this.position.x <= this.maxPos.x) this.position.x = this.maxPos.x;
        else this.position.x += rdx;

        if (rdy > 0 && this.position.y >= 0) this.position.y = 0;
        else if (rdy < 0 && this.position.y <= this.maxPos.y) this.position.y = this.maxPos.y;
        else this.position.y += rdy;
    }

}