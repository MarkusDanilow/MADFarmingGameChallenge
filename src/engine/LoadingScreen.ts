import { IRenderable } from "../IBasicInterfaces";
import { Util } from "../util/Util";

export class LoadingScreen implements IRenderable {

    private numSteps: number = 1 ; 
    private progress: number = 0;
    private description: string = "";

    public setDescription(description: string){
        this.description = description; 
    }

    /**
     *
     */
    constructor(numSteps: number) {
        this.numSteps = numSteps; 
        this.reset(); 
    }

    public reset(){
        this.progress = 0; 
        this.description = ""; 
    }

    public next(desc: string, ctx: CanvasRenderingContext2D){
        this.progress++; 
        this.setDescription(desc); 
        this.render(ctx); 
    }

    render(ctx: CanvasRenderingContext2D): void {
        
        const screenSize = Util.getScreenSize(); 

        const perc = (this.progress - 1 ) / this.numSteps ; 

        // background
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, screenSize.x, screenSize.y); 

        // loading bar
        const lbw = screenSize.x / 2 ; 
        const lbh = 20; 
        const prog = lbw * perc; 
        ctx.fillStyle = "#fff"; 
        ctx.fillRect((screenSize.x - lbw) / 2, (screenSize.y - lbh) / 2, prog, lbh); 

        ctx.font = "20px Arial"; // Schriftart und Größe
        ctx.fillText(`${this.description} (${Math.ceil(perc * 100)}%)`, (screenSize.x - lbw) / 2, (screenSize.y - lbh) / 2 + lbh * 2); // Text an Position (10, 30) rendern

    }


}