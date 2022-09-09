import GraphicsDevice from '../graphics.device.js';
import {Vec2} from '../coordinates.js';

export class HealthBar extends GraphicsDevice.Rectangle
{
    /**
     * @type {Vec2}
     */
    offset   = new Vec2();
    /**
     * @type {number}
     */
    maxHeath = 0;
    /**
     * @type {number}
     */
    health   = 0;

    /**
     * @param {number} maxHeath
     * @param {Vec2} offset
     */
    constructor(maxHeath, offset)
    {
        super();
        this.filled   = true;
        this.color    = 'rgb(50,50,250)';
        this.offset   = offset;
        this.maxHeath = maxHeath;
    }

    update()
    {
        this.position.x += this.offset.x;
        this.position.y += this.offset.y;
        this.dimension.x = (this.computedHealthRatio() * 20) | 0;
        this.dimension.y = 2;
    }

    /**
     * @returns {number}
     */
    computedHealthRatio()
    {
        return parseFloat((this.health / this.maxHeath).toFixed(2));
    }
}

