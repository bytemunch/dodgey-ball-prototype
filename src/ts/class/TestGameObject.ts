import { game } from "../main.js";
import { GameObject } from "./GameObject.js";
import { Vector } from "./Vector.js";

export class TestGameObject extends GameObject {
    constructor(o) {
        super(o);
        this.vel = new Vector({ x: 5, y: 5 });
    }

    update() {
        super.update();

        this.checkEdgeCollision();

        this.pos.addV(this.vel.iMult(game.timestep));
    }

    checkEdgeCollision() {
        if (this.left <= 0) {
            this.pos.setX(0);
            this.vel.setX(this.vel.x * -1);
        }
        if (this.right >= game.naturalGameBB.width){
            this.pos.setX(game.naturalGameBB.width - this.width);
            this.vel.setX(this.vel.x * -1);
        }
        if (this.top <= 0) {
            this.pos.setY(0);
            this.vel.setY(this.vel.y * -1);
        }
        if (this.bottom >= game.naturalGameBB.height){
            this.pos.setY(game.naturalGameBB.height - this.height);
            this.vel.setY(this.vel.y * -1);
        }
    }
}