import { Map } from "./map/Map";

export interface IRenderable {
    render(ctx: CanvasRenderingContext2D): void;
}

export interface IUpdatable { 
    update(deltaTime: number): void; 
}

export interface IMapUpdatable { 
    update(deltaTime: number, map: Map): void
}