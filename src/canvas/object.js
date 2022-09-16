import {Vec2} from '../math.js';
import {Bounds2D} from './bounds.js';


export class Object2D
{
    /**
     * @type {Vec2}
     */
    position = new Vec2();

    /**
     * @type {Bounds2D}
     */
    bounds2d = new Bounds2D(new Vec2(), new Vec2());

    /**
     * @returns {Bounds2D}
     */
    bounds()
    {
        const halfDimension = 4;

        this.bounds2d.min = this.position.subtractScalar(halfDimension);
        this.bounds2d.max = this.position.addScalar(halfDimension);

        return this.bounds2d;
    }

    update()
    {
    }

    render()
    {
    }
}

export class Group extends Object2D
{
    /**
     * @type {Object2D[]}
     */
    objects = [];

    /**
     * @returns {number}
     */
    get length()
    {
        return this.objects.length;
    }

    /**
     * @param {Vec2} p
     *
     * @returns {Object2D|null}
     */
    findOneByCoordinates(p)
    {
        for (let i in this.objects) {
            if (this.objects[i].bounds().containsPoint(p)) {
                return this.objects[i];
            }
        }
        return null;
    }

    /**
     * @param {Object2D|*} object
     */
    contains(object)
    {
        return this.objects.indexOf(object) > -1;
    }

    /**
     * @param {Object2D|*} object
     */
    add(object)
    {
        this.objects.push(object);
    }

    /**
     * @param {function} callable
     */
    forEach(callable)
    {
        this.objects.forEach(callable);
    }

    clear()
    {
        this.objects = [];
    }

    /**
     * @param {Object2D|*} object
     */
    remove(object)
    {
        const index = this.objects.indexOf(object);
        if (index === -1) {
            return;
        }
        this.objects.splice(index, 1);
    }

    update()
    {
        for (let i in this.objects) {
            this.objects[i].update();
        }
    }

    render()
    {
        for (let i in this.objects) {
            this.objects[i].render();
        }
    }
}

export class Scene extends Group
{
}