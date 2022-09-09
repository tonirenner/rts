import Entities from './entities.js';

class Star extends Entities.Unit
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
            this.projectedPosition(),
            this.image.width * this.player.universe.origin.scale,
            this.image.height * this.player.universe.origin.scale
        );
    }
}

const Stars = {
    Star
};

export default Stars;