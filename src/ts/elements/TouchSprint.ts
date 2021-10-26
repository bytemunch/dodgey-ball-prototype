import { CustomElement } from "./CustomElement.js";

export class TouchSprint extends CustomElement {
    toggle: boolean;

    constructor() {
        super();

        this.addEventListener('click', this.click);
    }

    click() {
        if (this.toggle) {
            this.toggle = false;
            this.classList.remove('toggle');
        } else {
            this.toggle = true;
            this.classList.add('toggle');
        }
    }
}

customElements.define('ce-touch-sprint', TouchSprint);