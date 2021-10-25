import { game } from "../main.js";
import { FullscreenMenu } from "./FullscreenMenu.js";

export class ControllerScreen extends FullscreenMenu {
    tempID = 'controller';

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

