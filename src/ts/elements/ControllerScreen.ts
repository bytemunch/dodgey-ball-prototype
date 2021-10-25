import { game } from "../main.js";
import { FullscreenMenu } from "./FullscreenMenu.js";

export class ControllerScreen extends FullscreenMenu {
    tempID = 'controller';

    gamepadDirections = {
        'controller-1': {up: 'back', down: 'done', left: 'controller-2', right: 'controller-2'},
        'controller-2': {up: 'back', down: 'done', left: 'controller-1', right: 'controller-1'},
        'back': {up: 'done', down: 'controller-1', left: '', right: ''},
        'done': {up: 'controller-1', down: 'back', left: '', right: ''},
    }

    connectedCallback() {
        super.connectedCallback();

        this.shadowRoot.querySelector('#done').addEventListener('click', () => this.doneButtonPressed())
        this.shadowRoot.querySelector('#back').addEventListener('click', () => this.backButtonPressed())
    }

    doneButtonPressed() {
        console.log('todo: the controller setting up stuff');

        game.screenMgr.open('setup');
    }

    backButtonPressed() {
        game.screenMgr.back();
    }
}

customElements.define('ce-controller-screen', ControllerScreen);

