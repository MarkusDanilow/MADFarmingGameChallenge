import { Game } from "../Game";
import { Util } from "../util/Util";
import { Camera } from "./Camera";
import { InputHandler } from "./InputHandler";

export default class Engine {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private lastTime: number;

    private game: Game | undefined;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error(`Canvas with id '${canvasId}' not found.`);
        }

        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.ctx.imageSmoothingEnabled = false;
        
        this.lastTime = 0;

        InputHandler.initialize();

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    private resizeCanvas() {
        const screenSize = Util.getScreenSize();
        this.canvas.width = screenSize.x;
        this.canvas.height = screenSize.y;
    }

    setGame(game: Game) {
        this.game = game;
    }

    start() {
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private gameLoop(timestamp: number) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private update(deltaTime: number) {
        this.game?.update(deltaTime); 
    }

    private render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // translate by camera offset
        this.ctx.save(); 
        this.ctx.translate(Camera.position.x, Camera.position.y); 

        // render game 
        this.game?.render(this.ctx);

        this.ctx.restore(); 
    }

}