import { CustomElement } from "./CustomElement.js";

// thanks @bolmaster2 https://stackoverflow.com/a/4819886
function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        //@ts-ignore
        (navigator.msMaxTouchPoints > 0));
}

export class ControlSelect extends CustomElement {
    selectedInput: string = 'none';
    forPlayer: number;

    playerIDp: HTMLParagraphElement;
    controllerIDp: HTMLParagraphElement;
    controllerImg: HTMLImageElement;

    get selectedInputId() {
        return this.selectedInput.split('-')[1] || '0';
    }

    get selectedInputType() {
        return this.selectedInput.split('-')[0];
    }

    get selectedInputImg() {
        let fileName = this.selectedInputType;
        switch (this.selectedInputType) {
            case 'none':
                fileName = 'block';
                break;
            default:
                //doNothing();
                break;
        }
        return `img/${fileName}.png`;
    }

    constructor(forPlayer) {
        super();

        this.setAttribute('tabindex','0');
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

    click() {
        let nextInput = 'keyboard';

        switch (this.selectedInputType) {
            case 'none':
                nextInput = 'keyboard';
                break;
            case 'keyboard':
                nextInput = 'touch';
                break;
            case 'touch':
                nextInput = 'none';
                break;
            default:
                break;
        }
        this.setInput(nextInput);
    }

    setInput(input) {
        // input should be string in form type-id
        //  e.g. gamepad-0

        this.selectedInput = input;

        this.update();
    }

    update() {
        this.selectedInput !== 'none' ? this.classList.add('green') : this.classList.remove('green');
        this.controllerIDp.textContent = this.selectedInputType;
        this.controllerImg.src = this.selectedInputImg;
    }
}

customElements.define('control-select', ControlSelect);