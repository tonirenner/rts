import {IdleState, State} from '../state.js';
import {DestroyCommand} from '../command.js';
import {Distance, Vec2} from '../../coordinates.js';
import {Entity} from '../entity.js';

export class TravelState extends State
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
            entity.state = new IdleState();
            entity.player.dispatchCommand(new DestroyCommand(entity));

            if (target.armorHealth > 0) {
                target.armorHealth -= entity.damageToArmor();
                target.armorHealth = target.armorHealth < 1 ? 0 : target.armorHealth;
            } else if (target.hullHealth > 0) {
                target.hullHealth -= entity.damageToHull();
                target.hullHealth = target.hullHealth < 1 ? 0 : target.hullHealth;
            }

            if (target.hullHealth < 1) {
                entity.player.dispatchCommand(new DestroyCommand(target));
            }

            return;
        }

        const distance = Distance.simple(entity.position, this.destination);
        const angle    = entity.position.angle(this.destination);

        const ax = Math.cos(angle) * this.velocity;
        const ay = Math.sin(angle) * this.velocity;

        entity.position.x += ax;
        entity.position.y += ay;

        if (distance < 2) {
            entity.player.dispatchCommand(new DestroyCommand(entity));
            return;
        }

        if (this.travelingTime < 1) {
            entity.player.dispatchCommand(new DestroyCommand(entity));
            entity.state = new IdleState();
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

export class Projectile extends Entity
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
        this.state = new TravelState(destination, 5, 100);
    }

    render()
    {
        this.player.universe.canvas.strokeRect(
            new Vec2(this.position.x, this.position.y),
            Vec2.fromScalar(1),
            'rgb(225,165,34)'
        );
    }
}