import { vec2 } from 'gl-matrix';
import { LoadImage } from './utils/loaders';

export class Texture {
    private _image: ImageBitmap;

    constructor(image: ImageBitmap) {
        this._image = image;
    }

    get image(): ImageBitmap { return this._image; }
    get width(): number { return this._image.width; }
    get height(): number { return this._image.height; }
    get size(): vec2 { return vec2.fromValues(this._image.width, this._image.height); }

    static async fromUrl(url: string): Promise<Texture> {
        const image: ImageBitmap = await LoadImage(url) as ImageBitmap;
        return new Texture(image);
    }
}
