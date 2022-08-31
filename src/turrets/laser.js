import Turrets from '../turrets.js';
import Projectiles from '../projectiles.js';
import States from '../states.js';
import Commands from '../commands.js';
import {Vec2} from '../coordinates.js';

class BeamState extends States.State
{
    /**
     * @type {Turret}
     */
    turret;

    /**
     * @type {Vec2}
     */
    destination;

    /**
     * @type {number}
     */
    beamDuration;

    /**
     * @param {LaserTurret|*} turret
     * @param {Vec2} destination
     */
    constructor(turret, destination)
    {
        super();

        this.turret      = turret;
        this.destination = destination;

        this.beamDuration = turret.minBeamDuration();
    }

    /**
     * @param {LaserBeamProjectile|Entity} entity
     */
    update(entity)
    {
        this.beamDuration--;

        const target = this.lookupHit(entity);
        if (!target) {
            entity.player.dispatchCommand(new Commands.DestroyCommand(entity));
            return;
        }

        if (this.beamDuration < 1) {
            entity.player.dispatchCommand(new Commands.DestroyCommand(entity));
        }

        if (target.shieldHealth > 0) {
            target.shieldHealth -= entity.damageToShields();
            target.shieldHealth = target.shieldHealth < 1 ? 0 : target.shieldHealth;
        } else if (target.armorHealth > 0) {
            target.armorHealth -= entity.damageToArmor();

            target.armorHealth = target.armorHealth < 1 ? 0 : target.armorHealth;
        } else if (target.hullHealth > 0) {
            target.hullHealth -= entity.damageToHull();
            target.hullHealth = target.hullHealth < 1 ? 0 : target.hullHealth;
        }

        if (target.hullHealth < 1) {
            entity.player.dispatchCommand(new Commands.DestroyCommand(target));
        }
    }

    /**
     * @param {LaserBeamProjectile|Entity} entity
     */
    render(entity)
    {
        entity.player.universe.canvas.line(
            new Vec2(entity.position.x, -entity.position.y),
            new Vec2(this.destination.x, -this.destination.y),
            'rgba(0,127,255, 0.6)'
        );
    }

    /**
     * @param {Vessel|Entity} entity
     *
     * @param entity
     * @returns {Unit|Entity|null}
     */
    lookupHit(entity)
    {
        let hit;
        for (let i in entity.player.universe.players) {
            hit = entity.player.universe.players[i].units.findOneByCoordinates(this.destination);
            if (hit) {
                return hit;
            }
        }
        return null;
    }
}

class LaserBeamProjectile extends Projectiles.Projectile
{
    /**
     * @type {Turret}
     */
    turret;

    /**
     * @param {Player|*} player
     * @param {Turret|*} turret
     */
    constructor(player, turret)
    {
        super(player);

        this.turret = turret;
    }

    damageToShields()
    {
        return 0.5;
    }

    damageToArmor()
    {
        return 2;
    }

    damageToHull()
    {
        return 6;
    }

    /**
     * @param {Vec2} destination
     */
    travelDirection(destination)
    {
        this.state = new BeamState(this.turret, destination);
    }

    render()
    {
        this.state.render(this);
    }
}


export default class LaserTurret extends Turrets.Turret
{
    /**
     * @param {Player|*} player
     */
    constructor(player)
    {
        super(player);

        this.state = new Turrets.IdleState();
    }

    /**
     * @returns {number}
     */
    minCoolDown()
    {
        return 240;
    }

    /**
     * @returns {number}
     */
    minBeamDuration()
    {
        return 30;
    }

    /**
     * @returns {LaserBeamProjectile|*}
     */
    lunchProjectile()
    {
        return new LaserBeamProjectile(this.player, this);
    }
}