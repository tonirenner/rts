import {FloatingOrigin, Vec2} from '../math.js';

export default class Camera
{
    /**
     * @type {Universe}
     */
    universe;

    /**
     * @type {DOMMatrix}
     */
    projection;

    /**
     * @type {FloatingOrigin}
     */
    origin = new FloatingOrigin(new Vec2(), 1);

    /** @type {function} */
    boundOnZoom = this.onZoom.bind(this);

    /** @type {function} */
    boundOnOriginHasChanged = this.onOriginHasChanged.bind(this);

    /** @type {function} */
    boundOnTrackCursor = this.onTrackCursor.bind(this);

    /** @type {function} */
    boundOnStartPanning = this.onStartPanning.bind(this);

    /** @type {function} */
    boundOnStopPanning = this.onStopPanning.bind(this);

    /**
     * @param {Universe|*} universe
     */
    constructor(universe)
    {
        this.universe   = universe;
        this.projection = universe.canvas.getTransform();

        this.universe.canvas.addEventListener('wheel', this.boundOnZoom);
        this.universe.canvas.addEventListener('mousedown', this.boundOnStartPanning);

        document.addEventListener('mousemove', this.boundOnTrackCursor);
    }

    /**
     * @param {MouseEvent} e
     * @returns {Vec2}
     */
    screenCoordinates(e)
    {
        return this.universe.canvas.screenCoordinates(e);
    }

    /**
     * @param {Vec2} coordinates
     * @returns {Vec2}
     */
    screenToWorld(coordinates)
    {
        const point = new DOMPoint(coordinates.x, coordinates.y)
            .matrixTransform(this.projection.inverse());

        return new Vec2(point.x, point.y);
    }

    /**
     * @param {Vec2} coordinates
     * @returns {Vec2}
     */
    worldToScreen(coordinates)
    {
        const point = new DOMPoint(coordinates.x, coordinates.y)
            .matrixTransform(this.projection);

        return new Vec2(point.x, point.y);
    }

    transform()
    {
        this.universe.canvas.scale(
            this.origin.scale,
            this.origin.scale
        );

        this.universe.canvas.translate(
            this.origin.offset.x,
            this.origin.offset.y
        );

        this.projection = this.universe.canvas.getTransform();
    }


    /**
     * @param {WheelEvent} e
     */
    onZoom(e)
    {
        e.preventDefault();

        this.origin.zoom(e.deltaY);
    }

    /**
     * @param {MouseEvent} e
     */
    onTrackCursor(e)
    {
        e.preventDefault();

        this.origin.trackCursor(
            this.screenCoordinates(e)
        );
    }

    onOriginHasChanged()
    {
        this.origin.pan();
    }

    onStartPanning(e)
    {
        if (e.which !== 3) {
            return;
        }

        document.addEventListener('mousemove', this.boundOnOriginHasChanged);
        document.addEventListener('mouseup', this.boundOnStopPanning);
    }

    onStopPanning()
    {
        document.removeEventListener('mousemove', this.boundOnOriginHasChanged);
        document.removeEventListener('mouseup', this.boundOnStopPanning);
    }
}