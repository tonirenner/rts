import {Vec2} from '../math.js';
import Projection from './projection.js';

export class Canvas
{
    /**
     * @type {HTMLCanvasElement}
     */
    screen;
    /**
     * @type {number}
     */
    screenWidth;
    /**
     * @type {number}
     */
    screenHeight;
    /**
     * @type {number}
     */
    halfScreenWidth;
    /**
     * @type {number}
     */
    halfScreenHeight;
    /**
     * @type {string}
     */
    clearColor = 'rgb(255,255,255)';

    /**
     * @param {HTMLCanvasElement} screen
     */
    constructor(screen)
    {
        this.screen     = screen;
        this.context    = screen.getContext('2d');
        this.projection = new Projection();

        this.context.imageSmoothingEnabled    = false;
        this.context.imageSmoothingQuality    = 'high';
        this.context.globalCompositeOperation = 'destination-in';
        this.context.globalAlpha              = 0;
    }

    /**
     * @returns {DOMRect}
     */
    getBoundingClientRect()
    {
        return this.screen.getBoundingClientRect();
    }

    /**
     * @param {string} type
     * @param {function} handler
     */
    addEventListener(type, handler)
    {
        this.screen.addEventListener(type, handler);
    }

    /**
     * @returns {DOMMatrix}
     */
    getTransform()
    {
    }

    /**
     * @param {MouseEvent} event
     * @returns {Vec2}
     */
    screenCoordinates(event)
    {
        const rect = this.getBoundingClientRect();
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
        const point = new DOMPoint(coordinates.x, coordinates.y)
            .matrixTransform(this.context.getTransform().inverse());

        return new Vec2(point.x, point.y);
    }

    /**
     * @param {Vec2} coordinates
     * @returns {Vec2}
     */
    worldToScreen(coordinates)
    {
        const point = new DOMPoint(coordinates.x, coordinates.y)
            .matrixTransform(this.context.getTransform());

        return new Vec2(point.x, point.y);
    }

    /**
     * @param {number} width
     */
    set width(width)
    {
        this.screenWidth     = width | 0;
        this.halfScreenWidth = (width / 2) | 0;
    }

    /**
     * @param {number} height
     */
    set height(height)
    {
        this.screenHeight     = height | 0;
        this.halfScreenHeight = (height / 2) | 0;
    }

    clear()
    {
        this.fillRect(
            new Vec2(-this.halfScreenWidth, this.halfScreenHeight),
            new Vec2(this.screenWidth, -this.screenHeight),
            this.clearColor
        );
    }

    resize()
    {
        this.screen.width  = this.screenWidth;
        this.screen.height = this.screenHeight;

        this.context.setTransform(this.projection.matrix(
            this.screenWidth,
            this.screenHeight
        ));

        this.clear();
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    scale(x, y)
    {
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    translate(x, y)
    {
    }

    save()
    {
    }

    restore()
    {
    }

    /**
     * @param {Rectangle|*} rectangle
     */
    drawRectangle(rectangle)
    {
        if (rectangle.filled) {
            this.fillRect(
                rectangle.position,
                rectangle.dimension,
                rectangle.color
            );
            return;
        }

        this.context.strokeStyle = rectangle.color;
        this.strokeRect(
            rectangle.position,
            rectangle.dimension,
            rectangle.color
        );
    }

    /**
     * @param {Rectangle} rectangle
     */
    drawRectangleCentered(rectangle)
    {
        const halfDimension = rectangle.dimension.multiplyScalar(0.5);

        if (rectangle.filled) {
            this.fillRect(
                rectangle.position.subtract(halfDimension),
                rectangle.dimension,
                rectangle.color
            );
            return;
        }

        this.strokeRect(
            rectangle.position.subtract(halfDimension),
            rectangle.dimension,
            rectangle.color
        );
    }

    /**
     * @param {Vec2} position
     * @param {Vec2} dimension
     * @param {string} color
     */
    strokeRect(position, dimension, color = 'rgb(0,0,0)')
    {
    }

    /**
     * @param {Vec2} position
     * @param {Vec2} dimension
     * @param {string} color
     */
    strokeCenteredRect(position, dimension, color = 'rgb(0,0,0)')
    {
        const halfDimension = dimension.multiplyScalar(0.5);

        this.strokeRect(
            position.subtract(halfDimension),
            dimension,
            color
        );
    }

    /**
     * @param {Vec2} position
     * @param {Vec2} dimension
     * @param {string} color
     */
    fillRect(position, dimension, color = 'rgb(0,0,0)')
    {
    }

    /**
     * @param {Vec2} position
     * @param {Vec2} dimension
     * @param {string} color
     */
    fillCenteredRect(position, dimension, color = 'rgb(0,0,0)')
    {
        const halDimension = dimension.multiplyScalar(0.5);

        this.fillRect(
            position.subtract(halDimension),
            dimension,
            color
        );
    }

    /**
     * @param {Vec2} from
     * @param {Vec2} to
     * @param {string} color
     */
    line(from, to, color = 'rgb(0,0,0)')
    {
    }

    /**
     * @param {CanvasImageSource|*} image
     * @param {Vec2} position
     * @param {number} width
     * @param {number} height
     */
    drawImage(image, position, width, height)
    {
    }
}

export class Canvas2D extends Canvas
{
    /**
     * @returns {DOMMatrix}
     */
    getTransform()
    {
        return this.context.getTransform();
    }

    clear()
    {
        this.fillRect(
            new Vec2(-this.halfScreenWidth, this.halfScreenHeight),
            new Vec2(this.screenWidth, -this.screenHeight),
            this.clearColor
        );
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    scale(x, y)
    {
        this.context.scale(x, y);
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    translate(x, y)
    {
        this.context.translate(x, y);
    }

    save()
    {
        this.context.save();
    }

    restore()
    {
        this.context.restore();
    }

    /**
     * @param {Vec2} position
     * @param {Vec2} dimension
     * @param {string} color
     */
    strokeRect(position, dimension, color = 'rgb(0,0,0)')
    {
        this.context.strokeStyle = color;
        this.context.strokeRect(
            position.x | 0,
            position.y | 0,
            dimension.x | 0,
            dimension.y | 0
        );
    }

    /**
     * @param {Vec2} position
     * @param {Vec2} dimension
     * @param {string} color
     */
    fillRect(position, dimension, color = 'rgb(0,0,0)')
    {
        this.context.fillStyle = color;
        this.context.fillRect(
            position.x | 0,
            position.y | 0,
            dimension.x | 0,
            dimension.y | 0
        );
    }

    /**
     * @param {Vec2} from
     * @param {Vec2} to
     * @param {string} color
     */
    line(from, to, color = 'rgb(0,0,0)')
    {
        this.context.strokeStyle = color;

        this.context.beginPath();
        this.context.moveTo(from.x | 0, from.y | 0);
        this.context.lineTo(to.x | 0, to.y | 0);
        this.context.stroke();
    }

    /**
     * @param {CanvasImageSource|*} image
     * @param {Vec2} position
     * @param {number} width
     * @param {number} height
     */
    drawImage(image, position, width, height)
    {
        this.context.drawImage(
            image,
            (position.x - width * 0.5) | 0,
            (position.y - height * 0.5) | 0,
            width,
            height
        );
    }
}