import { TouchAction } from "../elements/TouchAction.js";
import { TouchSprint } from "../elements/TouchSprint.js";
import { TouchStick } from "../elements/TouchStick.js";

export class TouchController {
    lStickEl;
    rStickEl;
    actionEl;
    sprintEl;

    constructor() {
        this.sprintEl = new TouchSprint;
        this.actionEl = new TouchAction;
        this.lStickEl = new TouchStick;
        this.rStickEl = new TouchStick;

        this.sprintEl.style.position = 'absolute';
        this.sprintEl.style.top = '50%';
        this.sprintEl.style.left = '10%';

        this.actionEl.style.position = 'absolute';
        this.actionEl.style.top = '50%';
        this.actionEl.style.right = '10%';

        this.lStickEl.style.position = 'absolute';
        this.lStickEl.style.top = '70%';
        this.lStickEl.style.left = '10%';

        this.rStickEl.style.position = 'absolute';
        this.rStickEl.style.top = '70%';
        this.rStickEl.style.right = '10%';

        document.querySelector('#touch-target').appendChild(this.sprintEl);
        document.querySelector('#touch-target').appendChild(this.actionEl);
        document.querySelector('#touch-target').appendChild(this.lStickEl);
        document.querySelector('#touch-target').appendChild(this.rStickEl);
    }

    get axes() {
        return [
            this.lStickEl.axisH,
            this.lStickEl.axisV,
            this.rStickEl.axisH,
            this.rStickEl.axisV,
        ];
    }

    get action() {
        return this.actionEl.pressed;
    }

    get sprint() {
        return this.sprintEl.value;
    }
}