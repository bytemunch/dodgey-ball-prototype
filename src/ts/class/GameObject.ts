import { vec3 } from "../lib/gl-matrix/index.js";
import { game } from "../main.js";
import { Camera } from "./Camera.js";

export class GameObject {
    pos: vec3;
    vel: vec3;
    size: ReadonlyVec3;

    health: number;

    projectedScale: number;
    projectedX: number;
    projectedY: number;

    constructor(o: GameObjectOptions) {
        this.pos = vec3.fromValues(o.x, o.y, o.z)//new Vector({ x: o.x, y: o.y });
        this.vel = vec3.fromValues(0, 0, 3);
        this.size = vec3.fromValues(o.width, o.height, o.depth)
    }

    update() {
        vec3.add(this.pos, this.pos, this.vel);

        if (this.cz > game.playfield.depth / 2 || this.cz < game.playfield.z) {
            this.vel[2] *= -1;
        }
    }

    get x() {
        return this.pos[0];
    }

    get y() {
        return this.pos[1];
    }

    get z() {
        return this.pos[2];
    }

    get width() {
        return this.size[0];
    }

    get height() {
        return this.size[1];
    }

    get depth() {
        return this.size[2];
    }

    get cx() {
        return this.pos[0] + this.width / 2;
    }
    get cy() {
        return this.pos[1] + this.height / 2;
    }

    get cz() {
        return this.pos[2] + this.depth / 2;
    }

    draw(ctx: CanvasRenderingContext2D) {
        game.camera.project(this);
        ctx.fillStyle = '#FF00FF';
        ctx.fillRect(
            this.projectedX - this.width,
            this.projectedY - this.height,
            this.width * 2 * this.projectedScale,
            this.height * 2 * this.projectedScale
        );
    }

    // DEBUG
    drawXZ(ctx:CanvasRenderingContext2D) {
        ctx.fillStyle = '#FF00FF';
        ctx.fillRect(
            game.rsZ(this.x),
            game.rsZ(this.z),
            game.rsZ(this.width),
            game.rsZ(this.depth)
        );
    }

    drawXY(ctx:CanvasRenderingContext2D) {
        ctx.fillStyle = '#FF00FF';
        ctx.fillRect(
            game.rsY(this.x),
            game.rsY(this.y),
            game.rsY(this.width),
            game.rsY(this.height)
        );
    }
}

interface GameObjectOptions {
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    depth: number
}