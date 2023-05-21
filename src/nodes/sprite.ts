import { mat3, vec2, vec4 } from 'gl-matrix';
import { Texture } from '../resources/texture';
import { Node } from './node';
import { _GL } from '../utils/webgl';

export class Sprite extends Node {
    protected _texture: Texture;

    get texture(): Texture { return this._texture; }

    set texture(texture: Texture) {
        this._texture = texture;
        this.region = vec4.fromValues(0, 0, this._texture.width, this._texture.height);
    }

    region: vec4;
    centered: boolean = true; // TODO: currently, changing this to false does nothing, need to fix that... possibly setup an origin matrix...

    constructor(texture?: Texture) {
        super();

        if (texture) {
            this.texture = texture;
        }
    }

    render() {
        _GL.ctx.uniformMatrix3fv(_GL.loc.uniforms.u_positionMatrix, false, this.worldMatrix);

        const textureUnit = 0;
        _GL.ctx.uniform1i(_GL.loc.uniforms.uImage, textureUnit);
        _GL.ctx.activeTexture(_GL.ctx.TEXTURE0 + textureUnit);
        _GL.ctx.bindTexture(_GL.ctx.TEXTURE_2D, this.texture.buffer);

        const texturePosition: vec2 = vec2.fromValues(
            this.region[0] / this._texture.width,
            this.region[1] / this._texture.height,
        );

        const textureScale: vec2 = vec2.fromValues(
            this.region[2] / this._texture.width,
            this.region[3] / this._texture.height,
        );

        const textureMatrix: mat3 = mat3.create();

        mat3.translate(textureMatrix, textureMatrix, texturePosition);
        mat3.scale(textureMatrix, textureMatrix, textureScale);

        _GL.ctx.uniform2f(_GL.loc.uniforms.u_textureSize, this.region[2], this.region[3]);
        _GL.ctx.uniformMatrix3fv(_GL.loc.uniforms.u_textureMatrix, false, textureMatrix);
        _GL.ctx.drawArrays(_GL.ctx.TRIANGLES, 0, 6);

        super.render();
    }
}
