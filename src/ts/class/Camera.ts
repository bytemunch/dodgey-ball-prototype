import { game } from "../main.js";
import { GameObject } from "./GameObject.js";

export class Camera {
    cnv: HTMLCanvasElement;

    perspective: number;
    projectionCx: number;
    projectionCy: number;

    camZ;

    sr;

    constructor(cnv: HTMLCanvasElement) {
        this.cnv = cnv;
    }

    update(sr) {
        // TODO hardcoded! bad!
        this.perspective = (568) * 0.8;
        this.projectionCx = (568 / 2) * sr;
        this.projectionCy = (320 / 4) * sr;
        this.camZ = 320;

        this.sr = sr;
    }

    project(o: GameObject) {
        o.projectedScale = (this.perspective / (this.perspective + o.z + this.camZ + o.depth / 2)) * this.sr;
        o.projectedX = ((o.x * o.projectedScale) + this.projectionCx);
        o.projectedY = ((o.y * o.projectedScale) + this.projectionCy);
    }

    vProject(vector: vec3) {
        const projScale = (this.perspective / (this.perspective + vector[2] + this.camZ)) * this.sr;
        return {
            size: projScale,
            x: (vector[0] * projScale + this.projectionCx),
            y: (vector[1] * projScale + this.projectionCy)
        }
    }
}