import { game } from "../main.js";
import { FullscreenMenu } from "./FullscreenMenu.js";

export class SetupScreen extends FullscreenMenu {
    tempID = 'setup';

    connectedCallback() {
        super.connectedCallback();

        this.shadowRoot.querySelector('#setup-score-higher').addEventListener('click', () => this.modifyScore(1))
        this.shadowRoot.querySelector('#setup-score-lower').addEventListener('click', () => this.modifyScore(-1))
        this.shadowRoot.querySelector('#setup-time-higher').addEventListener('click', () => this.modifyTime(1))
        this.shadowRoot.querySelector('#setup-time-lower').addEventListener('click', () => this.modifyTime(-1))
        this.shadowRoot.querySelector('#play').addEventListener('click', () => this.playButtonPressed())
        this.shadowRoot.querySelector('#back').addEventListener('click', () => this.backButtonPressed())

        // TODO allow hold button
    }

    get scoreInput() {
        return (<HTMLInputElement>this.shadowRoot.querySelector('#setup-input-score'))
    }

    get timeInput() {
        return (<HTMLInputElement>this.shadowRoot.querySelector('#setup-input-time'))
    }

    modifyScore(n) {
        this.scoreInput.value = Number(this.scoreInput.value) + n;
    }

    modifyTime(n) {
        this.timeInput.value = Number(this.timeInput.value) + n;
    }

    playButtonPressed() {
        // Do the start game shitt
        game.setupGame({
            scoreLimit: Number(this.scoreInput.value),
            timeLimit: Number(this.timeInput.value),
        })
        game.unpause();
        game.screenMgr.closeAll();
    }

    backButtonPressed() {
        // game.screenMgr.back();
        // always go back to controller setup cos what if last was gameover?
        game.screenMgr.back();
    }
}

customElements.define('ce-setup-screen', SetupScreen);

