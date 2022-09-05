import Entities from './entities.js';
import States from './states.js';
import Turrets from './turrets.js';
import {Distance, Vec2} from './coordinates.js';

class Vessel extends Entities.Unit
{
    /**
     * @type {boolean}
     */
    isSelected = false;

    /**
     * @param {Player|*} player
     */
    constructor(player)
    {
        super(player);
    }

    /**
     * @param {Vec2} destination
     */
    move(destination)
    {
        this.state = new MoveState(destination);
    }
}

class AttackVessel extends Vessel
{
    /**
     * @type {number}
     */
    shieldHealth;
    /**
     * @type {number}
     */
    armorHealth;
    /**
     * @type {number}
     */
    hullHealth;
    /**
     * @type {TurretGroup|*}
     */
    turrets;

    /**
     * @param {Player|*} player
     */
    constructor(player)
    {
        super(player);

        this.shieldHealth = this.maxShieldHealth();
        this.armorHealth  = this.maxArmorHealth();
        this.hullHealth   = this.maxHullHealth();
        this.turrets      = new Turrets.TurretGroup(player);
    }

    /**
     * @returns {number}
     */
    maxShieldHealth()
    {
        return 100;
    }

    /**
     * @returns {number}
     */
    maxArmorHealth()
    {
        return 100;
    }

    /**
     * @returns {number}
     */
    maxHullHealth()
    {
        return 100;
    }

    /**
     * @param {Turret|*} turret
     */
    mountTurret(turret)
    {
        this.turrets.add(turret);

        turret.mountedOn = this;
    }

    /**
     * @param {Entity|null} target
     */
    lockOnTarget(target)
    {
        this.turrets.lockOnTarget(target);
        this.state = new States.IdleState();
    }

    update()
    {
        super.update();
        this.turrets.update();
    }

    render()
    {
        if (this.isSelected) {
            this.player.universe.canvas.strokeCenteredRect(
                new Vec2(this.position.x, -this.position.y + 5),
                new Vec2(36, 48),
                'rgba(113,239,85, 0.5)'
            );
        }

        this.player.universe.canvas.strokeCenteredRect(
            new Vec2(this.position.x, -this.position.y),
            Vec2.fromScalar(20),
            this.player.color
        );

        this.shieldHealthBar(this.position, 12);
        this.armorHealthBar(this.position, 15);
        this.hullHealthBar(this.position, 18);

        if (this.player.universe.debug) {
            const bounds = this.bounds();
            this.player.universe.canvas.strokeCenteredRect(
                new Vec2(bounds.center.x, -bounds.center.y),
                bounds.dimension,
                'rgb(149,73,176)'
            );
        }

        this.state.render(this);
    }

    /**
     * @param {Vec2} position
     * @param {number} offset
     */
    shieldHealthBar(position, offset)
    {
        const shieldHealthBarWidth = (this.computeShieldHealthRatio() * 20) | 0;

        this.player.universe.canvas.fillRect(
            new Vec2(position.x - 10, -position.y + offset),
            new Vec2(shieldHealthBarWidth, 2),
            'rgb(50,50,250)'
        );
    }

    /**
     * @param {Vec2} position
     * @param {number} offset
     */
    armorHealthBar(position, offset)
    {
        const armorHealthBarWidth = (this.computeArmorHealthRatio() * 20) | 0;

        this.player.universe.canvas.fillRect(
            new Vec2(position.x - 10, -position.y + offset),
            new Vec2(armorHealthBarWidth, 2),
            'rgb(130,130,141)'
        );
    }

    /**
     * @param {Vec2} position
     * @param {number} offset
     */
    hullHealthBar(position, offset)
    {
        const hullHealthBarWidth = (this.computeHullHealthRatio() * 20) | 0;

        this.player.universe.canvas.fillRect(
            new Vec2(position.x - 10, -position.y + offset),
            new Vec2(hullHealthBarWidth, 2),
            'rgb(81,227,48)'
        );
    }

    /**
     * @returns {number}
     */
    computeShieldHealthRatio()
    {
        return parseFloat((this.shieldHealth / this.maxShieldHealth()).toFixed(2));
    }

    /**
     * @returns {number}
     */
    computeArmorHealthRatio()
    {
        return parseFloat((this.armorHealth / this.maxArmorHealth()).toFixed(2));
    }

    /**
     * @returns {number}
     */
    computeHullHealthRatio()
    {
        return parseFloat((this.hullHealth / this.maxHullHealth()).toFixed(2));
    }
}

class MoveState extends States.State
{
    /**
     * @type {Vec2}
     */
    destination;

    /**
     *
     * @param {Vec2} destination
     */
    constructor(destination)
    {
        super();

        this.destination = destination;
    }

    /**
     * @param {Vessel|Entity} entity
     */
    update(entity)
    {
        if (Distance.simple(entity.position, this.destination) < 1) {
            entity.state = new States.IdleState();
            return;
        }

        let velocityX = Math.ceil(this.destination.x - entity.position.x) / 10;
        let velocityY = Math.ceil(this.destination.y - entity.position.y) / 10;

        entity.position.x += velocityX;
        entity.position.y += velocityY;
    }

    /**
     * @param {Vessel|Entity} entity
     */
    render(entity)
    {
        entity.player.universe.canvas.line(
            new Vec2(entity.position.x, -entity.position.y),
            new Vec2(this.destination.x, -this.destination.y),
            'rgb(0,255,0)'
        );
    }
}

const Vessels = {
    Vessel,
    AttackVessel
};

export default Vessels;