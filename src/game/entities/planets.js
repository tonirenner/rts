import {Entity} from '../entity.js';

export class Planet extends Entity
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
        this.image.src = './assets/planet01.png';
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