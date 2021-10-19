import { vec3 } from "../lib/gl-matrix/index.js";
import { game } from "../main.js";
import { GameObject } from "./GameObject.js";

export class Sphere extends GameObject {
    r: number;

    color: string;

    constructor(o: SphereOptions) {
        super({ ...o, depth: o.r*2, height: o.r*2, width: o.r*2 })

        this.r = o.r;
        this.color = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255} )`;
    }

    get grounded() {
        return this.y >= game.playfield.floor;
    }

    update() {
        super.update();
    }

    setInPlayfieldBounds() {
        // TODO do this with vectors to make your life infinitely easier
        // boundCheck
        if (this.cx > game.playfield.x + game.playfield.width) {
            this.pos[0] = game.playfield.x + game.playfield.width - this.width / 2;
        }
        if (this.cx < game.playfield.x + this.width) {
            this.pos[0] = game.playfield.x + this.width - this.width / 2;
        }

        if (this.cy > game.playfield.y + game.playfield.height) {
            this.pos[1] = game.playfield.y + game.playfield.height - this.height / 2;
        }

        if (this.cy < game.playfield.y) {
            this.pos[1] = game.playfield.y - this.height / 2;
        }

        if (this.cz > game.playfield.z + game.playfield.depth) {
            this.pos[2] = game.playfield.z + game.playfield.depth - this.depth / 2;
        }
        if (this.cz < game.playfield.z + this.width) {
            this.pos[2] = game.playfield.z + this.width - this.depth / 2;
        }
    }

    bounce(axis) {
        // TODO find angle of incidence and bounce accordingly, rather than just reflecting force?
        const restitution = 0.5;

        this.vel[axis] *= -restitution;
    }

    draw(ctx: CanvasRenderingContext2D) {
        game.camera.project(this);

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(
            this.projectedX,
            this.projectedY,
            this.projectedScale * 2 * this.r,
            0,
            Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    drawXY(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(game.rsY(this.pos[0]), game.rsY(this.pos[1]), game.rsY(this.r), 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    drawXZ(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
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