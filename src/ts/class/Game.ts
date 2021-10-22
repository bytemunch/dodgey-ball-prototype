import { vec3 } from "../lib/gl-matrix/index.js";
import { AudioManager } from "./AudioManager.js";
import { Camera } from "./Camera.js";
import { CameraXY } from "./CameraXY.js";
import { GameObject } from "./GameObject.js";
import { GamepadManager } from "./GamepadManager.js";
import { Line } from "./Line.js";
import { MouseTouchManager } from "./MouseTouchManager.js";
import { Player } from "./Player.js";
import { Scoreboard } from "./Scoreboard.js";
import { Sphere } from "./Sphere.js";
import { UIObject } from "./UIObject.js";
import { animationInterval } from "../lib/timer/1.js";
import { Timer } from "./Timer.js";

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

    // Top-Down Canvas
    zCnv: HTMLCanvasElement;
    zCtx: CanvasRenderingContext2D;

    // XY Canvas
    yCnv: HTMLCanvasElement;
    yCtx: CanvasRenderingContext2D;

    // DOM stuff
    touchTarget: HTMLDivElement;
    containerDiv: HTMLDivElement;
    containerBB: DOMRect;
    pauseMenu: HTMLDivElement;
    splashScreen: HTMLDivElement;
    setupScreen: HTMLDivElement;
    gameoverScreen: HTMLDivElement;

    playfield: { x: number, y: number, z: number, width: number, height: number, depth: number, floor: number };

    // Timing
    timeFactor: number = 0;
    prevFrameTime = 0;
    timestep = 0;
    deltaTime = 0;
    framecount = 0;

    sizeRatio = 0;
    zSizeRatio = 0;
    ySizeRatio = 0;

    loopHandle;

    audioMgr: AudioManager;
    mouseTouchMgr: MouseTouchManager;
    gamepadMgr: GamepadManager;

    // Game stuff
    gameObjects: GameObject[];
    uiObjects: UIObject[];

    ballSize = 20;

    gravity: vec3 = vec3.fromValues(0, 0.8, 0);

    inplay: boolean;

    scores = {
        0: 0,
        1: 0
    }

    scoreLimit: number = 0;
    timeLimit: number = Infinity;

    ballsOneSidedSince: number;
    ballOneSidedTimeLimit: number = 5000;

    matchTimerController: AbortController;

    //   multiplied with vel
    airResistance: vec3 = vec3.fromValues(0.9, 1, 0.9);

    constructor() {
        this.playfield = {
            x: -568 / 2,
            y: -320 / 5,
            z: -320 / 2,
            width: 568,
            height: 320,
            depth: 320,
            floor: (-320 / 5) + 320
        }

        // Grab DOM
        this.containerDiv = document.querySelector('#main-game');
        this.touchTarget = document.querySelector('#touch-target');
        this.pauseMenu = document.querySelector('#pause-menu');
        this.splashScreen = document.querySelector('#splash');
        this.gameoverScreen = document.querySelector('#gameover');
        this.setupScreen = document.querySelector('#setup-match');

        // Create canvases
        this.cnv = document.createElement('canvas');
        this.cnv.id = 'game-canvas';

        this.camera = new Camera(this.cnv);
        this.cameraXY = new CameraXY(this.cnv);

        this.ctx = this.cnv.getContext('2d');

        this.iCnv = document.createElement('canvas');
        this.iCnv.id = 'interface-canvas';

        this.iCtx = this.iCnv.getContext('2d');

        this.zCnv = document.createElement('canvas');
        this.zCnv.id = 'topdown-canvas';

        this.zCtx = this.zCnv.getContext('2d');

        this.yCnv = document.createElement('canvas');
        this.yCnv.id = 'xy-canvas';

        this.yCtx = this.yCnv.getContext('2d');

        // setup initial canvas sizes
        this.onResize();

        // Append canvases to document in #main-game
        this.containerDiv.appendChild(this.cnv);
        this.containerDiv.appendChild(this.iCnv);
        this.containerDiv.appendChild(this.zCnv);
        this.containerDiv.appendChild(this.yCnv);

        // resize canvas on window resize
        window.addEventListener('resize', e => {
            this.onResize();
        })

        // setup vars
        this.gameObjects = [];
        this.uiObjects = [];

        // Add button listeners
        this.pauseMenu.querySelector('#resume').addEventListener('click', this.btnResume.bind(this));
        this.pauseMenu.querySelector('#save-quit').addEventListener('click', this.btnSaveQuit.bind(this));
        this.splashScreen.querySelector('#play').addEventListener('click', this.btnPlay.bind(this));
        this.splashScreen.querySelector('#clear-data').addEventListener('click', this.btnClearData.bind(this));
        this.containerDiv.querySelectorAll('.audio-toggle').forEach(e => e.addEventListener('click', this.btnToggleAudio.bind(this)));

        this.setupScreen.querySelector('#setup-done').addEventListener('click', this.btnSetupDone.bind(this));
        this.gameoverScreen.querySelector('#gameover-ok').addEventListener('click', this.btnGameoverOk.bind(this));

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

    rsZ(n) {
        return n * this.zSizeRatio;
    }
    rsZ2(n) {
        return n / this.zSizeRatio;
    }

    rsY(n) {
        return n * this.ySizeRatio;
    }
    rsY2(n) {
        return n / this.ySizeRatio;
    }

    postInit() {
        this.loadData();

        this.addUi();

        // begin main loop
        this.loopHandle = requestAnimationFrame(this.loop.bind(this));
    }

    onResize() {
        this.containerBB = this.containerDiv.getBoundingClientRect();

        this.iCnv.width = this.containerBB.width;
        this.iCnv.height = this.containerBB.height;

        this.cnv.width = this.containerBB.width;
        this.cnv.height = this.containerBB.height;

        this.yCnv.width = this.containerBB.width / 2;
        this.yCnv.height = this.containerBB.height / 2;

        this.zCnv.width = this.containerBB.width / 2;
        this.zCnv.height = this.containerBB.height / 2;

        // Get ratio to resize objects by
        this.sizeRatio = this.containerBB.width / this.playfield.width;
        this.zSizeRatio = (this.containerBB.width / this.playfield.width) / 2;
        this.ySizeRatio = (this.containerBB.width / this.playfield.width) / 2;

        // this.zCtx.translate(this.containerBB.width / 4, this.containerBB.height / 4);
        this.zCtx.translate(
            -this.rsZ(this.playfield.x),
            -this.rsZ(this.playfield.z),
        );
        this.zCtx.transform(1, 0, 0, -1, 0, 0);

        this.yCtx.translate(-this.rsY(this.playfield.x), -this.rsY(this.playfield.y));

        this.camera.update(this.sizeRatio);
        this.cameraXY.update(this.sizeRatio);
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
        this.setupScreen.style.display = 'block';
    }

    btnResume() {
        this.unpause();
    }

    btnSetupDone() {
        this.setupGame({
            scoreLimit: Number((<HTMLInputElement>this.setupScreen.querySelector('#score-limit')).value) || Infinity,
            timeLimit: Number((<HTMLInputElement>this.setupScreen.querySelector('#time-limit')).value) || Infinity
        })

        this.setupScreen.style.display = 'none';
        this.unpause();
    }

    setupGame(gameOptions) {
        this.scoreLimit = gameOptions.scoreLimit;
        this.timeLimit = gameOptions.timeLimit;
        this.resetMatch();
    }

    resetMatch() {
        this.matchTimerController = new AbortController();

        // countdown callback! second timer
        animationInterval(1000, this.matchTimerController.signal, time => {
            this.timeLimit--;
        });

        this.gameObjects = [
            new Player({ x: this.playfield.x, y: this.playfield.floor - 60, z: -30, team: 0 }),
            new Player({ x: this.playfield.x + this.playfield.width, y: this.playfield.floor - 60, z: -30, team: 1 }),
            new Sphere({ x: 0, y: 0, z: 0, r: this.ballSize }),
            new Sphere({ x: 0, y: 0, z: 100, r: this.ballSize }),
            new Sphere({ x: 0, y: 0, z: -100, r: this.ballSize }),
        ];

        this.addCourtLines();

        this.scores = { 0: 0, 1: 0 };

        this.inplay = true;
    }

    btnGameoverOk() {
        this.gameoverScreen.style.display = 'none';
        this.setupScreen.style.display = 'block';
    }

    pause(showMenu: boolean = true) {
        this.audioMgr.play('click');

        // Decrease timestep to 0
        const decreaseTimeFactor = () => {
            this.timeFactor = 0;
        }

        decreaseTimeFactor();

        // TODO fadein pause menu
        if (showMenu) this.pauseMenu.style.display = 'block';
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
        return [...this.gameObjects, ...this.uiObjects]
    }

    addCourtLines() {
        // add playfield boundary lines
        this.gameObjects.push(...[
            new Line(
                [
                    this.playfield.x,
                    this.playfield.y + this.playfield.height,
                    this.playfield.z + this.playfield.depth],
                [
                    this.playfield.x + this.playfield.width,
                    this.playfield.y + this.playfield.height,
                    this.playfield.z + this.playfield.depth
                ]),
            new Line(
                [
                    this.playfield.x,
                    this.playfield.y + this.playfield.height,
                    this.playfield.z + this.playfield.depth],
                [
                    this.playfield.x,
                    this.playfield.y,
                    this.playfield.z + this.playfield.depth
                ]),
            new Line(
                [
                    this.playfield.x + this.playfield.width,
                    this.playfield.y + this.playfield.height,
                    this.playfield.z + this.playfield.depth],
                [
                    this.playfield.x + this.playfield.width,
                    this.playfield.y,
                    this.playfield.z + this.playfield.depth
                ]),
            new Line(
                [
                    this.playfield.x + this.playfield.width,
                    this.playfield.y + this.playfield.height,
                    this.playfield.z + this.playfield.depth],
                [
                    this.playfield.x + this.playfield.width,
                    this.playfield.y + this.playfield.height,
                    this.playfield.z
                ]),
            new Line(
                [
                    this.playfield.x + this.playfield.width,
                    this.playfield.y + this.playfield.height,
                    this.playfield.z],
                [
                    this.playfield.x,
                    this.playfield.y + this.playfield.height,
                    this.playfield.z
                ]
            ),
            new Line(
                [
                    this.playfield.x,
                    this.playfield.y + this.playfield.height,
                    this.playfield.z
                ],
                [
                    this.playfield.x,
                    this.playfield.y + this.playfield.height,
                    this.playfield.z + this.playfield.depth
                ],
            ),
            // half court line
            new Line([this.playfield.x + this.playfield.width / 2, this.playfield.y + this.playfield.height, this.playfield.z],
                [this.playfield.x + this.playfield.width / 2, this.playfield.y + this.playfield.height, this.playfield.z + this.playfield.depth])
        ])

        // floor lines for knowing where ya are in 3D
        const numLines = 20;
        for (let i = 0; i < numLines; i++) {
            this.gameObjects.push(new Line([this.playfield.x, this.playfield.y + this.playfield.height, this.playfield.z + (this.playfield.depth / numLines) * i], [this.playfield.x + this.playfield.width, this.playfield.y + this.playfield.height, this.playfield.z + (this.playfield.depth / numLines) * i], '#FFFFFF69'))
        }
    }

    addUi() {
        this.uiObjects.push(new Scoreboard({ pos: [this.playfield.x + 48, this.playfield.y - 64], team: 0 }));
        this.uiObjects.push(new Scoreboard({ pos: [-1 * (this.playfield.x) - 48 * 2, this.playfield.y - 64], team: 1 }));
        this.uiObjects.push(new Timer({ pos: [(this.playfield.x + this.playfield.width / 2) - 48 / 2, this.playfield.y - 64] }));
    }

    addScore(team, points) {
        this.scores[team] += points;

        if (this.scores[team] >= this.scoreLimit) {
            this.gameOver();
        }
    }

    // TODO dont pass winner here, use score vars
    gameOver() {
        let winner;
        if (this.scores[0] > this.scores[1]) {
            winner = 0;
        }
        if (this.scores[0] > this.scores[1]) {
            winner = 1;
        }
        if (this.scores[0] == this.scores[1]) {
            winner = 2;
        }
        this.inplay = false;
        this.matchTimerController.abort();
        // TEAM WINS
        console.log('TEAM' + winner + ' WINS!');

        this.pause(false);

        if (winner == 2) this.gameoverScreen.querySelector('h3').textContent = `It's a draw!`;
        if (winner) this.gameoverScreen.querySelector('h3').textContent = `${winner ? 'Cyan' : 'Yellow'} Wins!`;
        this.gameoverScreen.style.display = 'block';
    }

    get allBallsLeft() {
        if ((<Player>this.gameObjects.filter(v => v.is == 'player')[0]).hasBall) return false;

        let left = true;
        this.gameObjects.filter(v => v.is == 'sphere').forEach(v => { if (v.x <= this.playfield.x + this.playfield.width / 2) left = false });
        return left;
    }

    get allBallsRight() {
        if ((<Player>this.gameObjects.filter(v => v.is == 'player')[1]).hasBall) return false;

        let right = true;
        this.gameObjects.filter(v => v.is == 'sphere').forEach(v => { if (v.x >= this.playfield.x + this.playfield.width / 2) right = false });
        return right;
    }

    moveAllBallsToSide() {
        let xPos = this.allBallsLeft ? -150 : 150;
        // TODO remove held balls

        this.gameObjects.filter(v => v.is == 'sphere').forEach(v => v.toBeRemoved = true);
        (<Player>this.gameObjects.filter(v => v.is == 'player')[this.allBallsLeft ? 1 : 0]).hasBall = false;

        this.gameObjects.push(
            new Sphere({ x: xPos, y: 0, z: 0, r: this.ballSize }),
            new Sphere({ x: xPos, y: 0, z: 100, r: this.ballSize }),
            new Sphere({ x: xPos, y: 0, z: -100, r: this.ballSize })
        )
    }


    async loop(t: DOMHighResTimeStamp) {
        // timings
        this.framecount++;
        this.deltaTime = (t - this.prevFrameTime) / 20;
        this.timestep = this.deltaTime * this.timeFactor;
        this.prevFrameTime = t;

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.iCtx.clearRect(0, 0, this.iCtx.canvas.width, this.iCtx.canvas.height);

        this.yCtx.clearRect(this.rsY(this.playfield.x), this.rsY(this.playfield.y), this.yCtx.canvas.width, this.yCtx.canvas.height);

        // Clear negative Y vals as we are mirrored
        this.zCtx.clearRect(this.rsZ(this.playfield.x), -this.rsZ(this.playfield.z), this.zCtx.canvas.width, -this.zCtx.canvas.height);

        // Gamepad Input
        this.gamepadMgr.refreshStates();

        if (this.gamepadMgr.gamepads[0]) {
            for (let b of this.gamepadMgr.gamepads[0].buttons) {
                // if (b.value) console.log('Button %d pressed!', this.gamepadMgr.gamepads[0].buttons.indexOf(b));
            }
        }

        // Removal
        for (let i = this.gameObjects.length - 1; i > 0; i--) {
            if (this.gameObjects[i].toBeRemoved == true) this.gameObjects.splice(i, 1);
        }

        // Collision
        for (let s of this.gameObjects.filter(o => o.is == 'sphere')) {
            for (let s2 of this.gameObjects.filter(o => o.is == 'sphere')) {
                (<Sphere>s).collideWithObject(s2);
            }
        }

        // update everything
        for (let o of this.allObjects) {
            o.update();
        }

        // update everything
        for (let o of this.allObjects.sort((a, b) => b.cz - a.cz).sort((a, b) => 0 - Number(a.is == 'line'))) {
            o.draw(this.ctx);

            const cgo = o as GameObject;
            if (cgo.drawXZ) cgo.drawXZ(this.zCtx);
            if (cgo.drawXY) cgo.drawXY(this.yCtx);
        }

        if (this.inplay) {
            if (this.allBallsLeft || this.allBallsRight) {
                if (!this.ballsOneSidedSince) this.ballsOneSidedSince = t;
                if (t > this.ballsOneSidedSince + this.ballOneSidedTimeLimit) {
                    this.ballsOneSidedSince = 0;
                    this.moveAllBallsToSide();
                }
            } else {
                this.ballsOneSidedSince = 0;
            }

            if (this.timeLimit <= 0) {
                this.gameOver();
                this.timeLimit = Infinity;
            }
        }

        requestAnimationFrame(this.loop.bind(this));
    }
}