import {FloatingOrigin, Vec2} from './coordinates.js';
import {Bounds2D} from './bounds.js';

class Viewport
{
    /**
     * @type FloatingOrigin
     */
    origin;
    /**
     * @type {Bounds2D}
     */
    bounds2d      = new Bounds2D(new Vec2(), new Vec2());
    /**
     * @type {Vec2}
     */
    dimension     = new Vec2();
    /**
     * @type {Vec2}
     */
    halfDimension = new Vec2();

    /**
     * @param {FloatingOrigin} origin
     */
    constructor(origin)
    {
        this.origin = origin;
    }

    update()
    {
        const origin = this.origin.offset.multiplyScalar(-1);

        this.bounds2d.min = origin.subtract(this.halfDimension.divideScalar(this.origin.scale));
        this.bounds2d.max = origin.add(this.halfDimension.divideScalar(this.origin.scale));
    }

    /**
     * @param {number} width
     */
    set width(width)
    {
        this.dimension.x     = width | 0;
        this.halfDimension.x = (width / 2) | 0;

        this.update();
    }

    /**
     * @param {number} height
     */
    set height(height)
    {
        this.dimension.y     = height | 0;
        this.halfDimension.y = (height / 2) | 0;

        this.update();
    }

    /**
     * @param {Canvas} canvas
     * @param {MouseEvent} event
     * @returns {Vec2}
     */
    screenCoordinates(canvas, event)
    {
        const rect = canvas.getBoundingClientRect();
        return new Vec2(
            event.clientX - rect.left,
            event.clientY - rect.top
        );
    }

    /**
     * @param {Vec2} coordinates
     * @returns {Vec2}
     */
    screenToWorld(coordinates)
    {
        return coordinates.divideScalar(this.origin.scale).subtract(this.bounds2d.max).multiply(new Vec2(1, -1));
    }

    /**
     * @param {Vec2} coordinates
     * @returns {Vec2}
     */
    worldToScreen(coordinates)
    {
        return coordinates.add(this.bounds2d.max).multiplyScalar(this.origin.scale);
    }

}

export default class Camera
{
    /**
     * @type {Viewport}
     */
    viewport;
    /**
     * @type {Universe}
     */
    universe;

    /**
     * @param {Universe|*} universe
     */
    constructor(universe)
    {
        this.viewport        = new Viewport(universe.origin);
        this.viewport.width  = universe.canvas.screenWidth;
        this.viewport.height = universe.canvas.screenHeight;
        this.universe        = universe;

        this.handleOriginOffsetHasChanged = this.onOriginOffsetHasChanged.bind(this);
        this.handleStopPan                = this.onStopPan.bind(this);

        document.addEventListener('mousemove', this.onPointerLocationHasChanged.bind(this));

        this.universe.canvas.addEventListener('wheel', this.onZoomHasChanged.bind(this));
        this.universe.canvas.addEventListener('mousedown', this.onStartPan.bind(this));
    }

    /**
     * @param {MouseEvent} e
     * @returns {Vec2}
     */
    screenCoordinates(e)
    {
        return this.viewport.screenCoordinates(this.universe.canvas, e);
    }

    /**
     * @param {Vec2} coordinates
     * @returns {Vec2}
     */
    screenToWorld(coordinates)
    {
        return this.viewport.screenToWorld(coordinates);
    }

    /**
     * @param {Vec2} coordinates
     * @returns {Vec2}
     */
    worldToScreen(coordinates)
    {
        return this.viewport.worldToScreen(coordinates);
    }

    transform()
    {
        this.universe.canvas.transform(
            1,
            this.universe.origin.offset.multiply(new Vec2(1, -1))
        );
    }

    /**
     * @param {WheelEvent} e
     */
    onZoomHasChanged(e)
    {
        e.preventDefault();

        this.universe.origin.zoom(e.deltaY);
        this.viewport.update();
    }

    /**
     * @param {MouseEvent} e
     */
    onPointerLocationHasChanged(e)
    {
        e.preventDefault();

        const rect = this.universe.canvas.getBoundingClientRect();

        this.universe.origin.move(
            new Vec2(rect.left, rect.top),
            new Vec2(e.pageX, e.pageY)
        );

        this.viewport.update();
    }

    onOriginOffsetHasChanged()
    {
        this.universe.origin.update();
    }

    onStartPan(e)
    {
        if (e.which !== 3) {
            return;
        }

        document.addEventListener('mousemove', this.handleOriginOffsetHasChanged);
        document.addEventListener('mouseup', this.handleStopPan);
    }

    onStopPan()
    {
        document.removeEventListener('mousemove', this.handleOriginOffsetHasChanged);
        document.removeEventListener('mouseup', this.handleStopPan);
    }
}