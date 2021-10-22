import { vec2 } from "../lib/gl-matrix/index.js";
import { game } from "../main.js";

export class UIObject {
    pos: vec2;
    size: vec2;

    projectedScale;
    projectedX;
    projectedY;

    is;

    cz = Infinity;

    constructor(o: UIObjectOptions) {
        this.pos = o.pos;
        this.size = vec2.fromValues(48, 48);
    }

    update(t?) {

    }

    draw(ctx: CanvasRenderingContext2D) {
        // Project to new XYCamera
        game.cameraXY.project2D(this);
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(this.projectedX, this.projectedY, this.size[0] * this.projectedScale, this.size[1] * this.projectedScale);
    }
}

interface UIObjectOptions {
    pos: vec2
}