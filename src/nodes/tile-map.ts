import { mat3, vec2, vec4 } from 'gl-matrix';
import { Texture } from '../resources/texture';
import { Node } from './node';
import { Renderer } from '..';

const DEFAULT_TILE_SIZE: number = 16;

export interface TileMapParams {
    marginLeft?: number,
    marginTop?: number,
    paddingX?: number,
    paddingY?: number,
};

const DEFAULT_PARAMS: TileMapParams = {
    marginLeft: 0,
    marginTop: 0,
    paddingX: 0,
    paddingY: 0,
};

export class TileMap extends Node {
    private _map: Map<string, vec2> = new Map<string, vec2>();
    private _texture: Texture;
    private _params: TileMapParams;
    private _tileSize: vec2 = vec2.fromValues(DEFAULT_TILE_SIZE, DEFAULT_TILE_SIZE);

    tilePadding: number = 0;

    get mapSize(): number {
        return Object.keys(this._map).length;
    }

    constructor(texture: Texture, tileSize: vec2, params: TileMapParams = {}) {
        super();

        this._texture = texture;
        this._tileSize = tileSize;
        this._params = { ...DEFAULT_PARAMS, ...params };
    }

    setTile(mapPosition: vec2, tilePosition: vec2) {
        this._map.set(mapPosition.toString(), tilePosition);
    }

    getTile(mapPosition: vec2): vec2 {
        return this._map.get(mapPosition.toString());
    }

    render(renderer: Renderer) {
        const screenSize: vec2 = vec2.fromValues(renderer.width, renderer.height);

        const maxTiles: vec2 = vec2.fromValues(
            Math.floor(screenSize[0] / this._tileSize[0]),
            Math.floor(screenSize[1] / this._tileSize[1])
        );

        const tileCount: vec2 = vec2.fromValues(
            Math.floor((maxTiles[0] + 1) / 2.0),
            Math.floor((maxTiles[1] + 1) / 2.0),
        );

        for (let x = -tileCount[0]; x <= tileCount[0]; x += 1) {
            for (let y = -tileCount[1]; y <= tileCount[1]; y += 1) {
                const mapPosition: vec2 = vec2.fromValues(x, y);
                const tilePosition: vec2 = this._map.get(mapPosition.toString());

                if (tilePosition) {
                    vec2.multiply(mapPosition, mapPosition, this._tileSize);

                    const region: vec4 = vec4.fromValues(
                        this._params.marginLeft + (tilePosition[0] * this._tileSize[0]),
                        this._params.marginTop + (tilePosition[1] * this._tileSize[1]),
                        this._tileSize[0], this._tileSize[1],
                    );

                    renderer.drawImage(
                        this._texture.image,

                        this.worldMatrix[6] + mapPosition[0] - (region[2] / 2.0),
                        this.worldMatrix[7] + mapPosition[1] - (region[3] / 2.0),
                        region[2], region[3],

                        region[0], region[1],
                        region[2], region[3],
                    );
                }
            }
        }

        super.render(renderer);
    }

    setEmptyNeighbors(tile: vec2) {
        const start: number = Date.now();

        let i: number = -1;
        const keys: IterableIterator<string> = this._map.keys();

        const tilesToAdd: string[] = [];

        for (const keyA of keys) {
            const keyAParts: number[] = keyA.split(',').map((v: string) => parseFloat(v));
            const posA: vec2 = vec2.fromValues(keyAParts[0], keyAParts[1]);

            [
                vec2.fromValues(-1, 0), // w
                vec2.fromValues(-1, -1), // nw
                vec2.fromValues(0, -1), // n
                vec2.fromValues(1, -1), // ne
                vec2.fromValues(1, 0), // e
                vec2.fromValues(1, 1), // se
                vec2.fromValues(0, 1), // s
                vec2.fromValues(-1, 1), // sw
            ].forEach((offset: vec2) => {
                const keyB: string = vec2.add(vec2.create(), posA, offset).toString();

                if (!this._map.has(keyB)) {
                    tilesToAdd.push(keyB);
                }
            });
        };

        tilesToAdd.forEach((keyB: string) => this._map.set(keyB, tile));
    }
}
