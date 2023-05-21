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
        let frame: vec4 = this.region;

        if (this.frames.length > 0) {
            frame = this.frames[this.frameIndex];
        }

        const pos: vec2 = vec2.fromValues(this.worldMatrix[6], this.worldMatrix[7]);

        if (this.centered) {
            pos[0] -= (frame[2] / 2.0);
            pos[1] -= (frame[3] / 2.0);
        }

        renderer.drawImage(
            this._texture.image,
            pos[0], pos[1], frame[2], frame[3],
            frame[0], frame[1],
            frame[2], frame[3],
        );

        this.children.forEach((child: Node) => child.render(renderer));
    }
}
