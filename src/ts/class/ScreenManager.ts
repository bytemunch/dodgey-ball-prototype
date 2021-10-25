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

    get currentScreenElement() {
        return this.screens[this.currentPage];
    }
    constructor() {
        window.addEventListener('hashchange', e => {
            e.preventDefault();

            let newHash = location.hash.replace('#', '');

            if (this.currentPage == 'gameover') { newHash = 'setup' }
            if (this.currentPage == 'play' && newHash != 'gameover') { newHash = 'pause'; game.pause() }
            if (this.currentPage == 'setup' && newHash == 'pause') { newHash = 'controller'; }

            // Eliminates doubled entries in history caused by this messing about
            if (this.currentPage == newHash) history.back();

            history.replaceState(null, 'unused', '#' + newHash)

            this.openScreen(newHash);
        });
    }

    init() {
        for (let s in this.screens) {
            game.containerDiv.appendChild(this.screens[s]);
        }
        this.closeAll();

        location.hash = 'splash';
        this.openScreen('splash');
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
        this.currentPage = screenID;
        if (screenID == 'play') return;
        this.screens[screenID].show();
    }

    private closeAll() {
        // close all screens
        for (let s in this.screens) {
            this.screens[s].hide();
        }
    }

    back() {
        let prev;

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
            case 'play':
                game.pause();
                break;
            default:
                prev = 'splash'
        }

        if (prev) this.open(prev);
    }
}