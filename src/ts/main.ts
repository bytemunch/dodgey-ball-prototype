import { Game } from "./class/Game.js";

export let game: Game;

import './lib/gl-matrix.js';
import * as glm from './lib/gl-matrix.js';

declare const glMatrix:typeof glm;

export const vec3 = glMatrix.vec3;
export const vec2 = glMatrix.vec2;

window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded!');

    game = new Game;

    game.postInit();

    console.log('Game loaded:', game);

    console.log(vec3.dist(vec3.fromValues(0, 0, 0), vec3.fromValues(10, 10, 10)));
});