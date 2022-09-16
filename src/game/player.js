import {UnitGroup} from './unit.js';

export class Player
{
    /**
     * @type {Universe}
     */
    universe;

    /**
     * @type {UnitGroup|*}
     */
    units;

    /**
     * @type {UnitGroup|*}
     */
    selectedUnits;

    /**
     * @type {string}
     */
    color = 'rgb(37,148,13)';

    /**
     * @param {Universe} universe
     */
    constructor(universe)
    {
        this.universe      = universe;
        this.units         = new UnitGroup();
        this.selectedUnits = new UnitGroup();
    }

    /**
     * @param {Object2D|*} object
     */
    add(object)
    {
        this.units.add(object);
        this.universe.add(object);
    }

    /**
     * @param {Object2D|*} object
     */
    remove(object)
    {
        this.units.remove(object);
        this.universe.remove(object);
    }

    /**
     * @param {Command|*} command
     */
    dispatchCommand(command)
    {
        this.universe.dispatchCommand(command);
    }

    /**
     * @param {any} audio
     */
    dispatchAudio(audio)
    {
        this.universe.dispatchAudio(audio);
    }
}