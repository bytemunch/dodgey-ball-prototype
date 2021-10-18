import { GameObject } from "./GameObject.js";

export class Camera {
    cnv: HTMLCanvasElement;

    perspective: number;
    projectionCx: number;
    projectionCy: number;

    constructor(cnv: HTMLCanvasElement) {
        this.cnv = cnv;
        this.update();
    }

    update() {
        this.perspective = this.cnv.width * 0.9;
        this.projectionCx = this.cnv.width / 2;
        this.projectionCy = this.cnv.height / 4;
    }

    project(o:GameObject) {
        o.projectedScale = this.perspective / (this.perspective + o.z);
        o.projectedX = (o.x * o.projectedScale) + this.projectionCx;
        o.projectedY = (o.y * o.projectedScale) + this.projectionCy;
    }
}