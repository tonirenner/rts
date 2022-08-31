import {Vec2} from './coordinates.js';

class Canvas
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
        this.screen  = screen;
        this.context = screen.getContext('2d');
    }

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
            new Vec2(-this.halfScreenWidth, -this.halfScreenHeight),
            new Vec2(this.screenWidth, this.screenHeight),
            this.clearColor
        );
    }

    /**
     * @param {number} scale
     * @param {Vec2} offset
     */
    resize(scale = 1, offset = new Vec2())
    {
        this.screen.width  = this.screenWidth;
        this.screen.height = this.screenHeight;

        this.transform(scale, offset);

        this.clear();
    }

    /**
     * @param {number} scale
     * @param {Vec2} offset
     */
    transform(scale, offset)
    {
        this.context.setTransform();

        const transform = this.context.getTransform();
        this.context.setTransform(
            transform.a,
            transform.b,
            transform.c,
            transform.d,
            this.halfScreenWidth,   // dx
            this.halfScreenHeight    // dy
        );

        this.context.scale(scale, scale);
        this.context.translate(offset.x, offset.y);
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
            position.x,
            position.y,
            dimension.x,
            dimension.y
        );
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
        this.context.fillStyle = color;
        this.context.fillRect(
            position.x,
            position.y,
            dimension.x,
            dimension.y
        );
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
        this.context.strokeStyle = color;

        this.context.beginPath();
        this.context.moveTo(from.x, from.y);
        this.context.lineTo(to.x, to.y);
        this.context.stroke();
    }

    /**
     * @param {CanvasImageSource|*} image
     * @param {Vec2} position
     */
    drawImage(image, position)
    {
        this.context.drawImage(
            image,
            (position.x - image.width * 0.5) | 0,
            (position.y - image.height * 0.5) | 0
        );
    }
}

const GraphicsDevice = {
    Canvas
};

export default GraphicsDevice;