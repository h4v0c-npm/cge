import { vec2, vec4 } from 'gl-matrix';
import { Sprite } from './sprite';
import { Node } from './node';
import { Renderer } from '../renderer';

export class AnimatedSprite extends Sprite {
    animating: boolean = true;
    animationSpeed: number = 250;
    frameIndex: number = 0;
    frames: vec4[] = [];

    private _frameTime: number = 0;

    update(time: number, deltaTime: number) {

        if (this.animating === true && this._frameTime + this.animationSpeed <= time) {
            this._frameTime = time;
            this.frameIndex += 1;

            if (this.frameIndex >= this.frames.length) {
                this.frameIndex = 0;
            }
        }

        super.update(time, deltaTime);
    }

    render(renderer: Renderer) {
        if (this.frames.length > 0) {
            this.region = this.frames[this.frameIndex];
        }

        super.render(renderer);

        this.children.forEach((child: Node) => child.render(renderer));
    }
}
