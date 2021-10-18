import { GameObject } from "./GameObject";

export class Camera {
    cnv: HTMLCanvasElement;

    perspective: number;
    projectionCx: number;
    projectionCy: number;

    projectedScale: number;
    projectedX: number;
    projectedY: number;

    parent: GameObject;

    constructor(cnv: HTMLCanvasElement, parent: GameObject) {
        this.cnv = cnv;
        this.parent = parent;

        this.update();
    }

    update() {
        this.perspective = this.cnv.width * 0.9;
        this.projectionCx = this.cnv.width / 2;
        this.projectionCy = this.cnv.height / 4;
    }

    project() {
        this.projectedScale = this.perspective / (this.perspective + this.parent.z);

        this.projectedX = (this.parent.x * this.projectedScale) + this.projectionCx;
        this.projectedY = (this.parent.y * this.projectedScale) + this.projectionCy;
    }
}