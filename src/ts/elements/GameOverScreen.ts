import { FullscreenMenu } from "./FullscreenMenu.js";
import { SetupScreen } from "./SetupScreen.js";

export class GameOverScreen extends FullscreenMenu {
    tempID = 'gameover';
    txt;

    constructor(txt) {
        super();
        this.txt = txt;
    }

    connectedCallback() {
        super.connectedCallback();

        this.shadowRoot.querySelector('h2').textContent = this.txt;

        this.shadowRoot.querySelector('#continue').addEventListener('click', () => this.doneButtonPressed())
    }

    doneButtonPressed() {
        this.parentElement.appendChild(new SetupScreen);
        this.parentElement.removeChild(this);
    }
}

customElements.define('ce-gameover-screen', GameOverScreen);

