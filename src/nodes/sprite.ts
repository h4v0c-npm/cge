import { vec2, vec4 } from 'gl-matrix';
import { Texture } from '../texture';
import { Node } from './node';
import { Renderer } from '../renderer';

export class Sprite extends Node {
    protected _texture: Texture;

    get texture(): Texture { return this._texture; }

    set texture(texture: Texture) {
        this._texture = texture;
        this.region = vec4.fromValues(0, 0, this._texture.width, this._texture.height);
    }

    region: vec4;
    centered: boolean = true;

    constructor(texture?: Texture) {
        super();

        if (texture) {
            this.texture = texture;
        }
    }

    render(renderer: Renderer) {
        const pos: vec2 = vec2.fromValues(this.worldMatrix[6], this.worldMatrix[7]);

        if (this.centered) {
            pos[0] -= (this.region[2] / 2.0);
            pos[1] -= (this.region[3] / 2.0);
        }

        renderer.drawImage(
            this._texture.image,
            pos[0], pos[1], this.region[2], this.region[3],
            this.region[0], this.region[1],
            this.region[2], this.region[3],
        );

        super.render(renderer);
    }
}
