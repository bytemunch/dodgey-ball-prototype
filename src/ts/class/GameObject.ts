import { vec3 } from "../lib/gl-matrix/index.js";
import { game } from "../main.js";

export class GameObject {
    pos: vec3;
    readonly vel: vec3;
    acc: vec3;
    size: ReadonlyVec3;

    is:string = 'gameobject';

    maxSpeed: number;

    health: number;

    projectedScale: number;
    projectedX: number;
    projectedY: number;

    color: string;

    affectedByPhysics: boolean;

    constructor(o: GameObjectOptions) {
        this.pos = vec3.fromValues(o.x, o.y, o.z)//new Vector({ x: o.x, y: o.y });
        this.vel = vec3.create();
        this.acc = vec3.create();
        this.size = vec3.fromValues(o.width, o.height, o.depth)

        this.maxSpeed = Infinity;

        this.color = '#FF00FF';

        this.affectedByPhysics = true;
    }

    applyForce(f: vec3) {
        vec3.add(this.acc, this.acc, f);
    }

    update() {
        if (this.affectedByPhysics) {
            this.applyForce(game.gravity);

            const sAcc = vec3.clone(this.acc);

            vec3.scale(sAcc, this.acc, game.timestep);
            vec3.add(this.vel, this.vel, sAcc);

            if (vec3.distance([0, 0, 0], this.vel) > this.maxSpeed) {
                vec3.normalize(this.vel, this.vel);
                vec3.scale(this.vel, this.vel, this.maxSpeed);
            }

            const sVel = vec3.clone(this.vel);

            vec3.scale(sVel, this.vel, game.timestep);

            vec3.add(this.pos, this.pos, sVel);
            vec3.zero(this.acc);

            this.setInPlayfieldBounds();
        }
    }

    setInPlayfieldBounds() {
        // boundCheck
        if (this.right > game.playfield.x + game.playfield.width) {
            this.pos[0] = game.playfield.x + game.playfield.width - this.width;
        }
        if (this.left < game.playfield.x) {
            this.pos[0] = game.playfield.x;
        }

        if (this.bottom > game.playfield.y + game.playfield.height) {
            this.pos[1] = game.playfield.y + game.playfield.height - this.height;
        }

        if (this.top < game.playfield.y) {
            this.pos[1] = game.playfield.y;
        }

        if (this.back > game.playfield.z + game.playfield.depth) {
            this.pos[2] = game.playfield.z + game.playfield.depth - this.depth;
        }
        if (this.front < game.playfield.z) {
            this.pos[2] = game.playfield.z;
        }
    }

    get x() {
        return this.pos[0];
    }

    get y() {
        return this.pos[1];
    }

    get z() {
        return this.pos[2];
    }

    get width() {
        return this.size[0];
    }

    get height() {
        return this.size[1];
    }

    get depth() {
        return this.size[2];
    }

    get cx() {
        return this.pos[0] + this.width / 2;
    }
    get cy() {
        return this.pos[1] + this.height / 2;
    }

    get cz() {
        return this.pos[2] + this.depth / 2;
    }

    get top() {
        return this.y;
    }

    get bottom() {
        return this.y + this.height;
    }

    get left() {
        return this.x;
    }

    get right() {
        return this.x + this.width;
    }

    get front() {
        return this.z;
    }

    get back() {
        return this.z + this.depth;
    }

    draw(ctx: CanvasRenderingContext2D) {
        game.camera.project(this);
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.projectedX,
            this.projectedY,
            this.width * this.projectedScale,
            this.height * this.projectedScale
        );
    }

    // DEBUG
    drawXZ(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            game.rsZ(this.x),
            game.rsZ(this.z),
            game.rsZ(this.width),
            game.rsZ(this.depth)
        );
    }

    drawXY(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            game.rsY(this.x),
            game.rsY(this.y),
            game.rsY(this.width),
            game.rsY(this.height)
        );
    }
}

interface GameObjectOptions {
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    depth: number
}