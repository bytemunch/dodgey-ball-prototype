import { CustomElement } from "./CustomElement.js";
// Stub to inject shared CSS
export class FullscreenMenu extends CustomElement {

    connectedCallback() {
        super.connectedCallback();
        this.classList.add('fs-menu');
    }
};