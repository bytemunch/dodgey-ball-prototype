import { CustomElement } from "./CustomElement.js";

export class TouchAction extends CustomElement {
    pressed: boolean;

    constructor() {
        super();

        this.addEventListener('mousedown', this.mouseDown);
        this.addEventListener('touchstart', this.mouseDown);
        this.addEventListener('mouseup', this.mouseUp);
        this.addEventListener('touchend', this.mouseUp);
    }

    mouseDown() {
        this.pressed = true;
        this.classList.add('pressed');
    }

    mouseUp() {
        this.pressed = false;
        this.classList.remove('pressed');
    }
}

customElements.define('ce-touch-action', TouchAction);