import { game } from "../main.js";
import { FullscreenMenu } from "./FullscreenMenu.js";
import { ControlSelect } from "./ControlSelect.js";

export class ControllerScreen extends FullscreenMenu {
    tempID = 'controller';

    controller1: ControlSelect;
    controller2: ControlSelect;
    controller3: ControlSelect;
    controller4: ControlSelect;

    gamepadDirections = {
        // 'controller-1': { up: 'back', down: 'done', left: 'controller-2', right: 'controller-2' },
        // 'controller-2': { up: 'back', down: 'done', left: 'controller-1', right: 'controller-1' },
        'back': { up: 'done', down: 'done', left: '', right: '' },
        'done': { up: 'back', down: 'back', left: '', right: '' },
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

        this.controller3 = new ControlSelect(2);
        this.controller3.id = 'controller-3';
        this.shadowRoot.querySelector('#controller-setup').appendChild(this.controller3);

        this.controller4 = new ControlSelect(3);
        this.controller4.id = 'controller-4';
        this.shadowRoot.querySelector('#controller-setup').appendChild(this.controller4);

        this.shadowRoot.querySelector('#done').addEventListener('click', () => this.doneButtonPressed())
        this.shadowRoot.querySelector('#back').addEventListener('click', () => this.backButtonPressed())
    }

    testButtonPressed(gamepad) {
        console.log('test button!', gamepad);
        if (gamepad == this.controller1.selectedInputId && this.controller1.selectedInputType == 'gamepad') {
            this.controller1.classList.add('shake');

            //@ts-ignore non-spec vibration shizz
            game.gamepadMgr.gamepads[gamepad].vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 600,
                weakMagnitude: 1,
                strongMagnitude: 1
            })

            setTimeout(() => {
                this.controller1.classList.remove('shake');
            }, 1000);
        }

        if (gamepad == this.controller2.selectedInputId && this.controller2.selectedInputType == 'gamepad') {
            this.controller2.classList.add('shake');

            //@ts-ignore non-spec vibration shizz
            // Thankyou https://gamepad-tester.com/for-developers
            game.gamepadMgr.gamepads[gamepad].vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 600,
                weakMagnitude: 1,
                strongMagnitude: 1
            })
            setTimeout(() => {
                this.controller2.classList.remove('shake');
            }, 1000);
        }
    }

    doneButtonPressed() {
        console.log('todo: the controller setting up stuff');

        game.screenMgr.open('setup');
    }

    backButtonPressed() {
        game.screenMgr.back();
    }

    getNextAvailableInput():ControlSelect {
        if (this.controller1.selectedInput == 'none') return this.controller1;
        if (this.controller2.selectedInput == 'none') return this.controller2;
        if (this.controller3.selectedInput == 'none') return this.controller3;
        if (this.controller4.selectedInput == 'none') return this.controller4;
        return;
    }

    getGamepadConnected(gamepadIndex:number) {
        if (this.controller1.selectedInput == 'gamepad-'+gamepadIndex) return this.controller1;
        if (this.controller2.selectedInput == 'gamepad-'+gamepadIndex) return this.controller2;
        if (this.controller3.selectedInput == 'gamepad-'+gamepadIndex) return this.controller3;
        if (this.controller4.selectedInput == 'gamepad-'+gamepadIndex) return this.controller4;
        return;
    }
}

customElements.define('ce-controller-screen', ControllerScreen);

