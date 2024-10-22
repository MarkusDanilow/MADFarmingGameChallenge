import { AnimationType } from "./Animator";

export interface TextureConfig { 
    path: string;
    rowsTotal: number;
    colsTotal: number;
}

export interface TextureAtlasEntry {
    textureConfig: TextureConfig; 
    rowsOffset: number;
    colsOffset: number;
    rows: number;
    cols: number;
}

const PlayerTextureConfig: TextureConfig = {
    path: 'assets/player.png',
    colsTotal: 6,
    rowsTotal: 1
}
const NpcTextureConfig: TextureConfig = {
    path: 'assets/npc.png',
    colsTotal: 6,
    rowsTotal: 1
}

const TextureAtlas: Map<string, TextureAtlasEntry> = new Map([
    [`player_${AnimationType.IDLE}_side`, {
        cols: 1,
        rows: 1,
        colsOffset: 4,
        rowsOffset: 0,
        textureConfig: PlayerTextureConfig
    }],
    [`player_${AnimationType.IDLE}_front`, {
        cols: 1,
        rows: 1,
        colsOffset: 0,
        rowsOffset: 0,
        textureConfig: PlayerTextureConfig
    }],
    [`player_${AnimationType.RUN}_front`, {
        cols: 4,
        rows: 1,
        colsOffset: 0,
        rowsOffset: 0,
        textureConfig: PlayerTextureConfig
    }],
    [`player_${AnimationType.RUN}_side`, {
        cols: 2,
        rows: 1,
        colsOffset: 4,
        rowsOffset: 0,
        textureConfig: PlayerTextureConfig
    }],

    [`npc_${AnimationType.IDLE}_side`, {
        cols: 1,
        rows: 1,
        colsOffset: 4,
        rowsOffset: 0,
        textureConfig: NpcTextureConfig
    }],
    [`npc_${AnimationType.IDLE}_front`, {
        cols: 1,
        rows: 1,
        colsOffset: 0,
        rowsOffset: 0,
        textureConfig: NpcTextureConfig
    }],
    [`npc_${AnimationType.RUN}_front`, {
        cols: 4,
        rows: 1,
        colsOffset: 0,
        rowsOffset: 0,
        textureConfig: NpcTextureConfig
    }],
    [`npc_${AnimationType.RUN}_side`, {
        cols: 2,
        rows: 1,
        colsOffset: 4,
        rowsOffset: 0,
        textureConfig: NpcTextureConfig
    }]
]);

export class TextureManager {

    private static textures: Map<string, HTMLCanvasElement | HTMLImageElement> = new Map(); // Speichert die geladenen Texturen
    private static numTextures: Map<string, number> = new Map();

    public static async loadAllTextures() {
        for(let animName of TextureAtlas.keys()){
            await this.textureProcess(animName, TextureAtlas.get(animName)!);
        }
    }

    private static async textureProcess(name: string, atlasEntry: TextureAtlasEntry) {
        const originalTexture = await TextureManager.loadTexture(name, atlasEntry.textureConfig.path);
        this.processTexture(name, originalTexture, atlasEntry);
    }

    private static processTexture(name: string, inTexture: HTMLImageElement, atlasEntry: TextureAtlasEntry) {

        const frameWidth = Math.floor(inTexture.width / atlasEntry.textureConfig.colsTotal);
        const frameHeight = Math.floor(inTexture.height / atlasEntry.textureConfig.rowsTotal);

        let index = 0;
        for (let row = atlasEntry.rowsOffset; row < atlasEntry.rowsOffset + atlasEntry.rows; row++) {
            for (let col = atlasEntry.colsOffset; col < atlasEntry.colsOffset + atlasEntry.cols; col++) {
                const srcCanvas = document.createElement('canvas');
                srcCanvas.width = frameWidth;
                srcCanvas.height = frameHeight;

                const srcCtx = srcCanvas.getContext('2d')!;
                srcCtx.drawImage(
                    inTexture,
                    col * frameWidth, row * frameHeight,
                    frameWidth, frameHeight,
                    0, 0,
                    frameWidth, frameHeight
                );

                /*
                const { width, height, minX, minY } = this.getActualSpriteSize(srcCtx, frameWidth, frameHeight);

                const scaledCanvas = document.createElement('canvas');
                scaledCanvas.width = width;
                scaledCanvas.height = height;
                const scaledContext = scaledCanvas.getContext('2d')!;
                scaledContext.drawImage(
                    srcCanvas,
                    minX, minY,
                    width, height,
                    0, 0,
                    width, height
                );
                */

                this.textures.set(`${name}_${++index}`, srcCanvas);

            }
        }

        this.numTextures.set(name, index);

    }

    private static getActualSpriteSize(context: CanvasRenderingContext2D, frameWidth: number, frameHeight: number): { width: number, height: number, minX: number, minY: number } {

        const imageData = context.getImageData(0, 0, frameWidth, frameHeight);
        const pixels = imageData.data;

        let minX = frameWidth, minY = frameHeight, maxX = 0, maxY = 0;

        // Scanne das Bild, um die tatsächlichen sichtbaren Pixel zu finden
        for (let y = 0; y < frameHeight; y++) {
            for (let x = 0; x < frameWidth; x++) {
                const alpha = pixels[(y * frameWidth + x) * 4 + 3]; // Alpha-Wert

                if (alpha > 0) { // Wenn der Pixel sichtbar ist (nicht transparent)
                    if (x < minX) minX = x;
                    if (y < minY) minY = y;
                    if (x > maxX) maxX = x;
                    if (y > maxY) maxY = y;
                }
            }
        }

        // Berechne die tatsächliche Breite und Höhe des sichtbaren Bereichs
        const width = maxX - minX + 1;
        const height = maxY - minY + 1;

        return { width: width, height: height, minX: minX, minY: minY };
    }

    // Lädt eine Textur (PNG) asynchron und speichert sie
    public static async loadTexture(key: string, src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = src;

            // Wenn das Bild geladen wurde, speichere es in der Map
            image.onload = () => {
                resolve(image);
            };

            // Fehlerbehandlung, falls das Bild nicht geladen werden kann
            image.onerror = () => {
                reject(`Failed to load texture: ${src}`);
            };
        });
    }

    public static getTexture(key: string): HTMLImageElement | HTMLCanvasElement | undefined {
        return this.textures.get(key);
    }

    public static getNumTextures(keyPattern: string) {
        for (let key of this.numTextures.keys()) {
            if (key.startsWith(keyPattern)) {
                return this.numTextures.get(key);
            }
        }
        return -1;
    }

    public static hasTexture(keyPattern: string): boolean {
        for (let key of this.numTextures.keys()) {
            if (key.startsWith(keyPattern)) {
                console.log(keyPattern); 
                return true;
            }
        }
        return false;
    }
}
