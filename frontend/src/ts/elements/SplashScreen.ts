import { game } from "../main.js";
import { FullscreenMenu } from "./FullscreenMenu.js";

export class SplashScreen extends FullscreenMenu {
    tempID = 'splash';

    gamepadDirections = {
        'play': { up: 'clear-data', down: 'clear-data', left: '', right: '' },
        'clear-data': { up: 'play', down: 'play', left: 'audio-toggle', right: 'audio-toggle' },
        'audio-toggle': { up: 'play', down: 'play', left: 'clear-data', right: 'clear-data' },
    }

    connectedCallback() {
        super.connectedCallback();

        // Add interactivity
        this.shadowRoot.querySelector('#play').addEventListener('click', () => this.playClicked());
        this.shadowRoot.querySelector('#clear-data').addEventListener('click', () => this.clearDataClicked());
    }

    playClicked() {
        game.screenMgr.open('controller');
    }

    clearDataClicked() {
        console.log('todo: clear data');
    }
}

customElements.define('ce-splash-screen', SplashScreen);