import {IdleState, State} from '../state.js';
import {Entity} from '../entity.js';
import {Projectile} from './projectiles.js';
import {AttackVessel} from './vessel.js';
import {LunchProjectileCommand} from '../command.js';

export class AttackTarget extends State
{
    /**
     * @param {Turret|Entity} entity
     */
    update(entity)
    {
        if (!entity.isTargetAlive()) {
            this.state = new IdleState();
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

export class TurretGroup extends Entity
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

export class Turret extends Entity
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
        return new Projectile(this.player);
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
        if (this.target instanceof AttackVessel) {
            return this.target.hullHealth > 0;
        }

        return false;
    }

    shoot()
    {
        const projectile    = this.lunchProjectile();
        projectile.position = this.mountedOn.position.clone();
        projectile.travelDirection(this.target.position.clone());

        this.player.dispatchCommand(new LunchProjectileCommand(projectile));

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