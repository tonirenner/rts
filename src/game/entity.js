import {Bounds2D} from '../canvas/bounds.js';
import {Object2D} from '../canvas/object.js';
import {IdleState} from './state.js';

export class Entity extends Object2D
{
    /**
     * @type {Player}
     */
    player;

    /**
     * @type {State|*}
     */
    state;

    /**
     * @param {Player|*} player
     */
    constructor(player)
    {
        super();

        this.player = player;
        this.state  = new IdleState();
    }

    /**
     * @returns {Bounds2D}
     */
    bounds()
    {
        const halfDimension = 9;

        this.bounds2d.min = this.position.subtractScalar(halfDimension);
        this.bounds2d.max = this.position.addScalar(halfDimension);

        return this.bounds2d;
    }

    update()
    {
        this.state.update(this);
    }

    render()
    {
        this.state.render(this);
    }
}