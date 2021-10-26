import { vec3 } from "../lib/gl-matrix/index.js";
import { game } from "../main.js";
import { GameObject } from "./GameObject.js";
import { Line } from "./Line.js";
import { Sphere } from "./Sphere.js";

export class Player extends GameObject {
    target;
    speed;
    tp;

    hasBall: boolean;

    pickupRange: number;

    team: number;

    iframes: number = 10;

    controllerDebounce = 0;

    constructor(o) {
        super(o);

        this.team = o.team;

        this.is = 'player';

        this.size = vec3.fromValues(60, 120, 60);

        this.target = vec3.create();

        this.tp = new Line(this.pos, this.target);

        this.color = this.team ? '#00FFFF' : '#FFFF00';

        this.hasBall = false;

        this.maxSpeed = 5;

        this.pickupRange = 100;
    }

    get controller() {
        return game.iAT.players[this.team];
    }

    hit(s: Sphere) {
        if (this.iframes) return;
        if (s.thrownBy == this.team) return;
        game.addToScore(this.team ? 0 : 1, 1);
        this.iframes = 30;
    }

    update() {
        // set target velocity
        if (this.controller && game.inplay) {
            this.applyForce(this.controller.direction);

            this.target = vec3.clone(this.controller.target);

            const tv1 = vec3.add([], [this.center[0], this.center[1], this.z], [0, this.height / 2, 0])

            this.tp.pos = tv1;
            this.tp.pos2 = vec3.add([], tv1, this.target);

            this.maxSpeed = game.iAT.players[this.team].sprint ? 7 : 5;

            if (this.controller.shoot || this.controller.pickup) {
                if (this.hasBall) {
                    this.shoot(true);
                } else {
                    this.pickupBall();
                }
            }

            this.iframes > 0 ? this.iframes-- : this.iframes = 0;
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
        const s = new Sphere({ x: this.cx + this.target[0], y: this.cy + this.target[1], z: this.cz + this.target[2], r: game.ballSize });
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

        s.thrownBy = this.team;

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

        drawSelf();
        drawTP();
    }
}