import { InputHandler } from "../engine/InputHandler";
import { TextureManager } from "../engine/TextureManager";
import { Entity } from "../entities/Entity";
import { Item } from "../entities/items/Item";
import { Game } from "../Game";
import { IRenderable, IUpdatable } from "../IBasicInterfaces";
import { BoundBox2D, CollisionCheckObject, CollisionResult, MoveCheckResult } from "../util/BB2D";
import { Util } from "../util/Util";
import Vector2 from "../util/Vector2";

export class Tile implements IRenderable {

    private size: Vector2;
    private position: Vector2;
    private index: Vector2;
    private color: string | undefined;

    public collidable: boolean = false;
    public bb: BoundBox2D | undefined;

    /**
     *
     */
    constructor(x: number, y: number) {
        const size = Util.getTileSize();
        this.size = new Vector2(size, size);
        this.index = new Vector2(x, y);
        this.position = new Vector2(size * x, size * y);
        // this.collidable = Math.random() < 0.1;
        this.bb = this.collidable ? new BoundBox2D(this.position.x, this.position.y, size, size) : undefined;
        this.genColor();
    }

    private genColor() {
        if (this.collidable) this.color = '#333';
        else {
            const green = Math.floor(Math.random() * (255 - 100) + 100);
            const red = green;
            const blue = green;
            this.color = `#${((1 << 24) + (red << 16) + (green << 8) + blue)
                .toString(16)
                .slice(1)}`;
        }
    }

    render(ctx: CanvasRenderingContext2D): void {

        const textureName = this.collidable ? "world_133" : "world_130";
        const texture = TextureManager.getTexture(textureName);
        if (texture !== undefined) {
            ctx.drawImage(texture, this.position.x, this.position.y, this.size.x, this.size.y);
        } else {
            ctx.fillStyle = this.color!;
            ctx.fillRect(this.position.x, this.position.y, this.size.x + 0.5, this.size.y + 0.5);
        }

        if (!Game.RENDER_DEV || !this.collidable) return;
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.bb?.x!, this.bb?.y!, this.bb?.width!, this.bb?.height!);
    }

    highlightCheck(ctx: CanvasRenderingContext2D, mouseIndex: Vector2) {
        if (mouseIndex.x == this.index.x && mouseIndex.y == this.index.y) {
            ctx.strokeStyle = '#ee9922';
            ctx.lineWidth = 4;
            ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
        }
    }

}

export class Map implements IRenderable, IUpdatable {

    private tiles: Tile[][];
    private size: Vector2;

    private _entities: Entity[];
    public get entities(): Entity[] {
        return this._entities;
    }
    public set entities(value: Entity[]) {
        this._entities = value;
    }

