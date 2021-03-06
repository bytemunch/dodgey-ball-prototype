import { ControllerScreen } from "../elements/ControllerScreen.js";
import { AudioManager } from "./AudioManager.js";
import { Camera } from "./Camera.js";
import { CameraXY } from "./CameraXY.js";
import { GameObject } from "./GameObject.js";
import { GamepadManager } from "./GamepadManager.js";
import { InputActionTranslator } from "./InputActionTranslator.js";
import { ScreenManager } from "./ScreenManager.js";
import { UIObject } from "./UIObject.js";

export class Game {
    loading: boolean;

    // Main canvas
    cnv: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    // cameras
    camera: Camera;
    cameraXY: CameraXY;

    // Interface Canvas
    iCnv: HTMLCanvasElement;
    iCtx: CanvasRenderingContext2D;

    // DOM stuff
    touchTarget: HTMLDivElement;
    containerDiv: HTMLDivElement;
    containerBB: DOMRect;

    // Timing
    timeFactor: number = 0;
    prevFrameTime = 0;
    timestep = 0;
    deltaTime = 0;
    framecount = 0;

    sizeRatio = 0;

    loopHandle;

    audioMgr: AudioManager;
    gamepadMgr: GamepadManager;
    screenMgr: ScreenManager;

    // Input
    iAT: InputActionTranslator;

    // Game stuff
    playfield: { x: number, y: number, z: number, width: number, height: number, depth: number, floor: number };

    gameObjects: GameObject[];
    uiObjects: UIObject[];

    paused: boolean = true;

    constructor() {
        // Grab DOM
        this.containerDiv = document.querySelector('#main-game');
        this.touchTarget = document.querySelector('#touch-target');

        // Create canvases
        this.createCanvas();

        // Append canvases to document in #main-game
        this.containerDiv.appendChild(this.cnv);
        this.containerDiv.appendChild(this.iCnv);

        // setup vars
        this.gameObjects = [];
        this.uiObjects = [];

        this.audioMgr = new AudioManager;
        this.gamepadMgr = new GamepadManager;

        // Add listeners
        // resize canvas on window resize
        window.addEventListener('resize', e => {
            // TODO this fires too often, debounce.
            this.onResize();
        })
    }

    postInit() {
        this.loadData();

        // init cameras
        this.camera = new Camera(this.cnv);
        this.cameraXY = new CameraXY(this.cnv);

        // setup initial canvas sizes
        this.onResize();

        this.screenMgr = new ScreenManager;
        this.screenMgr.init();

        this.iAT = new InputActionTranslator(2);

        // begin main loop
        this.loopHandle = requestAnimationFrame(this.loop.bind(this));
    }

    createCanvas() {
        this.cnv = document.createElement('canvas');
        this.cnv.id = 'game-canvas';

        this.ctx = this.cnv.getContext('2d');

        this.iCnv = document.createElement('canvas');
        this.iCnv.id = 'interface-canvas';

        this.iCtx = this.iCnv.getContext('2d');
    }

    onResize() {
        this.containerBB = this.containerDiv.getBoundingClientRect();

        this.iCnv.width = this.containerBB.width;
        this.iCnv.height = this.containerBB.height;

        this.cnv.width = this.containerBB.width;
        this.cnv.height = this.containerBB.height;

        // Get ratio to resize objects by
        this.sizeRatio = this.containerBB.width / this.playfield.width;

        this.camera.update(this.sizeRatio);
        this.cameraXY.update(this.sizeRatio);
    }

    // SAVE/LOAD
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
        } else {
            this.clearData();
        }
    }

    // BUTTONS
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
        //TODO go to splash screen
    }

    async btnPlay() {
        await this.audioMgr.init();
    }

    btnResume() {
        this.unpause();
    }

    pause() {
        this.audioMgr.play('click');

        this.paused = true;

        this.timeFactor = 0;

    }

    unpause() {
        this.audioMgr.play('click');

        this.timeFactor = 1;

        this.paused = false;
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
        return [...this.gameObjects, ...this.uiObjects]
    }

    async loop(t: DOMHighResTimeStamp) {
        // timings
        this.framecount++;
        this.deltaTime = (t - this.prevFrameTime) / 20;
        this.timestep = this.deltaTime * this.timeFactor;
        this.prevFrameTime = t;

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.iAT.update(t);

        // Removal
        for (let i = this.gameObjects.length - 1; i > 0; i--) {
            if (this.gameObjects[i].toBeRemoved == true) this.gameObjects.splice(i, 1);
        }

        this.gameLoop(t);

        requestAnimationFrame(this.loop.bind(this));
    }

    gameLoop(t: DOMHighResTimeStamp) {
        // This is where game logic go
    }
}