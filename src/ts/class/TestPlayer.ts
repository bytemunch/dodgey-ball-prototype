import { game } from "../main.js";
import { GameObject } from "./GameObject.js";

import { vec2 } from "../lib/gl-matrix/index.js";

export class TestPlayer extends GameObject {
    target: vec2;

    speed = 2;

    constructor(o) {
        super(o);

        this.target = vec2.create();
    }

    get controller() {
        return game.gamepadMgr.gamepads[0];
    }

    update() {
        super.update();

        // leggooooo

        // set target velocity
        if (this.controller) {
            this.vel = vec2.fromValues(this.controller.axes[0], this.controller.axes[1]);

            this.target = vec2.fromValues(
                this.controller.axes[2] > 0.1 ? this.controller.axes[2] : this.controller.axes[2] < -0.1 ? this.controller.axes[2] : 0,
                this.controller.axes[3] > 0.1 ? this.controller.axes[3] : this.controller.axes[3] < -0.1 ? this.controller.axes[3] : 0
            )

            vec2.normalize(this.target, this.target);

            vec2.scale(this.target, this.target, 50);

            this.speed = this.controller.buttons[4].pressed ? 4 : 2;
        }

        vec2.scale(this.vel, this.vel, game.timestep);
        vec2.scale(this.vel, this.vel, this.speed);

        vec2.add(this.pos, this.pos, this.vel);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);

        ctx.fillStyle = '#00FF00';
        ctx.beginPath();
        ctx.arc(this.cx + this.target[0], this.cy + this.target[1], 5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}