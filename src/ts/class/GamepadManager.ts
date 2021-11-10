// Axes
//   0: left stick X
//   1: left stick Y
//   2: right stick X
//   3: right stick y


export class GamepadManager {
    gamepads: Gamepad[] = [];

    constructor() {
        console.log('Ready for gamepad...');

        window.addEventListener('gamepadconnected', this.connect.bind(this));
        window.addEventListener('gamepaddisconnected', this.disconnect.bind(this));
    }

    // called on gamepadconnected
    connect(e: GamepadEvent) {
        console.log('Gamepad %s connected!', e.gamepad.index);
    }

    // called on gamepaddisconnected
    disconnect(e: GamepadEvent) {
        console.log('Gamepad %s disconnected!', e.gamepad.index);
    }

    refreshStates() {
        // make spec compliant
        this.gamepads = [...navigator.getGamepads()].filter(Boolean); // Cheers HTTP203
    }
}