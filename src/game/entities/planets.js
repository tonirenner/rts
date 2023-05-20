import {Entity} from '../entity.js';

export class Planet extends Entity
{
    /**
     * @type {Image[]|*}
     */
    images = [];

    /**
     * @param {Player|*} player
     * @param {string} name
     */
    constructor(player, name)
    {
        super(player);

        this.images.push(new Image());
        this.images.push(new Image());
        this.images.push(new Image());

        this.images[0].src = `./assets/planets/${name}_256.png`;
        this.images[1].src = `./assets/planets/${name}_512.png`;
        this.images[2].src = `./assets/planets/${name}_768.png`;
    }

    render()
    {
        const image = this.images[this.player.universe.lod - 1];

        this.player.universe.canvas.drawImage(
            image,
            this.position,
            (image.width * 0.5) / this.player.universe.lod,
            (image.height * 0.5) / this.player.universe.lod
        );
    }
}