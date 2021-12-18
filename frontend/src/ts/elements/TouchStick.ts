import { game } from "../main.js";
import { CustomElement } from "./CustomElement.js";

export class TouchStick extends CustomElement {
    dragStart;
    currentPos = { x: 0, y: 0 };
    stick;
    maxDiff = 10 * game.sizeRatio;

    constructor() {
        super();
        this.stick = document.createElement('div');
        this.shadowRoot.appendChild(this.stick);
        this.stick.addEventListener('mousedown', this.mouseDown.bind(this));
        this.stick.addEventListener('touchstart', this.mouseDown.bind(this));
        this.stick.addEventListener('mousemove', this.mouseMove.bind(this));
        this.stick.addEventListener('touchmove', this.mouseMove.bind(this));
        this.stick.addEventListener('mouseup', this.mouseUp.bind(this));
        this.stick.addEventListener('touchend', this.mouseUp.bind(this));
    }

    get axisH() {
        return (this.currentPos.x / (this.maxDiff));
    }

    get axisV() {
        return (this.currentPos.y / (this.maxDiff));
    }

    get hotzone() {
        return this.getBoundingClientRect();
    }

    touchCollides(touch) {
        return (touch.clientX > this.hotzone.x - this.maxDiff*2 &&
            touch.clientY > this.hotzone.y - this.maxDiff*2 &&
            touch.clientX < this.hotzone.right + this.maxDiff*2 &&
            touch.clientY < this.hotzone.bottom + this.maxDiff*2);
    }

    mouseDown(e) {
        this.stick.style.transition = '0s';
        if (e.changedTouches) {
            let goodTouch;

            for (let touch of e.changedTouches) {
                if (this.touchCollides(touch)) goodTouch = touch;
            }

            if (!goodTouch) return;

            this.dragStart = {
                x: goodTouch.clientX,
                y: goodTouch.clientY,
            };
            return;
        }
        this.dragStart = {
            x: e.clientX,
            y: e.clientY,
        };

        this.maxDiff = 10 * game.sizeRatio;

    }

    mouseMove(e) {
        if (this.dragStart === null) return;
        e.preventDefault();
        if (e.changedTouches) {
            let goodTouch;

            for (let touch of e.changedTouches) {
                if (this.touchCollides(touch)) goodTouch = touch;
            }

            if (!goodTouch) return;

            e.clientX = goodTouch.clientX;
            e.clientY = goodTouch.clientY;
        }
        const xDiff = e.clientX - this.dragStart.x;
        const yDiff = e.clientY - this.dragStart.y;
        const angle = Math.atan2(yDiff, xDiff);
        const distance = Math.min(this.maxDiff, Math.hypot(xDiff, yDiff));
        const xNew = distance * Math.cos(angle);
        const yNew = distance * Math.sin(angle);
        this.stick.style.transform = `translate3d(${xNew}px, ${yNew}px, 0px)`;
        this.currentPos = { x: xNew, y: yNew };
    }

    mouseUp(e) {
        if (this.dragStart === null) return;
        this.stick.style.transition = '.2s';
        this.stick.style.transform = `translate3d(0px, 0px, 0px)`;
        this.dragStart = null;
        this.currentPos = { x: 0, y: 0 };
    }
}

customElements.define('ce-touch-stick', TouchStick);