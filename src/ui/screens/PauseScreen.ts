import { InputHandler } from "../../engine/InputHandler";
import { Game } from "../../Game";
import { IRenderable, IUpdatable } from "../../IBasicInterfaces";
import { Util } from "../../util/Util";
import Button from "../components/Button";

export class PauseScreen implements IRenderable, IUpdatable {

    private game: Game;

    private resumeBtn: Button; 

    /**
     *
     */
    constructor(g: Game) {
        this.game = g;
        
        const size = Util.getCanvasSize();
        const ButtonSize = size.x > 450 ? 450 : size.x - 50;

        this.resumeBtn = new Button((size.x - ButtonSize) / 2, size.y / 4 + 100, ButtonSize, 50, "Resume");
        this.resumeBtn.onClick(() => this.resume());
    }

    render(ctx: CanvasRenderingContext2D): void {
        const size = Util.getCanvasSize();
        ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        ctx.fillRect(0, 0, size.x, size.y);

        this.resumeBtn.render(ctx);

        ctx.fillStyle = "#fff";
        const fontSize = 64;
        const title = "PAUSED";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${fontSize}px Consolas`;
        ctx.fillText(title, size.x / 2, size.y / 4);
    }

    update(deltaTime: number): void {
        this.resumeBtn.update(deltaTime);
        if (InputHandler.isKeyPressed(InputHandler.KEY_ESCAPE)) {
            this.resume();
        }
    }

    private resume() {
        this.game.gameState = "PLAY";
        this.game.togglePauseScreen();
    }

}