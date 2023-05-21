import { mat3, vec2, vec4 } from 'gl-matrix';
import { AnimationLoopCallback, SetWebGLContextSize, _GL } from './utils/webgl';
import { Scene } from './nodes/scene';
import { Clock } from './utils/clock';
import { Camera } from './nodes/camera';
import { Texture } from './resources/texture';

export class Renderer {
    clock: Clock = new Clock();

    private _animationLoopCallback: AnimationLoopCallback;

    appendTo(parent: HTMLElement, autoResizeToFillParent: boolean = true) {
        parent.appendChild(_GL.ctx.canvas as HTMLCanvasElement);

        if (autoResizeToFillParent === true) {
            this.setSize();
        }
    }

    setSize(displayWidth?: number, displayHeight?: number): vec2 {
        SetWebGLContextSize(displayWidth, displayHeight);
        return vec2.fromValues(_GL.ctx.canvas.width, _GL.ctx.canvas.height);
    }

    private _animationLoop(time: number) {
        this.clock.update(time);

        if (this._animationLoopCallback) {
            this._animationLoopCallback({
                time,
                deltaTime: this.clock.deltaTime,
                fps: this.clock.fps,
            });

            requestAnimationFrame(this._animationLoop.bind(this));
        }
    }

    setAnimationLoop(callback: AnimationLoopCallback) {
        this._animationLoopCallback = null;

        if (callback) {
            this._animationLoopCallback = callback;
            requestAnimationFrame(this._animationLoop.bind(this));
        }
    }

    render(scene: Scene, camera?: Camera) {
        _GL.ctx.clearColor(0.0, 0.0, 0.0, 1);
        _GL.ctx.clear(_GL.ctx.COLOR_BUFFER_BIT | _GL.ctx.DEPTH_BUFFER_BIT);

        _GL.ctx.useProgram(_GL.pgm);
        _GL.ctx.bindVertexArray(_GL.vao);

        _GL.ctx.uniform2f(_GL.loc.uniforms.u_resolution, _GL.ctx.canvas.width, _GL.ctx.canvas.height);

        if (camera) {
            camera.updateWorldMatrix();
            camera.update(this.clock.time, this.clock.deltaTime);
            camera.render();

            _GL.ctx.uniformMatrix3fv(_GL.loc.uniforms.u_cameraMatrix, false, camera.projectionMatrix);
        } else {
            _GL.ctx.uniformMatrix3fv(_GL.loc.uniforms.u_cameraMatrix, false, mat3.create());
        }

        scene.updateWorldMatrix();
        scene.update(this.clock.time, this.clock.deltaTime);
        scene.render();
    }

    drawTexture(texture: Texture, matrix: mat3, region?: vec4) {
        region = region ?? vec4.fromValues(0, 0, texture.width, texture.height);

        _GL.ctx.uniformMatrix3fv(_GL.loc.uniforms.u_positionMatrix, false, matrix);

        const textureUnit = 0;
        _GL.ctx.uniform1i(_GL.loc.uniforms.uImage, textureUnit);
        _GL.ctx.activeTexture(_GL.ctx.TEXTURE0 + textureUnit);
        _GL.ctx.bindTexture(_GL.ctx.TEXTURE_2D, texture.buffer);

        const texturePosition: vec2 = vec2.fromValues(
            region[0] / texture.width,
            region[1] / texture.height,
        );

        const textureScale: vec2 = vec2.fromValues(
            region[2] / texture.width,
            region[3] / texture.height,
        );

        const textureMatrix: mat3 = mat3.create();

        mat3.translate(textureMatrix, textureMatrix, texturePosition);
        mat3.scale(textureMatrix, textureMatrix, textureScale);

        _GL.ctx.uniform2f(_GL.loc.uniforms.u_textureSize, region[2], region[3]);
        _GL.ctx.uniformMatrix3fv(_GL.loc.uniforms.u_textureMatrix, false, textureMatrix);
        _GL.ctx.drawArrays(_GL.ctx.TRIANGLES, 0, 6);
    }
}
