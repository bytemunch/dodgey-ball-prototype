import { Game } from "./class/Game.js";

export let game: Game;

import { vec3 } from './lib/gl-matrix/index.js'


window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded!');

    game = new Game;

    game.postInit();

    console.log('Game loaded:', game);

    console.log(vec3.dist(vec3.fromValues(0, 0, 0), vec3.fromValues(10, 10, 10)));
});