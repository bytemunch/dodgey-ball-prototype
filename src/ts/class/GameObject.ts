import { game } from "../main.js";
import { Vector } from "./Vector.js";

export class GameObject {
    pos: Vector;
    vel: Vector;

    width: number;
    height: number;

    health: number;

    prevBB;

    constructor(o: GameObjectOptions) {
        this.pos = new Vector({ x: o.x, y: o.y });
        this.vel = new Vector({ x: 0, y: 0 });
        this.width = 48;
        this.height = 48;
    }

    update() {
        this.prevBB = {
            left: this.left,
            right: this.right,
            top: this.top,
            bottom: this.bottom,
        }
    }

    get left() {
        return this.pos.x;
    }
    get right() {
        return this.pos.x + this.width;
    }
    get top() {
        return this.pos.y;
    }
    get bottom() {
        return this.pos.y + this.height;
    }

    get cx() {
        return this.pos.x + this.width / 2;
    }
    get cy() {
        return this.pos.y + this.height / 2;
    }

    collide(o: GameObject) {
        if (o == this) return;

        if (this.left < o.right &&
            this.right > o.left &&
            this.top < o.bottom &&
            this.bottom > o.top) {

            // Collision!

            const leftCollide = this.prevBB.right < o.left && this.right >= o.left;

            const rightCollide = this.prevBB.left >= o.right && this.left < o.right;

            const topCollide = this.prevBB.bottom < o.top && this.bottom >= o.top;

            const bottomCollide = this.prevBB.top >= o.bottom && this.top < o.bottom;

            console.log(`collision! R:${rightCollide} L:${leftCollide} T:${topCollide} B:${bottomCollide}`);
            // if (!rightCollide && !leftCollide && !topCollide && !bottomCollide) debugger;
            return { r: rightCollide, l: leftCollide, t: topCollide, b: bottomCollide };

        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#FF00FF';
        ctx.fillRect(game.rs(this.pos.x), game.rs(this.pos.y), game.rs(this.width / 2), game.rs(this.height / 2));
        ctx.fillRect(game.rs(this.pos.x + this.width / 2), game.rs(this.pos.y + this.height / 2), game.rs(this.width / 2), game.rs(this.height / 2));
        ctx.fillStyle = "#000000";
        ctx.fillRect(game.rs(this.pos.x), game.rs(this.pos.y + this.height / 2), game.rs(this.width / 2), game.rs(this.height / 2));
        ctx.fillRect(game.rs(this.pos.x + this.width / 2), game.rs(this.pos.y), game.rs(this.width / 2), game.rs(this.height / 2));
    }
}

interface GameObjectOptions {
    x: number,
    y: number
}