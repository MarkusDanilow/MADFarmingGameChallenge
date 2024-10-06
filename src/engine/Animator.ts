import { Entity } from "../entities/Entity";
import { IRenderable, IUpdatable } from "../IBasicInterfaces";
import Vector2 from "../util/Vector2";
import { TextureManager } from "./TextureManager";

export class Animator implements IUpdatable, IRenderable {

    private entity: Entity;
    private animations: Map<string, Animation> = new Map();
    private currentAnimation?: string;

    /**
     *
     */
    constructor(entity: Entity) {
        this.entity = entity;
    }

    public setCurrentAnimation(name: string) {
        if (!this.animations.has(name)) return;
        this.currentAnimation = name;
    }

    update(deltaTime: number): void {
        if (this.currentAnimation === undefined) return;
        const anim = this.animations.get(this.currentAnimation);
        if(anim === undefined) return ;  
        anim.position = this.entity.position; 
        anim.size = this.entity.size; 
        anim.update(deltaTime); 
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (this.currentAnimation === undefined) return;
        const anim = this.animations.get(this.currentAnimation); 
        if(anim === undefined) return ; 
        anim.render(ctx); 
    }

    public addAnimation(name: string, frameDuration: number) {
        if (!TextureManager.hasTexture(name)) return;
        const numFrames = TextureManager.getNumTextures(name);
        if (numFrames === undefined || numFrames <= 0) return;
        this.animations.set(name, new Animation(name, numFrames, frameDuration));
    }



}

export class Animation implements IUpdatable, IRenderable {

    name: string;

    numFrames: number;
    frameDuration: number;

    currentFrame: number;
    currentFrameDuration: number;
    
    public position: Vector2 = new Vector2(0, 0);
    public size: Vector2 = new Vector2(0, 0);

    /**
     *
     */
    constructor(name: string, numFrames: number, frameDuration: number) {
        this.name = name;
        this.numFrames = numFrames;
        this.frameDuration = frameDuration;
        this.currentFrame = 1;
        this.currentFrameDuration = 1;
    }

    update(deltaTime: number): void {
        this.currentFrameDuration += deltaTime; 
        if(this.currentFrameDuration >= this.frameDuration){
            this.currentFrameDuration = 0; 
            this.currentFrame++; 
            if(this.currentFrame > this.numFrames){
                this.currentFrame = 1 ; 
            }
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        const texture = TextureManager.getTexture(`${this.name}_${this.currentFrame}`)!;
        ctx.drawImage(texture, this.position.x, this.position.y, this.size.x, this.size.y);
    }

}