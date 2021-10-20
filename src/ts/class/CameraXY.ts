import { Camera } from "./Camera.js";
import { UIObject } from "./UIObject.js";

export class CameraXY extends Camera {
    cnv: HTMLCanvasElement;

    perspective: number;
    projectionCx: number;
    projectionCy: number;

    update() {
        this.perspective = this.cnv.width;
        this.projectionCx = this.cnv.width / 2;
        this.projectionCy = this.cnv.height / 2;
    }

    project2D(o:UIObject) {
        o.projectedScale = this.perspective / (this.perspective);
        o.projectedX = (o.pos[0] * o.projectedScale) + this.projectionCx;
        o.projectedY = (o.pos[1] * o.projectedScale) + this.projectionCy;
    }

}