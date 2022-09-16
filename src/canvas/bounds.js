import {Vec2} from '../coordinates.js';

export class Bounds2D
{
    /**
     * @type {Vec2}
     */
    min;
    /**
     * @type {Vec2}
     */
    max;

    /**
     * @param {Vec2} min
     * @param {Vec2} max
     */
    constructor(min, max)
    {
        this.min = min;
        this.max = max;
    }

    /**
     * @returns {Vec2}
     */
    get center()
    {
        return this.min.add(this.max).multiplyScalar(0.5);
    }

    /**
     * @returns {Vec2}
     */
    get dimension()
    {
        return this.max.subtract(this.min);
    }

    /**
     * @param {Vec2} p
     * @returns {boolean}
     */
    containsPoint(p)
    {
        return p.x > this.min.x && p.x < this.max.x && p.y > this.min.y && p.y < this.max.y;
    }
}