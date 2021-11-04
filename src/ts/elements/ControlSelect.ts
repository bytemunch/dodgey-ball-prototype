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

    get selectedInput() {
        return this.availableInputDevices[this.currentlySelected];
    }

    constructor(forPlayer) {
        super();
        this.forPlayer = forPlayer;

        this.playerIDp = document.createElement('p');
        this.playerIDp.textContent = 'Player ' + (forPlayer+1);
        this.shadowRoot.appendChild(this.playerIDp);


        this.controllerIDp = document.createElement('p');
        this.controllerIDp.textContent = 'CONTROLLER_ID';
        this.shadowRoot.appendChild(this.controllerIDp);

        this.controllerImg = document.createElement('img');
        this.shadowRoot.appendChild(this.controllerImg);

        this.update();

        this.addEventListener('click', () => this.click())
    }

    get availableInputDevices() {
        let inputs = ['block'];
        inputs.push(isTouchDevice() ? 'touch' : 'keyboard');
        // DEBUG
        inputs.push(isTouchDevice() ? 'keyboard' : 'touch');
        for (let pad in game.gamepadMgr.gamepads) {
            if (pad != 'item' && pad != 'length' && game.gamepadMgr.gamepads[pad] != null) inputs.push('gamepad-' + pad);
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
        this.controllerIDp.textContent = this.availableInputDevices[this.currentlySelected];
        this.controllerImg.src = `img/${this.availableInputDevices[this.currentlySelected].split('-')[0]}.png`;
    }
}

customElements.define('control-select', ControlSelect);