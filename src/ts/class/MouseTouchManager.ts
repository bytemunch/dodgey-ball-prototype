import { game } from "../main.js";

export class MouseTouchManager {
    constructor(touchTarget) {
        // add interaction handlers
        touchTarget.addEventListener('touchstart', e => {
            e.preventDefault();
            const x = e.touches[0].clientX - game.containerBB.x;
            const y = e.touches[0].clientY - game.containerBB.y;

            // ingame touch
            const moveFn = e => {
                e.preventDefault();
                console.log('TouchMove!');
            }

            moveFn(e);

            touchTarget.addEventListener('touchmove', moveFn);

            const upFn = e => {
                e.preventDefault();

                touchTarget.removeEventListener('touchmove', moveFn);
                touchTarget.removeEventListener('touchend', upFn);
                console.log("TouchEnd!");
            }

            touchTarget.addEventListener('touchend', upFn);

            console.log('TouchStart!');
        })

        touchTarget.addEventListener('mousedown', e => {
            e.preventDefault();
            const x = e.offsetX;
            const y = e.offsetY;

            // ingame touch
            const moveFn = e => {
                e.preventDefault();

                console.log('MouseMove!');
            }

            moveFn(e);

            touchTarget.addEventListener('mousemove', moveFn);

            const upFn = e => {
                e.preventDefault();

                touchTarget.removeEventListener('mousemove', moveFn);
                touchTarget.removeEventListener('mouseup', upFn);

                console.log('MouseUp!');
            }

            touchTarget.addEventListener('mouseup', upFn);

            console.log('MouseDown!');
        })
    }

}

