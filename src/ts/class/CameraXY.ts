import { game } from "../main.js";
import { Camera } from "./Camera.js";
import { UIObject } from "./UIObject.js";

export class CameraXY extends Camera {
    cnv: HTMLCanvasElement;

    perspective: number;
    projectionCx: number;
    projectionCy: number;

    update(sr) {
        this.perspective = (568);
        this.projectionCx = (568 / 2) * sr;
        this.projectionCy = (320 / 2) * sr;
    }

    project2D(o: UIObject) {
        o.projectedScale = game.sizeRatio;
        o.projectedX = ((o.pos[0] * o.projectedScale) + this.projectionCx);
        o.projectedY = ((o.pos[1] * o.projectedScale) + this.projectionCy);
    }

}