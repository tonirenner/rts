import Entities from '../entities.js';
import States from '../states.js';
import Projectiles from '../projectiles.js';
import Vessels from '../vessel/vessel.js';
import Commands from '../commands.js';

class IdleState extends States.IdleState
{
}

class AttackTarget extends States.State
{
    /**
     * @param {Turret|Entity} entity
     */
    update(entity)
    {
        if (!entity.isTargetAlive()) {
            this.state = new States.IdleState();
            return;
        }

        if (!entity.inCombatRange()) {
            return;
        }

        if (!entity.canShoot()) {
            return;
        }

        entity.shoot();
        console.log('shoot');
    }
}

class TurretGroup extends Entities.Entity
{
    /**
     * @type {Turret|Entity[]}
     */
    turrets = [];

    /**
     * @param {Player|*} player
     */
    constructor(player)
    {
        super(player);
    }

    /**
     * @param {Turret|*} turret
     */
    add(turret)
    {
        this.turrets.push(turret);
    }

    /**
     * @param {Entity|null} target
     */
    lockOnTarget(target)
    {
        for (let i in this.turrets) {
            this.turrets[i].lockOnTarget(target);
        }
    }

    update()
    {
        for (let i in this.turrets) {
            this.turrets[i].update();
        }
    }

    render()
    {
        for (let i in this.turrets) {
            this.turrets[i].render();
        }
    }
}

class Turret extends Entities.Entity
{
    /**
     * @type {Entity|*}
     */
    mountedOn;
    /**
     * @type {number}
     */
    coolDown;
    /**
     * @type {Entity|null}
     */
    target;

    /**
     * @param {Player|*} player
     */
    constructor(player)
    {
        super(player);

        this.state    = new IdleState();
        this.coolDown = this.minCoolDown();
    }

    /**
     * @returns {number}
     */
    minCoolDown()
    {
        return 160;
    }

    /**
     * @returns {Projectile|*}
     */
    lunchProjectile()
    {
        return new Projectiles.Projectile(this.player);
    }

    /**
     * @returns {boolean}
     */
    canShoot()
    {
        if (this.coolDown > 1) {
            this.coolDown--;
            return false;
        }

        return true;
    }

    /**
     * @returns {boolean}
     */
    inCombatRange()
    {
        return true;
    }

    /**
     * @returns {boolean}
     */
    isTargetAlive()
    {
        if (this.target instanceof Vessels.AttackVessel) {
            return this.target.hullHealth > 0;
        }

        return false;
    }

    shoot()
    {
        const projectile    = this.lunchProjectile();
        projectile.position = this.mountedOn.position.clone();
        projectile.travelDirection(this.target.position.clone());

        this.player.dispatchCommand(new Commands.LunchProjectileCommand(projectile));

        this.coolDown = this.minCoolDown();
    }

    /**
     * @param {Entity|null} target
     */
    lockOnTarget(target)
    {
        this.target = target;
        this.state  = new AttackTarget();
    }
}

const Turrets = {
    Turret,
    TurretGroup,
    IdleState
};

export default Turrets;
