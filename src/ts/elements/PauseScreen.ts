import { FullscreenMenu } from "./FullscreenMenu.js";

export class PauseScreen extends FullscreenMenu {
    tempID = 'pause';

    connectedCallback() {
        super.connectedCallback();

        this.shadowRoot.querySelector('#resume').addEventListener('click', () => this.resumeButtonPressed())
        this.shadowRoot.querySelector('#save-quit').addEventListener('click', () => this.quitButtonPressed())
    }

    resumeButtonPressed() {
        console.log('todo: carry on');
    }

    quitButtonPressed() {
        console.log('todo: back to setup screen');
    }
}

customElements.define('ce-pause-screen', PauseScreen);

