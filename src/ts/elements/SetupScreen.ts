import { game } from "../main.js";
import { FullscreenMenu } from "./FullscreenMenu.js";

export class SetupScreen extends FullscreenMenu {
    tempID = 'setup';

    gamepadDirections = {
        'back': {up:'play',down:'setup-score-lower',left:'setup-score-higher',right:'setup-score-lower'},
        'setup-score-lower': {up:'back',down:'setup-time-lower',left:'setup-score-higher',right:'setup-input-score'},
        'setup-input-score': {up:'back',down:'setup-input-time',left:'setup-score-lower',right:'setup-score-higher'},
        'setup-score-higher': {up:'back',down:'setup-time-higher',left:'setup-input-score',right:'setup-score-lower'},
        'setup-time-lower': {up:'setup-score-lower',down:'play',left:'setup-time-higher',right:'setup-input-time'},
        'setup-input-time': {up:'setup-input-score',down:'play',left:'setup-time-lower',right:'setup-time-higher'},
        'setup-time-higher': {up:'setup-score-higher',down:'play',left:'setup-input-time',right:'setup-time-lower'},
        'play': {up:'setup-input-time',down:'back',left:'',right:''},
    }

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
        game.screenMgr.open('play');
    }

    backButtonPressed() {
        game.screenMgr.back();
    }
}

customElements.define('ce-setup-screen', SetupScreen);

