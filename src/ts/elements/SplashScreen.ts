import { ControllerScreen } from "./ControllerScreen.js";
import { FullscreenMenu } from "./FullscreenMenu.js";

export class SplashScreen extends FullscreenMenu {
    tempID = 'splash';

    connectedCallback() {
        super.connectedCallback();

        // Add interactivity
        this.shadowRoot.querySelector('#play').addEventListener('click',()=>this.playClicked());
        this.shadowRoot.querySelector('#clear-data').addEventListener('click',()=>this.clearDataClicked());
    }

    playClicked() {
        this.parentElement.appendChild(new ControllerScreen);
        this.parentElement.removeChild(this);
    }

    clearDataClicked() {
        console.log('todo: clear data');
    }
}

customElements.define('ce-splash-screen', SplashScreen);