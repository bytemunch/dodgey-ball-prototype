import { game } from "../main.js";
import { CustomElement } from "./CustomElement.js";

export class AudioToggle extends CustomElement {
    constructor() {
        super();
        this.addEventListener('click', () => this.click());

        this.setAttribute('tabindex', '0');
    }

    click() {
        if (game.audioMgr.muted) {
            game.audioMgr.muted = false;
            this.classList.remove('disabled');
            game.audioMgr.play('click');
        } else {
            game.audioMgr.muted = true;
            this.classList.add('disabled');
        }
    }

    connectedCallback() {
        super.connectedCallback();

        if (game.audioMgr.muted) {
            this.classList.add('disabled');
        } else {
            this.classList.remove('disabled');
        }
    }
}

customElements.define('ce-audio-toggle', AudioToggle);