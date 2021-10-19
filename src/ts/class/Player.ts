import { vec3 } from "../lib/gl-matrix/index.js";
import { game } from "../main.js";
import { GameObject } from "./GameObject.js";
import { Sphere } from "./Sphere.js";

export class Player extends GameObject {
    target;
    speed;
    tp;

    hasBall: boolean;

    constructor(o) {
        super(o);

        this.size = vec3.fromValues(30, 60, 30);

        this.target = vec3.create();

        this.tp = new Sphere({ x: this.x, y: this.y, z: this.z, r: 5 });

        this.color = '#0000FF';

        this.hasBall = true;

        this.maxSpeed = 5;

        setInterval(() => this.hasBall = true, 1000);
    }

    get controller() {
        return game.gamepadMgr.gamepads[0];
    }

    update() {
        // leggooooo

        // set target velocity
        if (this.controller) {
            // movement
            this.applyForce(vec3.fromValues(this.controller.axes[0], 0, -this.controller.axes[1]));

            // friction
            const friction = vec3.clone(this.vel);
            vec3.normalize(friction, friction);
            vec3.scale(friction, friction, -1);
            vec3.scale(friction, friction, 1.1);
            this.applyForce(friction);

            // targeting
            this.target = vec3.fromValues(
                this.controller.axes[2] > 0.1 ? this.controller.axes[2] : this.controller.axes[2] < -0.1 ? this.controller.axes[2] : 0,
                0,
                this.controller.axes[3] > 0.1 ? this.controller.axes[3] : this.controller.axes[3] < -0.1 ? this.controller.axes[3] : 0
            )

            this.target[2] *= -1;

            vec3.normalize(this.target, this.target);
            vec3.scale(this.target, this.target, 50);

            vec3.add(this.tp.pos, this.pos, this.target);
            // offset
            this.tp.pos[1] += this.height;


            this.maxSpeed = this.controller.buttons[4].pressed ? 7 : 5;

            // shoota
            if (this.controller.buttons[5].pressed) this.shoot(false);
            if (this.controller.buttons[7].pressed) this.shoot(true);
        }

        super.update();
    }

    shoot(high: boolean) {
        if (!this.hasBall) return;
        // Quick and dirty spere spawning test for getting target vectors into ballz
        const s = new Sphere({ x: this.x, y: this.y, z: this.z, r: 10 });
        const throwForce = vec3.clone(this.target);

        vec3.normalize(throwForce, throwForce);

        // TODO balance
        vec3.scale(throwForce, throwForce, 30);

        if (high) {
            throwForce[1] = -10;
        } else {
            throwForce[1] = -7;
        }

        s.applyForce(throwForce);

        game.gameObjects.push(s);

        this.hasBall = false;
    }

    draw(ctx: CanvasRenderingContext2D) {
        game.camera.project(this);

        const drawSelf = () => {
            ctx.fillStyle = this.color;
            ctx.fillRect(
                this.projectedX,
                this.projectedY,
                this.width * this.projectedScale,
                this.height * this.projectedScale
            );
        }

        const drawTP = () => {
            this.tp.draw(ctx);
        }

        if (this.z > this.tp.z) {
            drawSelf();
            drawTP();
        } else {
            drawTP();
            drawSelf();
        }



    }
}