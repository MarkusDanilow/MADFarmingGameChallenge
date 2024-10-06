export class TextureManager {

    private static textures: Map<string, HTMLCanvasElement | HTMLImageElement> = new Map(); // Speichert die geladenen Texturen
    private static numTextures: Map<string, number> = new Map();

    public static async loadAllTextures() {
        await this.textureProcess("player_idle", "assets/Characters/Human/IDLE/base_idle_strip9.png", 1, 9);
        await this.textureProcess("world", "assets/Tileset/spr_tileset_sunnysideworld_16px.png", 64, 64);
        await this.textureProcess("goblin_idle", "assets/Characters/Goblin/spr_idle_strip9.png", 1, 8);
        await this.textureProcess("skeleton_idle", "assets/Characters/Skeleton/skeleton_idle_strip6.png", 1, 6);
    }

    private static async textureProcess(name: string, path: string, rows: number, cols: number) {
        const originalTexture = await TextureManager.loadTexture(name, path);
        this.processTexture(name, originalTexture, rows, cols);
    }

    private static processTexture(name: string, inTexture: HTMLImageElement, rows: number, cols: number) {

        const frameWidth = Math.floor(inTexture.width / cols);
        const frameHeight = Math.floor(inTexture.height / rows);

        let index = 0;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
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
                this.textures.set(`${name}_${++index}`, scaledCanvas);

            }
        }

        this.numTextures.set(name, index);

    }

    private static getActualSpriteSize(context: CanvasRenderingContext2D, frameWidth: number, frameHeight: number): 
        {width: number, height: number, minX: number, minY: number} {

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

        return { width: width, height: height, minX: minX, minY: minY};
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

    public static getNumTextures(keyPattern: string){
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
                return true;
            }
        }
        return false; 
    }
}
