import { CustomElement } from "./CustomElement.js";
// Stub to inject shared CSS
export class FullscreenMenu extends CustomElement {
    gamepadDirections: { [elementID: string]: { up?: string, down?: string, left?: string, right?: string } };

    constructor() {
        super();

        window.addEventListener('keydown', e => {
            // Don't process menu movements when not onscreen
            if (!this.isCurrentScreen) return;
            console.log(e.key)
            if (e.key == 'ArrowLeft') {
                this.gamepadMove('left');
                e.preventDefault();// hate that i need to do this but hey ho hopefully it stays accessible
            }
            if (e.key == 'ArrowRight') {
                this.gamepadMove('right');
                e.preventDefault();
            }
            if (e.key == 'ArrowUp') {
                this.gamepadMove('up');
                e.preventDefault();
            }
            if (e.key == 'ArrowDown') {
                this.gamepadMove('down');
                e.preventDefault();
            }
            if (e.key == ' ' || e.key == 'Enter') {
                (<HTMLInputElement>this.shadowRoot.activeElement).click();
                e.preventDefault();
            }
        })
    }

    get isCurrentScreen() {
        return this.style.display == 'block';
    }

    connectedCallback() {
        super.connectedCallback();
        this.classList.add('fs-menu');
    }

    show() {
        this.style.display = 'block';
    }

    hide() {
        this.style.display = 'none';
        // Fix focus being stuck when we navigate away
        (<HTMLInputElement>this.shadowRoot.activeElement)?.blur();
    }

    gamepadMove(direction) {        
        // get current focused element
        const focused = this.shadowRoot.activeElement?.id;

        if (!focused) {
            // if none default to first focusable element
            (<HTMLInputElement>this.shadowRoot.querySelector('#' + Object.keys(this.gamepadDirections)[0])).focus();
            return;
        }

        // skip out if there's no element in that direction
        if (!this.gamepadDirections[focused][direction]) return;

        // find next element in direction & focus
        (<HTMLInputElement>this.shadowRoot.querySelector('#' + this.gamepadDirections[focused][direction])).focus();
    }
};