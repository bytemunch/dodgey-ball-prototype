import { AudioManager } from "./AudioManager.js";
import { GameObject } from "./GameObject.js";
import { GamepadManager } from "./GamepadManager.js";
import { MouseTouchManager } from "./MouseTouchManager.js";
import { TestPlayer } from "./TestPlayer.js";

export class Game {
    loading: boolean;

    // Main canvas
    cnv: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    // Interface Canvas
    iCnv: HTMLCanvasElement;
    iCtx: CanvasRenderingContext2D;

    // DOM stuff
    touchTarget: HTMLDivElement;
    containerDiv: HTMLDivElement;
    containerBB: DOMRect;
    pauseMenu: HTMLDivElement;
    splashScreen: HTMLDivElement;

    naturalGameBB: { x: number, y: number, width: number, height: number };

    // Timing
    timeFactor: number = 0;
    prevFrameTime = 0;
    timestep = 0;
    deltaTime = 0;
    framecount = 0;

    sizeRatio = 0;

    loopHandle;

    audioMgr: AudioManager;
    mouseTouchMgr: MouseTouchManager;
    gamepadMgr: GamepadManager;

    // Game stuff
    gameObjects: GameObject[];

    constructor() {
        this.naturalGameBB = {
            x: 0,
            y: 0,
            width: 568,
            height: 320
        }

        // Grab DOM
        this.containerDiv = document.querySelector('#main-game');
        this.touchTarget = document.querySelector('#touch-target');
        this.pauseMenu = document.querySelector('#pause-menu');
        this.splashScreen = document.querySelector('#splash');

        // Create canvases
        this.cnv = document.createElement('canvas');
        this.cnv.id = 'game-canvas';

        this.ctx = this.cnv.getContext('2d');

        this.iCnv = document.createElement('canvas');
        this.iCnv.id = 'interface-canvas';

        this.iCtx = this.iCnv.getContext('2d');

        // setup initial canvas sizes
        this.onResize();

        // Append canvases to document in #main-game
        this.containerDiv.appendChild(this.cnv);
        this.containerDiv.appendChild(this.iCnv);

        // resize canvas on window resize
        window.addEventListener('resize', e => {
            this.onResize();
        })

        // setup vars
        this.gameObjects = [];

        // Add button listeners
        this.pauseMenu.querySelector('#resume').addEventListener('click', this.btnResume.bind(this));
        this.pauseMenu.querySelector('#save-quit').addEventListener('click', this.btnSaveQuit.bind(this));
        this.splashScreen.querySelector('#play').addEventListener('click', this.btnPlay.bind(this));
        this.splashScreen.querySelector('#clear-data').addEventListener('click', this.btnClearData.bind(this));
        this.containerDiv.querySelectorAll('.audio-toggle').forEach(e => e.addEventListener('click', this.btnToggleAudio.bind(this)));

        this.audioMgr = new AudioManager;

        this.mouseTouchMgr = new MouseTouchManager(this.touchTarget);

        this.gamepadMgr = new GamepadManager;
    }

    // Resizing functions
    // NOTE only resize objects on DRAW not on creation
    //  to keep the physics the same across screen sizes
    rs(n) {
        return n * this.sizeRatio;
    }
    rs2(n) {
        return n / this.sizeRatio;
    }

    postInit() {
        this.loadData();

        // begin main loop
        this.loopHandle = requestAnimationFrame(this.loop.bind(this));
    }

    onResize() {
        this.containerBB = this.containerDiv.getBoundingClientRect();

        this.iCnv.width = this.containerBB.width;
        this.iCnv.height = this.containerBB.height;

        this.cnv.width = this.containerBB.width;
        this.cnv.height = this.containerBB.height;

        // Get ratio to resize objects by
        this.sizeRatio = this.containerBB.width / this.naturalGameBB.width;

    }

    clearData() {
        const emptySaveData = {
            'empty': 'save'
        };

        localStorage.setItem('save-data', JSON.stringify(emptySaveData));

        this.loadData();
    }

    saveData() {
        const saveData = {
            'empty': 'save'
        }

        localStorage.setItem('save-data', JSON.stringify(saveData));
    }

    loadData() {
        const data = JSON.parse(localStorage.getItem('save-data'));

        if (data) {
            this.loadTestLevel();
        } else {
            this.clearData();
        }
    }

    btnToggleAudio() {
        if (this.audioMgr.muted) {
            document.querySelectorAll('.audio-toggle').forEach(e => e.classList.remove('disabled'));
            this.audioMgr.muted = false;
        } else {
            document.querySelectorAll('.audio-toggle').forEach(e => e.classList.add('disabled'));
            this.audioMgr.muted = true;
        }
    }

    btnClearData() {
        this.audioMgr.play('click');

        this.clearData();
        console.log('data cleared!');
    }

    btnSaveQuit() {
        this.audioMgr.play('click');

        this.saveData();
        console.log('saved, now quit.');
        this.splashScreen.style.display = 'block';
        this.pauseMenu.style.display = 'none';
    }

    async btnPlay() {
        this.splashScreen.style.display = 'none';
        await this.audioMgr.init();
        this.unpause();
    }

    btnResume() {
        this.unpause();
    }

    pause() {
        this.audioMgr.play('click');

        // Decrease timestep to 0
        const decreaseTimeFactor = () => {
            this.timeFactor = 0;
        }

        decreaseTimeFactor();

        // TODO fadein pause menu
        this.pauseMenu.style.display = 'block';
    }

    unpause() {
        this.audioMgr.play('click');

        // TODO fadeout pause menu
        this.pauseMenu.style.display = 'none';

        // increase timestep to 1
        const increaseTimeFactor = () => {
            this.timeFactor = 1;
        }
        increaseTimeFactor();
    }

    async advert() {
        let countdown = 5;

        const adDiv = this.containerDiv.querySelector('#advert') as HTMLDivElement;
        const adTxt = adDiv.querySelector('#countdown') as HTMLParagraphElement;

        // TODO load ad here...

        adDiv.style.display = 'block';

        this.audioMgr.play('click');

        let adProm = new Promise((res) => {
            let ivl = setInterval(() => { countdown--; adTxt.textContent = `Skipping in ${countdown}...`; if (countdown <= 0) { clearInterval(ivl); res(1) } }, 1000);
        });

        await adProm;

        adDiv.style.display = 'none';

        adTxt.textContent = `Skipping in 5...`;

        return;
    }

    get allObjects() {
        return [...this.gameObjects]
    }

    loadTestLevel() {
        this.gameObjects = [
            new TestPlayer({ x: 100, y: 100 })
        ];
    }

    async loop(t: DOMHighResTimeStamp) {
        // timings
        this.framecount++;
        this.deltaTime = (t - this.prevFrameTime) / 20;
        this.timestep = this.deltaTime * this.timeFactor;
        this.prevFrameTime = t;

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.iCtx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Gamepad Input
        this.gamepadMgr.refreshStates();

        if (this.gamepadMgr.gamepads[0]) {
            for (let b of this.gamepadMgr.gamepads[0].buttons) {
                if (b.value) console.log('Button %d pressed!', this.gamepadMgr.gamepads[0].buttons.indexOf(b));
            }
        }

        // update everything
        for (let o of this.allObjects) {
            o.update();
        }

        // update everything
        for (let o of this.allObjects) {
            o.draw(this.ctx);
        }

        requestAnimationFrame(this.loop.bind(this));
    }
}