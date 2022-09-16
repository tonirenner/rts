import {Entity} from '../entity.js';

export default class Star extends Entity
{
    /**
     * @type {Image|*}
     */
    image;

    /**
     * @param {Player|*} player
     */
    constructor(player)
    {
        super(player);

        this.image     = new Image();
        this.image.src = './assets/star.png';
    }

    render()
    {
        this.player.universe.canvas.drawImage(
            this.image,
            this.position,
            this.image.width,
            this.image.height
        );
    }
}