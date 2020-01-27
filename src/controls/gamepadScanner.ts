import { EEventT } from "../eEvent";

export class GamepadScanner {
    private gamepadScanner: NodeJS.Timeout | undefined;
    private gamepads: Gamepad[] = [];

    constructor() {
        this.scannedGamepad = new EEventT<Gamepad>();
        this.reset();
    }

    public start() {
        this.gamepadScanner = setInterval(this.scangamepads, 500);
    }

    public stop() {
        if (this.gamepadScanner) {
            clearInterval(this.gamepadScanner);
        }
    }

    public reset() {
        this.gamepads = [];
    }

    private scangamepads = () => {
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (var i = 0; i < gamepads.length; i++) {
            var gamepad = gamepads[i]
            if (gamepad) {
                if (!(gamepad.index in this.gamepads) && gamepad.buttons.length >= 16) {
                    this.gamepads[gamepad.index] = gamepad;
                    this.scannedGamepad.dispatchEvent(gamepad);
                }
            }
        }
    }

    public scannedGamepad: EEventT<Gamepad>;
}