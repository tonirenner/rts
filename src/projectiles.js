import Entities from './entities.js';
import States from './states.js';
import Commands from './commands.js';
import {Distance, Vec2} from './coordinates.js';

class TravelState extends States.State
{
    /**
     * @type {Vec2}
     */
    destination;

    /**
     * @type {number}
     */
    velocity;

    /**
     * @type {number}
     */
    travelingTime;

    /**
     *
     * @param {Vec2} destination
     * @param {number} velocity
     * @param {number} maxTravelingTime
     */
    constructor(destination, velocity, maxTravelingTime)
    {
        super();

        this.destination   = destination;
        this.velocity      = velocity;
        this.travelingTime = maxTravelingTime;
    }

    /**
     * @param {Projectile|Entity} entity
     */
    update(entity)
    {
        const target = this.lookupHit(entity);
        if (target) {
            entity.state = new States.IdleState();
            entity.player.dispatchCommand(new Commands.DestroyCommand(entity));

            if (target.armorHealth > 0) {
                target.armorHealth -= entity.damageToArmor();
                target.armorHealth = target.armorHealth < 1 ? 0 : target.armorHealth;
            } else if (target.hullHealth > 0) {
                target.hullHealth -= entity.damageToHull();
                target.hullHealth = target.hullHealth < 1 ? 0 : target.hullHealth;
            }

            if (target.hullHealth < 1) {
                entity.player.dispatchCommand(new Commands.DestroyCommand(target));
            }

            return;
        }

        const distance = Distance.simple(entity.position, this.destination);

        let velocityX = (this.destination.x - entity.position.x) / distance * this.velocity;
        let velocityY = (this.destination.y - entity.position.y) / distance * this.velocity;

        entity.position.x += velocityX | 0;
        entity.position.y += velocityY | 0;

        if (distance < 2) {
            entity.player.dispatchCommand(new Commands.DestroyCommand(entity));
            return;
        }

        if (this.travelingTime < 1) {
            entity.player.dispatchCommand(new Commands.DestroyCommand(entity));
            entity.state = new States.IdleState();
            return;
        }

        this.travelingTime--;
    }

    /**
     * @param {Projectile|Entity} entity
     */
    lookupHit(entity)
    {
        let hit;
        for (let i in entity.player.universe.players) {
            hit = entity.player.universe.players[i].units.findOneByCoordinates(entity.position);
            if (hit) {
                return hit;
            }
        }
        return null;
    }
}

class Projectile extends Entities.Entity
{
    /**
     * @param {Player|*} player
     */
    constructor(player)
    {
        super(player);
    }

    /**
     * @returns {number}
     */
    damageToShields()
    {
        return 0;
    }

    /**
     * @returns {number}
     */
    damageToArmor()
    {
        return 5;
    }

    /**
     * @returns {number}
     */
    damageToHull()
    {
        return 10;
    }

    /**
     * @param {Vec2} destination
     */
    travelDirection(destination)
    {
        this.state = new TravelState(destination, 10, 50);
    }

    render()
    {
        this.player.universe.canvas.strokeRect(
            new Vec2(this.position.x, -this.position.y),
            Vec2.fromScalar(1),
            'rgb(225,165,34)'
        );
    }
}

const Projectiles = {
    Projectile,
    TravelState
};

export default Projectiles;