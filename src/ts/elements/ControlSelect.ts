import { game } from "../main.js";
import { CustomElement } from "./CustomElement.js";

// thanks @bolmaster2 https://stackoverflow.com/a/4819886
function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        //@ts-ignore
        (navigator.msMaxTouchPoints > 0));
}

export class ControlSelect extends CustomElement {
    currentlySelected: number = 0;
    forPlayer: number;

    playerIDp: HTMLParagraphElement;
    controllerIDp: HTMLParagraphElement;
    controllerImg: HTMLImageElement;

    get selectedInput():InputOption {
        return this.availableInputDevices[this.currentlySelected];
    }

    constructor(forPlayer) {
        super();
        this.forPlayer = forPlayer;

        this.playerIDp = document.createElement('p');
        this.playerIDp.textContent = 'Player ' + (forPlayer + 1);
        this.shadowRoot.appendChild(this.playerIDp);


        this.controllerIDp = document.createElement('p');
        this.controllerIDp.textContent = 'CONTROLLER_ID';
        this.shadowRoot.appendChild(this.controllerIDp);

        this.controllerImg = document.createElement('img');
        this.shadowRoot.appendChild(this.controllerImg);

        this.update();

        this.addEventListener('click', () => this.click())
    }

    get availableInputDevices(): InputOption[] {
        let noInput: InputOption = { type: 'none', displayName: 'None', id: 0, img: 'block.png' };
        let touchInput: InputOption = { type: 'touch', displayName: 'Touchscreen', id: 0, img: 'touch.png' };
        let kbInput: InputOption = { type: 'keyboard', displayName: 'Keyboard', id: 0, img: 'keyboard.png' };
        let inputs = [noInput];
        inputs.push(isTouchDevice() ? touchInput : kbInput);
        // DEBUG
        inputs.push(isTouchDevice() ? kbInput : touchInput);
        for (let pad in game.gamepadMgr.gamepads) {
            if (pad != 'item' && pad != 'length' && game.gamepadMgr.gamepads[pad] != null) {
                const padInput: InputOption = { type: 'gamepad', displayName: game.gamepadMgr.gamepads[pad].id, id: Number(pad), img: 'gamepad.png' }
                inputs.push(padInput);
            }
        }
        return inputs;
    }

    click() {
        // Change to next selection in list where selection not taken
        this.currentlySelected = (this.currentlySelected + 1) % this.availableInputDevices.length;
        this.update();
    }

    update() {
        this.currentlySelected ? this.classList.add('green') : this.classList.remove('green');
        this.controllerIDp.textContent = this.availableInputDevices[this.currentlySelected].displayName;
        this.controllerImg.src = `img/${this.availableInputDevices[this.currentlySelected].img}`;
    }
}

export type InputOption = {
    type: string,
    id: number,
    img: string,
    displayName: string
}

customElements.define('control-select', ControlSelect);