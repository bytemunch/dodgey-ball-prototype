import { game } from "../main.js";
import { FullscreenMenu } from "./FullscreenMenu.js";

export class PauseScreen extends FullscreenMenu {
    tempID = 'pause';

    gamepadDirections = {
        'resume': { up: 'save-quit', down: 'save-quit',left: 'audio-toggle', right: 'audio-toggle' },
        'save-quit': { up: 'resume', down: 'resume', left: 'audio-toggle', right: 'audio-toggle'},
        'audio-toggle': { up: 'resume', down: 'save-quit', left: 'save-quit', right: 'save-quit'},
    }

    connectedCallback() {
        super.connectedCallback();

        this.shadowRoot.querySelector('#resume').addEventListener('click', () => this.resumeButtonPressed())
        this.shadowRoot.querySelector('#save-quit').addEventListener('click', () => this.quitButtonPressed())
    }

    resumeButtonPressed() {
        game.unpause();
        history.forward();
    }

    quitButtonPressed() {
        game.screenMgr.open('setup');
    }
}

customElements.define('ce-pause-screen', PauseScreen);

