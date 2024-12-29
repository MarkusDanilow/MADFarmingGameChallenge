import { Game } from "../Game";
import { Util } from "../util/Util";
import { Camera } from "./Camera";
import { InputHandler } from "./InputHandler";
import { LoadingScreen } from "./LoadingScreen";
import { TextureManager } from "./TextureManager";

export class EngineAPI {

    private static engine: Engine;

    public static registerEngine(e: Engine) {
        this.engine = e;
    }

    public static changeCursor(path: string | undefined): void {
        if (path === undefined) {
            this.engine.cursor = undefined;
            this.engine.canvas.style.cursor = "default";
        } else {
            const cursorImage = new Image();
            cursorImage.src = path;
            this.engine.cursor = cursorImage;
            this.engine.canvas.style.cursor = "none";
        }
    }

}


export default class Engine {

    private _canvas!: HTMLCanvasElement;
    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }
    public set canvas(value: HTMLCanvasElement) {
        this._canvas = value;
    }
    private ctx: CanvasRenderingContext2D;

    private lastTime: number;
    public fps: number = 0;
    private frameCount: number = 0;
    private fpsInterval: number = 1000;
    private fpsTime: number = 0;

    private game: Game | undefined;
    private loadingScreen?: LoadingScreen;

    private canRenderStats: boolean = false;

    private _cursor: HTMLImageElement | undefined = undefined;
    public get cursor(): HTMLImageElement | undefined {
        return this._cursor;
    }
    public set cursor(value: HTMLImageElement | undefined) {
        this._cursor = value;
    }

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

        EngineAPI.registerEngine(this);

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
        if (InputHandler.isKeyPressed(InputHandler.KEY_F3)) {
            this.canRenderStats = !this.canRenderStats;
        }
        if (InputHandler.isKeyPressed(InputHandler.KEY_F11)) {
            Util.toggleFullScreen();
        }
        this.game?.update(deltaTime);
        InputHandler.update();
    }

    private render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.game?.render(this.ctx);
        this.ctx.restore();
        if (this.canRenderStats) {
            this.renderStats();
        }

        // render cursor
        if (this.cursor !== undefined) {
            const mousePos = InputHandler.getMousePosition();
            // this.ctx.globalAlpha = 0.5;
            this.ctx.drawImage(this.cursor, mousePos.x, mousePos.y, 48, 48);
            // this.ctx.globalAlpha = 1.0;
        }
    }

    renderStats() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        this.ctx.fillRect(0, 0, 200, 100);
        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Consolas";
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);
    }

}