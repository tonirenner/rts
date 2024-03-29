import {HealthBar} from '../drawable/indicator.js';
import {Unit} from '../unit.js';
import {IdleState, State} from '../state.js';
import {Distance2, Vec2} from '../../math.js';
import {TurretGroup} from './turrets.js';
import {Rectangle} from '../../canvas/shapes.js';

export class Vessel extends Unit
{
    /** @type {boolean} */
    isSelected = false;

    /** @type {number} */
    depth = 1;

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
    maxVelocity()
    {
        return 1;
    }

    /**
     * @returns {number}
     */
    acceleration()
    {
        return 0.01;
    }

    /**
     * @param {Vec2} destination
     */
    move(destination)
    {
        this.state = new MoveState(destination, this.acceleration(), this.maxVelocity());
    }
}

export class AttackVessel extends Vessel
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
     * @type {Rectangle|*}
     */
    ship;

    /**
     * @type {Rectangle|*}
     */
    box;

    /**
     * @param {Player|*} player
     */
    constructor(player)
    {
        super(player);

        this.shieldHealth = this.maxShieldHealth();
        this.armorHealth  = this.maxArmorHealth();
        this.hullHealth   = this.maxHullHealth();
        this.turrets      = new TurretGroup(player);

        this.ship      = new Rectangle();
        this.box       = new Rectangle();
        this.shieldBar = new HealthBar(this.maxShieldHealth(), new Vec2(-5, -10));
        this.armorBar  = new HealthBar(this.maxArmorHealth(), new Vec2(-5, -12));
        this.hullBar   = new HealthBar(this.maxHullHealth(), new Vec2(-5, -14));

        this.box.color      = 'rgba(113,239,85, 0.5)';
        this.armorBar.color = 'rgb(130,130,141)';
        this.hullBar.color  = 'rgb(81,227,48)';
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
        this.state = new IdleState();
    }

    update()
    {
        const position = this.position.clone();

        this.ship.position  = position.clone();
        this.ship.dimension = Vec2.fromScalar(10);
        this.ship.color     = this.isSelected ? 'rgba(131,243,107,0.9)' : this.player.color;

        this.shieldBar.position = position.clone();
        this.armorBar.position  = position.clone();
        this.hullBar.position   = position.clone();
        this.shieldBar.health   = this.shieldHealth;
        this.armorBar.health    = this.armorHealth;
        this.hullBar.health     = this.hullHealth;

        super.update();

        this.turrets.update();
        this.shieldBar.update();
        this.armorBar.update();
        this.hullBar.update();
    }

    render()
    {
        this.player.universe.canvas.drawRectangleCentered(this.ship);
        this.player.universe.canvas.drawRectangle(this.shieldBar);
        this.player.universe.canvas.drawRectangle(this.armorBar);
        this.player.universe.canvas.drawRectangle(this.hullBar);

        if (this.player.universe.debug) {
            const bounds = this.bounds();
            this.player.universe.canvas.strokeCenteredRect(
                bounds.center,
                bounds.dimension,
                'rgb(149,73,176)'
            );
        }

        this.state.render(this);
    }
}

class MoveState extends State
{
    /**
     * @type {Vec2}
     */
    destination;
    /**
     * @type {number}
     */
    acceleration;
    /**
     * @type {number}
     */
    maxVelocity;
    /**
     * @type {Vec2}
     */
    velocity = new Vec2();

    /**
     *
     * @param {Vec2} destination
     * @param {number} acceleration
     * @param {number} maxVelocity
     */
    constructor(destination, acceleration, maxVelocity)
    {
        super();

        this.destination  = destination;
        this.acceleration = acceleration;
        this.maxVelocity  = maxVelocity;
    }

    /**
     * @param {Vessel|Entity} entity
     */
    update(entity)
    {
        if (Distance2.simple(entity.position, this.destination) < 5) {
            entity.state = new IdleState();
            return;
        }

        const angle = entity.position.angle(this.destination);

        if (this.velocity.median() < this.maxVelocity) {
            this.velocity.x += Math.cos(angle) * this.acceleration;
            this.velocity.y += Math.sin(angle) * this.acceleration;
        }

        entity.position.x += this.velocity.x;
        entity.position.y += this.velocity.y;
    }

    /**
     * @param {Vessel|Entity} entity
     */
    render(entity)
    {
        entity.player.universe.canvas.line(
            new Vec2(entity.position.x, entity.position.y),
            new Vec2(this.destination.x, this.destination.y),
            'rgb(0,255,0)'
        );
    }
}