import { DodgeyBall } from "./class/DodgeyBall.js";

// CustomElement imports for side-effect registration
import './elements/AudioToggle.js';

export let game: DodgeyBall;

window.addEventListener('DOMContentLoaded', () => {
    game = new DodgeyBall;

    game.postInit();
});