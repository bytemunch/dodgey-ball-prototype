import { game } from "../main.js";
import { UIObject } from "./UIObject.js";

export class Ballswap extends UIObject {
    timeLeft;

    constructor(o) {
        super(o);

        this.size = [32, 32];
    }

    update(t) {
        this.timeLeft = Math.ceil((game.ballOneSidedTimeLimit * 2 - (t - game.ballsOneSidedSince + game.ballOneSidedTimeLimit)) / 1000);

        let p = game.allBallsLeft ? game.players[1] : game.players[0];
        // position above player
        this.pos = [
            p.projectedX, p.projectedY - this.size[1] * p.projectedScale
        ]
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!game.allBallsLeft && !game.allBallsRight) return;
        game.cameraXY.project2D(this);

        ctx.strokeStyle = '#FF0000';
        ctx.strokeRect(this.pos[0], this.pos[1], this.size[0] * this.projectedScale, this.size[1] * this.projectedScale);

        ctx.fillStyle = '#ff0000';
        ctx.font = `${14 * this.projectedScale}px monospace`;
        ctx.fillText('THROW!', this.pos[0], this.pos[1]);
        ctx.font = `${18 * this.projectedScale}px monospace`;
        ctx.fillText(this.timeLeft.toString(), this.pos[0], this.pos[1] + 14 * this.projectedScale);
    }
}