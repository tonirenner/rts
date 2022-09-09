import States from './states.js';
import {Bounds2D} from './bounds.js';
import {Vec2} from './coordinates.js';

class Entity
{
    /**
     * @type {Player}
     */
    player;

    /**
     * @type {Vec2}
     */
    position = new Vec2();

    /**
     * @type {Bounds2D}
     */
    bounds2d = new Bounds2D(new Vec2(), new Vec2());

    /**
     * @type {State|*}
     */
    state;

    /**
     * @param {Player|*} player
     */
    constructor(player)
    {
        this.player = player;
        this.state  = new States.IdleState();
    }

    projectedPosition()
    {
        return this.position.multiplyScalar(this.player.universe.origin.scale);
    }

    /**
     * @returns {Bounds2D}
     */
    bounds()
    {
        const halfDimension = 9 * this.player.universe.origin.scale;

        this.bounds2d.min = this.projectedPosition().subtractScalar(halfDimension);
        this.bounds2d.max = this.projectedPosition().addScalar(halfDimension);

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

class EntityGroup
{
    /**
     * @type {Entity[]}
     */
    entities = [];

    /**
     * @param {Vec2} p
     *
     * @returns {Entity|null}
     */
    findOneByCoordinates(p)
    {
        for (let i in this.entities) {
            if (this.entities[i].bounds().containsPoint(p)) {
                return this.entities[i];
            }
        }
        return null;
    }

    /**
     * @param {Entity|*} entity
     */
    add(entity)
    {
        this.entities.push(entity);
    }

    /**
     * @param {Entity|*} entity
     */
    remove(entity)
    {
        const index = this.entities.indexOf(entity);
        if (index === -1) {
            return;
        }
        this.entities.splice(index, 1);
    }

    update()
    {
        for (let i in this.entities) {
            this.entities[i].update();
        }
    }

    render()
    {
        for (let i in this.entities) {
            this.entities[i].render();
        }
    }
}

class Unit extends Entity
{
    /**
     * @param {Player|*} player
     */
    constructor(player)
    {
        super(player);
    }
}

class UnitGroup extends Entity
{
    /**
     * @type {Unit[]}
     */
    units = [];

    /**
     * @param {number} index
     * @returns {Unit|null}
     */
    at(index)
    {
        return this.units[index] || null;
    }

    /**
     * @returns {number}
     */
    get length()
    {
        return this.units.length;
    }

    clear()
    {
        this.units = [];
    }

    /**
     * @param {Vec2} p
     *
     * @returns {Unit|Entity|null}
     */
    findOneByCoordinates(p)
    {
        for (let i in this.units) {
            if (this.units[i].bounds().containsPoint(p)) {
                return this.units[i];
            }
        }
        return null;
    }

    /**
     * @param {function} callback
     */
    forEach(callback)
    {
        this.units.forEach(callback);
    }

    /**
     * @param {Unit|*} unit
     */
    add(unit)
    {
        this.units.push(unit);
    }

    /**
     * @param {Unit|*} unit
     */
    contains(unit)
    {
        return this.units.indexOf(unit) > -1;
    }

    /**
     * @param {Unit|*} unit
     */
    remove(unit)
    {
        const index = this.units.indexOf(unit);
        if (index === -1) {
            return;
        }
        this.units.splice(index, 1);
    }

    update()
    {
        for (let i in this.units) {
            this.units[i].update();
        }
    }

    render()
    {
        for (let i in this.units) {
            this.units[i].render();
        }
    }
}

const Entities = {
    Entity,
    EntityGroup,
    Unit,
    UnitGroup
};

export default Entities;