import Entities from '../entities.js';
import States from '../states.js';
import Turrets from '../turrets/turrets.js';
import {Distance, Vec2} from '../coordinates.js';
import GraphicsDevice from '../graphics.device.js';
import {HealthBar} from '../drawable/indicator.js';

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
     * @type {GraphicsDevice.Rectangle|*}
     */
    ship;

    /**
     * @type {GraphicsDevice.Rectangle|*}
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
        this.turrets      = new Turrets.TurretGroup(player);

        this.ship      = new GraphicsDevice.Rectangle();
        this.box       = new GraphicsDevice.Rectangle();
        this.shieldBar = new HealthBar(this.maxShieldHealth(), new Vec2(-10, -12));
        this.armorBar  = new HealthBar(this.maxArmorHealth(), new Vec2(-10, -15));
        this.hullBar   = new HealthBar(this.maxHullHealth(), new Vec2(-10, -18));

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
        this.state = new States.IdleState();
    }

    update()
    {
        super.update();
        this.turrets.update();
    }

    render()
    {
        const scale    = this.player.universe.origin.scale;
        const position = this.position.clone();

        if (this.isSelected) {
            this.box.position.x  = position.x;
            this.box.position.y  = position.y - 5;
            this.box.dimension.x = 36;
            this.box.dimension.y = 48;
            this.box.scale(scale);
            this.player.universe.canvas.drawRectangleCentered(this.box);
        }

        this.ship.position  = position.clone();
        this.ship.dimension = Vec2.fromScalar(20);
        this.ship.color     = this.player.color;

        this.shieldBar.position = position.clone();
        this.armorBar.position  = position.clone();
        this.hullBar.position   = position.clone();
        this.shieldBar.health   = this.shieldHealth;
        this.armorBar.health    = this.armorHealth;
        this.hullBar.health     = this.hullHealth;

        this.shieldBar.update();
        this.armorBar.update();
        this.hullBar.update();
        this.ship.scale(scale);
        this.shieldBar.scale(scale);
        this.armorBar.scale(scale);
        this.hullBar.scale(scale);

        this.player.universe.canvas.drawRectangleCentered(this.ship);
        this.player.universe.canvas.drawRectangle(this.shieldBar);
        this.player.universe.canvas.drawRectangle(this.armorBar);
        this.player.universe.canvas.drawRectangle(this.hullBar);

        if (this.player.universe.debug) {
            const bounds = this.bounds();
            this.player.universe.canvas.strokeCenteredRect(
                bounds.center.multiplyScalar(scale),
                bounds.dimension.multiplyScalar(scale),
                'rgb(149,73,176)'
            );
        }

        this.state.render(this);
    }
}

class MoveState extends States.State
{
    /**
     * @type {Vec2}
     */
    destination;

    /**
     * @type {Vec2}
     */
    velocity = new Vec2();

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
        const scale       = entity.player.universe.origin.scale;
        const position    = entity.projectedPosition();
        const destination = this.destination.multiplyScalar(entity.player.universe.origin.scale);

        if (Distance.simple(position, destination) < 5) {
            entity.state = new States.IdleState();
            return;
        }

        const angle = position.angle(destination);

        this.velocity.x += Math.cos(angle) * 0.01;
        this.velocity.y += Math.sin(angle) * 0.01;

        entity.position.x += this.velocity.x;
        entity.position.y += this.velocity.y;
    }

    /**
     * @param {Vessel|Entity} entity
     */
    render(entity)
    {
        const position    = entity.projectedPosition();
        const destination = this.destination.multiplyScalar(entity.player.universe.origin.scale);

        entity.player.universe.canvas.line(
            new Vec2(position.x, position.y),
            new Vec2(destination.x, destination.y),
            'rgb(0,255,0)'
        );
    }
}

const Vessels = {
    Vessel,
    AttackVessel
};

export default Vessels;