import { vec3 } from "../lib/gl-matrix/index.js";
import { game } from "../main.js";
import { GameObject } from "./GameObject.js";
import { Sphere } from "./Sphere.js";

export class Player extends GameObject {
    target;
    speed;
    tp;

    hasBall: boolean;

    pickupRange: number;

    team: number;

    constructor(o) {
        super(o);

        this.team = o.team;

        this.is = 'player';

        this.size = vec3.fromValues(30, 60, 30);

        this.target = vec3.create();

        this.tp = new Sphere({ x: this.x, y: this.y, z: this.z, r: 5 });

        this.color = this.team ? '#00FFFF' : '#FFFF00';

        this.hasBall = false;

        this.maxSpeed = 5;

        this.pickupRange = 50;
    }

    get controller() {
        return game.gamepadMgr.gamepads[this.team];
    }

    hit(s: Sphere) {
        console.log('AHM HIT', s.thrownBy);
    }

    update() {
        // leggooooo

        // set target velocity
        if (this.controller) {
            // movement
            this.applyForce(vec3.fromValues(this.controller.axes[0], 0, -this.controller.axes[1]));

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
            if (this.controller.buttons[6].pressed) this.pickupBall();
        }

        super.update();
        this.setInPlayfieldHalf();
    }

    setInPlayfieldHalf() {
        if (this.team) {
            if (this.left < game.playfield.x + game.playfield.width / 2) {
                this.pos[0] = game.playfield.x + game.playfield.width / 2;
            }
        } else {
            if (this.right > game.playfield.x + game.playfield.width / 2) {
                this.pos[0] = game.playfield.x + game.playfield.width / 2 - this.width;
            }
        }
    }

    pickupBall() {
        if (this.hasBall) return;

        const distanceToSphere = s => {
            return vec3.distance(this.center, s.center);
        }

        for (let s of game.gameObjects.filter(o => o.is == 'sphere')) {
            if (!(<Sphere>s).atRest) continue;
            if (distanceToSphere(s) >= this.pickupRange) continue;
            this.hasBall = true;
            s.toBeRemoved = true;
            break;
        }
    }

    shoot(high: boolean) {
        if (!this.hasBall) return;
        // Quick and dirty spere spawning test for getting target vectors into ballz
        const s = new Sphere({ x: this.cx + this.target[0], y: this.cy + this.target[1], z: this.cz + this.target[2], r: 10 });
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

        s.thrownBy = 1;

        game.gameObjects.push(s);

        this.hasBall = false;
    }

    draw(ctx: CanvasRenderingContext2D) {
        game.camera.project(this);

        const drawSelf = () => {
            ctx.fillStyle = this.hasBall ? '#FF0000' : this.color;
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