import { game } from "../main.js";
import { ControlSelect } from "./ControlSelect.js";
import { FullscreenMenu } from "./FullscreenMenu.js";

export class ControllerScreen extends FullscreenMenu {
    tempID = 'controller';

    controller1:ControlSelect;
    controller2:ControlSelect;

    gamepadDirections = {
        'controller-1': { up: 'back', down: 'done', left: 'controller-2', right: 'controller-2' },
        'controller-2': { up: 'back', down: 'done', left: 'controller-1', right: 'controller-1' },
        'back': { up: 'done', down: 'controller-1', left: '', right: '' },
        'done': { up: 'controller-1', down: 'back', left: '', right: '' },
    }

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();

        this.controller1 = new ControlSelect(0);
        this.controller1.id = 'controller-1';
        this.shadowRoot.querySelector('#controller-setup').appendChild(this.controller1);

        this.controller2 = new ControlSelect(1);
        this.controller2.id = 'controller-2';
        this.shadowRoot.querySelector('#controller-setup').appendChild(this.controller2);

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

