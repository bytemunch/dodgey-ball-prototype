import { FullscreenMenu } from "./FullscreenMenu.js";
import { SetupScreen } from "./SetupScreen.js";
import { SplashScreen } from "./SplashScreen.js";

export class ControllerScreen extends FullscreenMenu {
    tempID = 'controller';

    connectedCallback() {
        super.connectedCallback();

        this.shadowRoot.querySelector('#done').addEventListener('click', () => this.doneButtonPressed())
        this.shadowRoot.querySelector('#back').addEventListener('click', () => this.backButtonPressed())
    }

    doneButtonPressed() {
        console.log('todo: the controller setting up stuff');

        this.parentElement.appendChild(new SetupScreen);
        this.parentElement.removeChild(this);
    }

    backButtonPressed() {
        // game.pageManager.back();
        this.parentElement.appendChild(new SplashScreen);
        this.parentElement.removeChild(this);
    }
}

customElements.define('ce-controller-screen', ControllerScreen);

