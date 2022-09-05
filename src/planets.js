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
        this.player.universe.canvas.drawImage(this.image, this.position);
    }
}

const Planets = {
    Planet
};

export default Planets;