import { Game } from "../Game";
import { Util } from "../util/Util";
import { Camera } from "./Camera";
import { InputHandler } from "./InputHandler";
import { LoadingScreen } from "./LoadingScreen";
import { TextureManager } from "./TextureManager";

export default class Engine {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private lastTime: number;
    public fps: number = 0;
    private frameCount: number = 0;
    private fpsInterval: number = 1000;
    private fpsTime: number = 0;

    private game: Game | undefined;
    loadingScreen?: LoadingScreen;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error(`Canvas with id '${canvasId}' not found.`);
        }

        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.ctx.imageSmoothingEnabled = false;
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.lastTime = performance.now();
    }

    public async initEngine() {
        this.loadingScreen = new LoadingScreen(2);
        this.loadingScreen.next("Loading textures", this.ctx);
        await this.loadTextures();

        // await this.wait(1000);
        this.loadingScreen.next("Initializing input devices", this.ctx);
        InputHandler.initialize();

        // await this.wait(2500);
        this.loadingScreen.next("Done :)", this.ctx);
        // await this.wait(2500);

    }

    private wait(miliiseconds: number): Promise<boolean> {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res(true);
            }, miliiseconds);
        })
    }

    private async loadTextures() {
        await TextureManager.loadAllTextures(); 
    }

    private resizeCanvas() {
        const screenSize = Util.getCanvasSize();
        this.canvas.width = screenSize.x;
        this.canvas.height = screenSize.y;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.ctx.imageSmoothingEnabled = false;
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
        this.calculateFPS(deltaTime);
        this.update(deltaTime);
        this.render();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private calculateFPS(deltaTime: number) {
        this.frameCount++;
        this.fpsTime += deltaTime;
        if (this.fpsTime >= this.fpsInterval) {
            this.fps = Math.floor(this.frameCount / (this.fpsTime / 1000));
            this.frameCount = 0;
            this.fpsTime = 0;
        }
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

        this.renderStats();
    }

    renderStats() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        this.ctx.fillRect(0, 0, 200, 100);

        this.ctx.fillStyle = "white"; // Farbe des Textes
        this.ctx.font = "20px Arial"; // Schriftart und Größe
        this.ctx.fillText(`FPS: ${this.fps}`, 10, 30); // Text an Position (10, 30) rendern
    }

}