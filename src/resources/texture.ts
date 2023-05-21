// import { vec2 } from 'gl-matrix';
// import { Base } from '../utils/base';
// import { _GL } from '../utils/webgl';
// import { LoadImage } from '../utils/loaders';

// export class Texture extends Base {
//     private _image: ImageBitmap;
//     private _texture: WebGLTexture;

//     constructor(image: ImageBitmap) {
//         super();

//         this._image = image;

//         this._texture = _GL.ctx.createTexture();
//         _GL.ctx.activeTexture(_GL.ctx.TEXTURE0);
//         _GL.ctx.bindTexture(_GL.ctx.TEXTURE_2D, this._texture);
//         _GL.ctx.texParameteri(_GL.ctx.TEXTURE_2D, _GL.ctx.TEXTURE_WRAP_S, _GL.ctx.CLAMP_TO_EDGE);
//         _GL.ctx.texParameteri(_GL.ctx.TEXTURE_2D, _GL.ctx.TEXTURE_WRAP_T, _GL.ctx.CLAMP_TO_EDGE);
//         _GL.ctx.texParameteri(_GL.ctx.TEXTURE_2D, _GL.ctx.TEXTURE_MIN_FILTER, _GL.ctx.NEAREST);
//         _GL.ctx.texParameteri(_GL.ctx.TEXTURE_2D, _GL.ctx.TEXTURE_MAG_FILTER, _GL.ctx.NEAREST);
//         _GL.ctx.texImage2D(_GL.ctx.TEXTURE_2D, 0, _GL.ctx.RGBA, _GL.ctx.RGBA, _GL.ctx.UNSIGNED_BYTE, this._image);
//     }

//     get image(): ImageBitmap { return this._image; }
//     get buffer(): WebGLTexture { return this._texture; }
//     get width(): number { return this._image.width; }
//     get height(): number { return this._image.height; }
//     get size(): vec2 { return vec2.fromValues(this._image.width, this._image.height); }

//     static async fromUrl(url: string): Promise<Texture> {
//         const image: ImageBitmap = await LoadImage(url) as ImageBitmap;
//         return new Texture(image);
//     }
// }
