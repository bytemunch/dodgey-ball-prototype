import { vec3 } from "../lib/gl-matrix/index.js";
import { game } from "../main.js";

export class InputActionTranslator {
    players: PlayerControls[] = [];
    kb: { [key: string]: boolean } = {};

    kbUsedKeys = ['W', 'A', 'S', 'D', 'F', 'SHIFT', 'Q', 'E', '2', '4', '6', '8', '1', '3', '5', '7', '9'];

    constructor(playerCount = 2) {
        for (let i = 0; i < playerCount; i++) {
            this.players.push({
                direction: vec3.create(),
                target: vec3.create(),
                shoot: false,
                pickup: false,
                sprint: false,
                controller: 'keyboard-0',
                debounceCounter: 0
            });
        }

        // Add key listeners

        window.addEventListener('keydown', e => {
            if (!this.kbUsedKeys.includes(e.key.toUpperCase())) return;
            e.preventDefault();
            this.kb[e.key.toUpperCase()] = true;
        })
        window.addEventListener('keyup', e => {
            if (!this.kbUsedKeys.includes(e.key.toUpperCase())) return;
            e.preventDefault();
            this.kb[e.key.toUpperCase()] = false;
        })
    }

    update(t) {
        // 60hz
        game.gamepadMgr.refreshStates();

        for (let playerID = 0; playerID < this.players.length; playerID++) {
            // >=120hz
            this.reset(playerID);

            this.players[playerID].debounceCounter--;
            // Get inputs from control scheme
            const splitController = this.players[playerID].controller.split('-');
            const scheme = splitController[0];
            const id = splitController[1] || 0;
            switch (scheme) {
                case 'gamepad':
                    this.translateGamepad(playerID, id);
                    break;
                case 'keyboard':
                    this.translateKeyboard(playerID, id);
                    break;
            }
        }
    }

    reset(playerID) {
        Object.assign(this.players[playerID], {
            direction: vec3.create(),
            // target: vec3.create(), // not resetting target to allow for maintained state over time
            shoot: false,
            pickup: false,
            sprint: false,
        });
    }

    translateGamepad(playerID, gamepadID) {
        const gamepad = game.gamepadMgr.gamepads[gamepadID];

        if (!gamepad) return; // TODO Throw an error here, pause and revert controls, or open control select screen

        this.players[playerID].direction = vec3.fromValues(gamepad.axes[0], 0, -gamepad.axes[1]);

        // targeting
        this.players[playerID].target = vec3.fromValues(
            gamepad.axes[2] > 0.1 ? gamepad.axes[2] : gamepad.axes[2] < -0.1 ? gamepad.axes[2] : 0,
            0,
            gamepad.axes[3] > 0.1 ? gamepad.axes[3] : gamepad.axes[3] < -0.1 ? gamepad.axes[3] : 0
        )

        this.players[playerID].target[2] *= -1;

        // Copy targeting from movement vector
        if (vec3.equals(this.players[playerID].target, [0, 0, 0])) this.players[playerID].target = vec3.clone(this.players[playerID].direction);

        vec3.normalize(this.players[playerID].target, this.players[playerID].target);

        vec3.scale(this.players[playerID].target, this.players[playerID].target, 50);

        this.players[playerID].sprint = gamepad.buttons[4].pressed;

        if (gamepad.buttons[6].pressed || gamepad.buttons[7].pressed) {
            if (this.players[playerID].debounceCounter <= 0) {
                this.players[playerID].debounceCounter = 20;
                this.players[playerID].shoot = true;
                this.players[playerID].pickup = true;
            }
        }
    }

    translateKeyboard(playerID, kbID) {
        if (this.kb['W']) this.players[playerID].direction[2] = 1;
        if (this.kb['S']) this.players[playerID].direction[2] = -1;
        if (this.kb['A']) this.players[playerID].direction[0] = -1;
        if (this.kb['D']) this.players[playerID].direction[0] = 1;

        // Rotate vector around a circle
        if (this.kb['Q']) { vec3.rotateY(this.players[playerID].target, this.players[playerID].target, [0, 0, 0], -0.1) };
        if (this.kb['E']) { vec3.rotateY(this.players[playerID].target, this.players[playerID].target, [0, 0, 0], 0.1) };

        if (this.kb['1']) this.players[playerID].target = vec3.fromValues(-1, 0, -1);
        if (this.kb['2']) this.players[playerID].target = vec3.fromValues(0, 0, -1);
        if (this.kb['3']) this.players[playerID].target = vec3.fromValues(1, 0, -1);

        if (this.kb['4']) this.players[playerID].target = vec3.fromValues(-1, 0, 0);
        if (this.kb['6']) this.players[playerID].target = vec3.fromValues(1, 0, 0);

        if (this.kb['7']) this.players[playerID].target = vec3.fromValues(-1, 0, 1);
        if (this.kb['8']) this.players[playerID].target = vec3.fromValues(0, 0, 1);
        if (this.kb['9']) this.players[playerID].target = vec3.fromValues(1, 0, 1);

        // Copy targeting from movement vector
        if (vec3.equals(this.players[playerID].target, [0, 0, 0])) this.players[playerID].target = vec3.clone(this.players[playerID].direction);
        vec3.normalize(this.players[playerID].target, this.players[playerID].target);
        vec3.scale(this.players[playerID].target, this.players[playerID].target, 50);

        if (this.kb['SHIFT']) this.players[playerID].sprint = true;

        if (this.kb['F'] || this.kb['5']) {
            if (this.players[playerID].debounceCounter <= 0) {
                this.players[playerID].debounceCounter = 20;
                this.players[playerID].shoot = true;
                this.players[playerID].pickup = true;
            }
        }
    }

}

interface PlayerControls {
    direction: vec3,
    target: vec3,
    shoot: boolean,
    pickup: boolean,
    sprint: boolean,
    remap?: string,
    controller: string,
    debounceCounter: number
}