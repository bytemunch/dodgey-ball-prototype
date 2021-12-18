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
    selectedInput: string = 'none';
    forPlayer: number;

    playerIDp: HTMLParagraphElement;
    controllerIDp: HTMLParagraphElement;
    controllerImg: HTMLImageElement;
    characterImg: HTMLImageElement;

    characterNextButton: HTMLButtonElement;
    characterPrevButton: HTMLButtonElement;

    selectedCharacter: number = 1;

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

        this.setAttribute('tabindex', '0');
        this.forPlayer = forPlayer;

        this.selectedCharacter = forPlayer + 1;

        this.playerIDp = document.createElement('p');
        this.playerIDp.textContent = 'Player ' + (forPlayer + 1);
        this.playerIDp.id = 'player-number';
        this.shadowRoot.appendChild(this.playerIDp);


        this.controllerIDp = document.createElement('p');
        this.controllerIDp.textContent = 'CONTROLLER_ID';
        this.controllerIDp.id = 'controller-id';
        this.shadowRoot.appendChild(this.controllerIDp);

        this.controllerImg = document.createElement('img');
        this.controllerImg.id = 'controller-image';
        this.shadowRoot.appendChild(this.controllerImg);

        const br = document.createElement('br');
        this.shadowRoot.appendChild(br);

        this.characterPrevButton = document.createElement('button');
        this.characterPrevButton.id = 'btn-char-prev';
        this.shadowRoot.appendChild(this.characterPrevButton);

        this.characterImg = document.createElement('img');
        this.characterImg.id = 'character-image';
        this.shadowRoot.appendChild(this.characterImg);

        this.characterNextButton = document.createElement('button');
        this.characterNextButton.id = 'btn-char-next';
        this.shadowRoot.appendChild(this.characterNextButton);

        this.update();

        //TODO DRY
        this.characterNextButton.addEventListener('click', e => {
            e.stopPropagation();
            this.nextCharacter(1);
        });

        this.characterPrevButton.addEventListener('click', e => {
            e.stopPropagation();
            this.nextCharacter(-1);
        });

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

    nextCharacter(dir = 1) {
        const maxChars = 4;
        let nextChar = this.selectedCharacter + dir;
        if (nextChar <= 0) nextChar = maxChars;
        if (nextChar > maxChars) nextChar = 1;

        this.selectedCharacter = nextChar;
        this.update();
    }

    update() {
        this.style.backgroundColor = 'grey';

        if (this.selectedInput !== 'none') {
            // TODO pastel these colours down a LOT
            // players 0indexed
            let color = '#F4889A';
            switch (this.forPlayer) {
                case 1:
                    color = '#31BFF3';
                    break;
                case 2:
                    color = '#c6bb71';
                    break;
                case 3:
                    color = '#79D45E';
                    break;
            }

            this.style.backgroundColor = color;
        }

        const controllerNameManifest = {
            "Xbox 360 Controller (XInput STANDARD GAMEPAD)": "Xbox Controller",
            "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)": "PS4 Controller",
            "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)": "PS4 Controller",
            "054c-09cc-Wireless Controller": "PS4 Controller",
            "054c-05c4-Wireless Controller": "PS4 Controller",
            "PLAYSTATION(R)3 Controller (Vendor: 054c Product: 0268)": "PS3 Controller",
            "PS3 GamePad (Vendor: 054c Product: 0268)": "PS3 Controller",
            "Pro Controller (STANDARD GAMEPAD Vendor: 057e Product: 2009)":"Switch Pro Controller",
        }

        // TODO analytics ping if unknown controller
        this.controllerIDp.textContent = this.selectedInputType == 'gamepad' ? controllerNameManifest[game.gamepadMgr.gamepads[this.selectedInputId].id] || 'Unknown Controller' : this.selectedInputType;
        this.controllerImg.src = this.selectedInputImg;
        this.characterImg.src = `img/characters/char${this.selectedCharacter}-placeholder.png`;
    }
}

customElements.define('control-select', ControlSelect);