    /**
     *
     */
    constructor(sx: number, sy: number) {
        this._entities = [];
        this.tiles = [];
        this.size = new Vector2(sx, sy);
        for (let x = 0; x < this.size.x; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < this.size.y; y++) {
                this.tiles[x][y] = new Tile(x, y);
            }
        }
    }

    addEntity(e: Entity) {
        this.entities.push(e);
    }
    
    removeEntity(e: Entity) {
        const index = this.entities.indexOf(e);
        if (index > -1) {
            this.entities.splice(index, 1); 
        }
    }

    update(deltaTime: number): void {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update(deltaTime, this);
        }
        this.sortEntities();
    }

    render(ctx: CanvasRenderingContext2D): void {
        const mouseIndex = Util.WorldPos2TileIndex(InputHandler.getMousePosition(), true);
        for (let x = 0; x < this.size.x; x++) {
            for (let y = 0; y < this.size.y; y++) {
                this.tiles[x][y].render(ctx);
                if (Game.RENDER_DEV) {
                    this.tiles[x][y].highlightCheck(ctx, mouseIndex);
                }
            }
        }
        this.entities.forEach(e => {
            e.render(ctx);
        })
    }

    private sortEntities() {
        this.entities = this.entities.sort((a, b) =>
            (a.bb?.y! + a.bb?.height!) -
            (b.bb?.y! + b.bb?.height!)
        );
    }

    /**
     * 
     * @param entity 
     * @param moveVector 
     * @returns 
     */
    public entityMoveCheck(entity: Entity, moveVector: Vector2): MoveCheckResult {

        if (entity.bb === undefined) return {
            collidingEntities: [],
            collidingTiles: [],
            moveVector: Vector2.ZERO
        };

        const entityBBCenter = entity.bb?.getCenter()!;
        const entityPos = new Vector2(entity.bb?.x!, entity.bb?.y!);
        const tilePos = Util.WorldPos2TileIndex(entityBBCenter, false);

        const targetX = entityPos.x + moveVector.x;
        const targetY = entityPos.y + moveVector.y;

        const collisionCheckObjects: CollisionCheckObject[] = this.getSurroundingTiles(tilePos.x, tilePos.y).map(t => {
            return {
                collidable: t.collidable,
                bb: t.bb,
                obj: t
            }
        });
        const nearest = this.findClosestEntity(entity, this.entities);
        if (nearest !== null) {
            collisionCheckObjects.push({
                bb: nearest?.bb,
                collidable: nearest?.collidable!,
                obj: nearest
            });
        }

        let newBoundingBoxX = new BoundBox2D(targetX, entityPos.y, entity.bb?.width, entity.bb?.height);
        let newBoundingBoxY = new BoundBox2D(entityPos.x, targetY, entity.bb?.width, entity.bb?.height);

        const moveCheckResult: MoveCheckResult = {
            collidingEntities: [],
            collidingTiles: [],
            moveVector: moveVector
        }
        for (const obj of collisionCheckObjects) {
            const collisionResult = this.collisionCheckCore(
                targetX, targetY,
                entity.collidable, entity.bb,
                newBoundingBoxX, newBoundingBoxY,
                obj, moveVector
            );
            moveVector = collisionResult.vector;
            if (collisionResult.entity !== undefined) {
                if (collisionResult.entity instanceof Entity) {
                    moveCheckResult.collidingEntities.push(collisionResult.entity);
                } else if (collisionResult.entity instanceof Tile) {
                    moveCheckResult.collidingTiles.push(collisionResult.entity);
                }
            }
            if (moveVector.x === 0 && moveVector.y === 0) break;
        }

        moveCheckResult.moveVector = moveVector;

        return moveCheckResult;
    }

    private collisionCheckCore(
        targetX: number, targetY: number,
        srcCollidable: boolean,
        srcEntityBb: BoundBox2D | undefined,
        srcNewBbX: BoundBox2D, srcNewBbY: BoundBox2D,
        destCollisionCheckObj: CollisionCheckObject,
        srcMoveVector: Vector2): CollisionResult {

        if (!srcCollidable || !destCollisionCheckObj.collidable || srcEntityBb === undefined || destCollisionCheckObj.bb === undefined)
            return {
                vector: srcMoveVector,
                entity: undefined
            };

        let collisionResult: CollisionResult = {
            vector: srcMoveVector,
            entity: undefined
        }

        if (destCollisionCheckObj.bb.intersects(srcNewBbX)) {
            collisionResult.entity = destCollisionCheckObj.obj;
            if (srcMoveVector.x > 0 && targetX + srcEntityBb.width > destCollisionCheckObj.bb.x) {
                collisionResult.vector.x = destCollisionCheckObj.bb.x - (srcEntityBb.x + srcEntityBb.width);
            } else if (srcMoveVector.x < 0 && targetX < destCollisionCheckObj.bb.x + destCollisionCheckObj.bb.width) {
                collisionResult.vector.x = -(srcEntityBb.x - (destCollisionCheckObj.bb.x + destCollisionCheckObj.bb.width));
            }
        }

        if (destCollisionCheckObj.bb.intersects(srcNewBbY)) {
            collisionResult.entity = destCollisionCheckObj.obj;
            if (srcMoveVector.y > 0 && targetY + srcEntityBb.height > destCollisionCheckObj.bb.y) {
                collisionResult.vector.y = destCollisionCheckObj.bb.y - (srcEntityBb.y + srcEntityBb.height);
            } else if (srcMoveVector.y < 0 && targetY < destCollisionCheckObj.bb.y + destCollisionCheckObj.bb.height) {
                collisionResult.vector.y = -(srcEntityBb.y - (destCollisionCheckObj.bb.y + destCollisionCheckObj.bb.height));
            }
        }

        return collisionResult;
    }

    /**
     * 
     * @param gridX 
     * @param gridY 
     * @returns 
     */
    getSurroundingTiles(gridX: number, gridY: number): Tile[] {
        const tiles: Tile[] = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const neighborX = gridX + i;
                const neighborY = gridY + j;
                if (neighborX >= 0 && neighborY >= 0 && neighborX < this.size.x && neighborY < this.size.y) {
                    tiles.push(this.tiles[neighborX][neighborY]);
                }
            }
        }
        return tiles;
    }

    /**
     * 
     * @param srcEntity 
     * @param entities 
     * @returns 
     */
    findClosestEntity(srcEntity: Entity, entities: Entity[]): Entity | null {
        if (entities.length === 0) return null;

        let closestEntity = entities[0].uuid == srcEntity.uuid ? null : entities[0];
        let closestDistance = closestEntity !== null ? srcEntity.calculateDistance(closestEntity) : Number.POSITIVE_INFINITY;

        for (let i = 1; i < entities.length; i++) {
            const distance = srcEntity.calculateDistance(entities[i]);
            if (distance < closestDistance && srcEntity.uuid !== entities[i].uuid) {
                closestDistance = distance;
                closestEntity = entities[i];
            }
        }

        return closestEntity;
    }


}