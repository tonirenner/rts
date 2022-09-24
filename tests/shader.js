import {Vec2} from '../src/math.js';

export default class Shader
{
    /**  @type {Vec2} */
    resolution;

    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height)
    {
        this.resolution = new Vec2(width, height);
    }

    /**
     * @param {Vec2} coordinates
     * @returns {Vec2}
     */
    uv(coordinates)
    {
        return new Vec2(coordinates.x / this.resolution.x, coordinates.y / this.resolution.y);
    }

    /**
     * @param {Vec2} coordinates
     * @returns {string}
     */
    shade(coordinates)
    {
        return 'rgba(127,0,0,1)';
    }
}
