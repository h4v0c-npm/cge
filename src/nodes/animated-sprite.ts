import { mat3, vec2, vec4 } from 'gl-matrix';
import { Sprite } from './sprite';
import { _GL } from '../utils';
import { Node } from './node';

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

    render() {
        let frame: vec4 = this.region;

        if (this.frames.length > 0) {
            frame = this.frames[this.frameIndex];
        }

        _GL.ctx.uniformMatrix3fv(_GL.loc.uniforms.u_positionMatrix, false, this.worldMatrix);

        const textureUnit = 0;
        _GL.ctx.uniform1i(_GL.loc.uniforms.uImage, textureUnit);
        _GL.ctx.activeTexture(_GL.ctx.TEXTURE0 + textureUnit);
        _GL.ctx.bindTexture(_GL.ctx.TEXTURE_2D, this.texture.buffer);

        const texturePosition: vec2 = vec2.fromValues(
            frame[0] / this._texture.width,
            frame[1] / this._texture.height,
        );

        const textureScale: vec2 = vec2.fromValues(
            frame[2] / this._texture.width,
            frame[3] / this._texture.height,
        );

        const textureMatrix: mat3 = mat3.create();

        mat3.translate(textureMatrix, textureMatrix, texturePosition);
        mat3.scale(textureMatrix, textureMatrix, textureScale);

        _GL.ctx.uniform2f(_GL.loc.uniforms.u_textureSize, frame[2], frame[3]);
        _GL.ctx.uniformMatrix3fv(_GL.loc.uniforms.u_textureMatrix, false, textureMatrix);
        _GL.ctx.drawArrays(_GL.ctx.TRIANGLES, 0, 6);

        this.children.forEach((child: Node) => child.render());
    }
}