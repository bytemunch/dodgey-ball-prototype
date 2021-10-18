import { vec3 } from "../lib/gl-matrix/index.js";
import { game } from "../main.js";
import { GameObject } from "./GameObject.js";

export class Sphere extends GameObject {
    pos: vec3;
    vel: vec3;
    r: number;

    constructor(o: SphereOptions) {
        super({ ...o, depth: o.r, height: o.r, width: o.r })

        this.r = o.r;
        this.pos = vec3.fromValues(o.x, o.y, o.z);
        this.vel = vec3.fromValues(3, 3, 0);
    }

    update() {
        vec3.add(this.pos, this.pos, this.vel);

        if (this.cx > game.playfield.x + game.playfield.width || this.cx < game.playfield.x) {
            this.vel[0] *= -1;
        }

        if (this.cy > game.playfield.y + game.playfield.height || this.cy < game.playfield.y) {
            this.vel[1] *= -1;
        }

        if (this.cz > game.playfield.z + game.playfield.depth || this.cz < game.playfield.z) {
            this.vel[2] *= -1;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        game.camera.project(this);

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(
            this.projectedX - this.width,
            this.projectedY - this.height,
            this.projectedScale * 2 * this.r,
            0,
            Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    drawXY(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(game.rsY(this.pos[0]), game.rsY(this.pos[1]), game.rsY(this.r), 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    drawXZ(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(game.rsZ(this.pos[0]), game.rsZ(this.pos[2]), game.rsZ(this.r), 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

interface SphereOptions {
    x: number,
    y: number,
    z: number,
    r: number
}