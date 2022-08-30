import {Vec2} from './coordinates.js';

const KEEP_AWAY_RADIUS = 50;

class Formation
{
    /**
     * @param {UnitGroup} units
     * @param {Vec2} destination
     * @returns {Vec2[]}
     */
    computeDestinations(units, destination)
    {
        return [];
    }
}

class SquareFormation extends Formation
{
    /**
     * @param {UnitGroup} units
     * @param {Vec2} destination
     * @returns {Vec2[]}
     */
    computeDestinations(units, destination)
    {
        const maxRows      = Math.min(5, units.length);
        const distance     = KEEP_AWAY_RADIUS;
        const destinations = [];

        let maxX = 0;
        let maxY = 0;

        for (let x = 0; x < maxRows; x++) {
            let len = units.length / maxRows;
            for (let y = 0; y < len; y++) {

                const angle = Math.random() * Math.PI * 2;
                const _x    = (distance * x) + (Math.cos(angle) * KEEP_AWAY_RADIUS / 10);
                const _y    = (distance * y) + (Math.sin(angle) * KEEP_AWAY_RADIUS / 10);

                maxX = Math.max(maxX, _x);
                maxY = Math.max(maxY, _y);

                destinations.push(new Vec2(_x, _y));
            }
        }

        let position;
        for (let i in destinations) {
            position = destinations[i];
            position.x -= maxX / 2;
            position.y -= maxY / 2;

            position.x += destination.x;
            position.y += destination.y;
        }

        return destinations;
    }
}

const Formations = {
    Formation,
    SquareFormation
};

export default Formations;