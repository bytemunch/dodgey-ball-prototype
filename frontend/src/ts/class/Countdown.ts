import { game } from "../main.js";
import { UIObject } from "./UIObject.js";

export class Countdown extends UIObject {
    timeLeft;

    constructor(o) {
        super(o);
    }

    update(t) {
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (game.countdown < 0) return;//TODO removeNextFrame
        game.cameraXY.project2D(this);

        let txt = game.countdown.toString();
        if (game.countdown == 0) txt = 'GO!';

        ctx.fillStyle = '#ff0000';
        ctx.font = `${48 * this.projectedScale}px monospace`;
        ctx.fillText(txt, this.projectedX - 24 * this.projectedScale, this.projectedY - 24 * this.projectedScale);
    }
}