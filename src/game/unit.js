import {Entity} from './entity.js';
import {Group} from '../canvas/object.js';

export class Unit extends Entity
{
    /**
     * @param {Player|*} player
     */
    constructor(player)
    {
        super(player);
    }
}

export class UnitGroup extends Group
{
    /**
     * @param {number} index
     * @returns {Unit|null}
     */
    at(index)
    {
        return this.objects[index] || null;
    }


    /**
     * @param {Vec2} p
     *
     * @returns {Unit|null}
     */
    findOneByCoordinates(p)
    {
        return super.findOneByCoordinates(p);
    }

    /**
     * @param {Unit|*} unit
     */
    add(unit)
    {
        super.add(unit);
    }
}