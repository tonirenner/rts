import Entities from './entities.js';

class Planet extends Entities.Unit
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
            this.projectedPosition(),
            this.image.width * this.player.universe.origin.scale,
            this.image.height * this.player.universe.origin.scale
        );
    }
}

const Planets = {
    Planet
};

export default Planets;