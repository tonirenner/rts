import {Vec2} from './coordinates.js';

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
     * @param {Universe|*} universe
     */
    constructor(universe)
    {
        this.universe   = universe;
        this.projection = universe.canvas.getTransform();

        this.handleOriginOffsetHasChanged = this.onOriginOffsetHasChanged.bind(this);
        this.handleStopPan                = this.onStopPan.bind(this);

        document.addEventListener('mousemove', this.onPointerLocationHasChanged.bind(this));

        this.universe.canvas.addEventListener('wheel', this.onZoomHasChanged.bind(this));
        this.universe.canvas.addEventListener('mousedown', this.onStartPan.bind(this));
    }


    /**
     * @returns {DOMMatrix}
     */
    getProjection()
    {
        return this.projection;
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
            this.universe.origin.scale,
            this.universe.origin.scale
        );

        this.projection = this.universe.canvas.getTransform();
    }


    /**
     * @param {WheelEvent} e
     */
    onZoomHasChanged(e)
    {
        e.preventDefault();

        this.universe.origin.zoom(e.deltaY);
    }

    /**
     * @param {MouseEvent} e
     */
    onPointerLocationHasChanged(e)
    {
        e.preventDefault();

        this.universe.origin.trackCursor(this.screenCoordinates(e));
    }

    onOriginOffsetHasChanged()
    {
        this.universe.origin.pan();
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