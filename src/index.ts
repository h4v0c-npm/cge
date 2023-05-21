import './css';
import { Camera, Scene } from './nodes';
import { Renderer } from './renderer';
import { Base, Clock } from './utils';

export * from './nodes';
export * from './resources';
export * from './utils';
export * from './renderer';

export declare type AnimationLoopStats = { time: number, deltaTime: number, fps: number };
export declare type AnimationLoopCallback = (stats: AnimationLoopStats) => void;

export class CanvasGameEngine extends Base {
    renderer: Renderer;
    clock: Clock;
    // input: Input;

    private _animationLoopCallback: AnimationLoopCallback;

    constructor() {
        super();
        this.renderer = new Renderer();
        this.clock = new Clock();
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
        this.renderer.clear();
        this.renderer.resize();

        if (camera) {
            camera.updateWorldMatrix();
            camera.update(this.clock.time, this.clock.deltaTime);
            camera.render(this.renderer);

            // TODO: need to handle the camera's projectionMatrix, probably in the scene

            // _GL.ctx.uniformMatrix3fv(_GL.loc.uniforms.u_cameraMatrix, false, camera.projectionMatrix);
        } else {
            // _GL.ctx.uniformMatrix3fv(_GL.loc.uniforms.u_cameraMatrix, false, mat3.create());
        }

        scene.updateWorldMatrix();
        scene.update(this.clock.time, this.clock.deltaTime);
        scene.render(this.renderer);
    }
}
