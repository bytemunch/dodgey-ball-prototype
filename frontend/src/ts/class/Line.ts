import { game } from "../main.js";
import { GameObject } from "./GameObject.js";

export class Line extends GameObject {
    pos2;

    lineWidth;

    constructor(v1, v2, color='#FF0000', lineWidth=1) {
        super({
            x: v1[0], y: v1[1], z: v1[2],
            width: v2[0], height: v2[1], depth: v2[2]
        });

        this.is = 'line'

        this.pos2 = v2;

        this.affectedByPhysics = false;

        this.color = color;

        this.lineWidth = lineWidth;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const v1 = game.camera.vProject(this.pos);
        const v2 = game.camera.vProject(this.pos2);

        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.closePath();
        ctx.stroke();
    }
}