import { game } from "../main.js";
import { GameObject } from "./GameObject.js";
import { Vector } from "./Vector.js";

export class TestPlayer extends GameObject {
    target: Vector;

    speed = 2;

    constructor(o) {
        super(o);

        this.target = new Vector;
    }

    get controller() {
        return game.gamepadMgr.gamepads[0];
    }

    update() {
        super.update();

        // leggooooo

        // set target velocity
        if (this.controller) {
            this.vel.setXY(this.controller.axes[0], this.controller.axes[1]);

            this.target.setX(this.controller.axes[2] > 0.1 ? this.controller.axes[2] : this.controller.axes[2] < -0.1 ? this.controller.axes[2] : 0);
            this.target.setY(this.controller.axes[3] > 0.1 ? this.controller.axes[3] : this.controller.axes[3] < -0.1 ? this.controller.axes[3] : 0);

            this.target.setMag(50);

            this.speed = this.controller.buttons[4].pressed ? 4 : 2;
        }

        this.pos.addV(this.vel.iMult(game.timestep).iMult(this.speed));
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

        ctx.fillStyle = '#00FF00';
        ctx.beginPath();
        ctx.arc(this.cx + this.target.x, this.cy + this.target.y, 5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}