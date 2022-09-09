export class Vec2
{
    /**
     * @type {number}
     */
    x;
    /**
     * @type {number}
     */
    y;

    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }

    /**
     * @param {number} s
     * @returns {Vec2}
     */
    static fromScalar(s)
    {
        return new Vec2(s, s);
    }

    /**
     * @param {Vec2} v
     * @returns {number}
     */
    angle(v)
    {
        return Math.atan2(v.y - this.y, v.x - this.x);
    }

    /**
     * @returns {Vec2}
     */
    clone()
    {
        return new Vec2(this.x, this.y);
    }

    /**
     * @param {Vec2} v
     * @returns {Vec2}
     */
    subtract(v)
    {
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    /**
     * @param {Vec2} v
     * @returns {Vec2}
     */
    add(v)
    {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    /**
     * @param {Vec2} v
     * @returns {Vec2}
     */
    multiply(v)
    {
        return new Vec2(this.x * v.x, this.y * v.y);
    }


    /**
     * @param {number} s
     * @returns {Vec2}
     */
    addScalar(s)
    {
        return new Vec2(this.x + s, this.y + s);
    }

    /**
     * @param {number} s
     * @returns {Vec2}
     */
    subtractScalar(s)
    {
        return new Vec2(this.x - s, this.y - s);
    }

    /**
     * @param {number} s
     * @returns {Vec2}
     */
    divideScalar(s)
    {
        return new Vec2(this.x / s, this.y / s);
    }

    /**
     * @param {number} s
     * @returns {Vec2}
     */
    multiplyScalar(s)
    {
        return new Vec2(this.x * s, this.y * s);
    }

}

export class Distance
{
    /**
     * @param {Vec2} a
     * @param {Vec2} b
     * @returns {number}
     */
    static simple(a, b)
    {
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);
        return Math.max(dx, dy);
    }
}

export class FloatingOrigin
{
    /**
     * @type {Vec2}
     */
    offset;
    /**
     * @type {number}
     */
    scale;
    /**
     * @type {Vec2}
     */
    currentPointerLocation;
    /**
     * @type {Vec2}
     */
    lastPointerLocation;
    /**
     * @type {number}
     */
    zoomSensitivity = 2000;
    /**
     * @type {number}
     */
    minScale        = 0.1;
    /**
     * @type {number}
     */
    maxScale        = 50;

    /**
     * @param {Vec2} offset
     * @param {number} scale
     */
    constructor(offset, scale)
    {
        this.offset                 = offset;
        this.scale                  = scale;
        this.currentPointerLocation = new Vec2();
        this.lastPointerLocation    = new Vec2();
    }

    /**
     * @param {number} deltaY
     */
    zoom(deltaY)
    {
        const zoom     = 1 - deltaY / this.zoomSensitivity;
        const newScale = this.scale * zoom;

        if (this.minScale > newScale || newScale > this.maxScale) {
            return;
        }

        this.scale = newScale;
    }

    /**
     * @param {Vec2} cornerTopLeft
     * @param {Vec2} pointerLocation
     */
    move(cornerTopLeft, pointerLocation)
    {
        this.lastPointerLocation    = this.currentPointerLocation;
        this.currentPointerLocation = pointerLocation.subtract(cornerTopLeft);
    }

    pan()
    {
        const deltaPointerLocation = this.currentPointerLocation
                                         .subtract(this.lastPointerLocation)
                                         .divideScalar(this.scale);

        this.offset = this.offset.subtract(deltaPointerLocation);
    }
}