import { ControllerScreen } from "../elements/ControllerScreen.js";
import { FullscreenMenu } from "../elements/FullscreenMenu.js";
import { GameOverScreen } from "../elements/GameOverScreen.js";
import { PauseScreen } from "../elements/PauseScreen.js";
import { SetupScreen } from "../elements/SetupScreen.js";
import { SplashScreen } from "../elements/SplashScreen.js";
import { game } from "../main.js";

export class ScreenManager {
    screens: { [screenID: string]: FullscreenMenu } = {
        setup: new SetupScreen,
        pause: new PauseScreen,
        gameover: new GameOverScreen,
        splash: new SplashScreen,
        controller: new ControllerScreen,
    }

    currentPage: string;

    constructor() {
        window.addEventListener('hashchange', e => {
            e.preventDefault();
            this.openScreen(location.hash.replace('#', ''));
        })
    }

    init() {
        for (let s in this.screens) {
            game.containerDiv.appendChild(this.screens[s]);
        }
        this.closeAll();

        this.openScreen(location.hash.replace('#',''));
    }

    gameOver(txt) {
        (<GameOverScreen>this.screens.gameover).txt = txt;
        this.open('gameover');
    }

    open(screenID) {
        location.hash = screenID;
    }

    private openScreen(screenID) {
        this.closeAll();
        this.screens[screenID].show();
        this.currentPage = screenID;
    }

    closeAll() {
        // close all screens
        for (let s in this.screens) {
            this.screens[s].hide();
        }
    }

    back() {
        let prev;
        // Splash -> Controller -> Setup -> Gameplay -> GameOver
        switch (this.currentPage) {
            case 'splash':
                console.log('back to where?');
                prev = 'splash';
                break;
            case 'controller':
                prev = 'splash'
                break;
            case 'setup':
                prev = 'controller';
                break;
            case 'gameover':
                prev = 'setup';
                break;
            default:
                prev = 'splash'
        }

        //TODO may cause history loop?
        this.open(prev);
    }
}