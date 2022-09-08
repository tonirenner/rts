import {Vec2} from './coordinates.js';
import Queue from './queue.js';

class Command
{
}

class SelectCommand extends Command
{
    /**
     * @type {Vec2}
     */
    edgeTopLeft = new Vec2();

    /**
     * @type {Vec2}
     */
    edgeBottomRight = new Vec2();

    /**
     * @param {Vec2} edgeTopLeft
     * @param {Vec2} edgeBottomRight
     */
    constructor(edgeTopLeft, edgeBottomRight)
    {
        super();
        this.edgeTopLeft     = edgeTopLeft;
        this.edgeBottomRight = edgeBottomRight;
    }
}

class MoveCommand extends Command
{
    /**
     * @type {Entity}
     */
    entity;

    /**
     * @type {Vec2}
     */
    destination = new Vec2();

    /**
     * @param {Entity|*} entity
     * @param {Vec2} destination
     */
    constructor(entity, destination)
    {
        super();

        this.entity      = entity;
        this.destination = destination;
    }
}

class LockOnTargetCommand extends Command
{
    /**
     * @type {Entity}
     */
    entity;
    /**
     * @type {Entity}
     */
    target;

    /**
     * @param {Entity|*} entity
     * @param {Entity|*} target
     */
    constructor(entity, target)
    {
        super();

        this.entity = entity;
        this.target = target;
    }
}

class LunchProjectileCommand extends Command
{
    /**
     * @type {Projectile}
     */
    projectile;

    /**
     * @param {Projectile|*} projectile
     */
    constructor(projectile)
    {
        super();

        this.projectile = projectile;
    }
}

class DestroyCommand extends Command
{
    /**
     * @type {Entity}
     */
    entity;

    /**
     * @param {Entity|*} entity
     */
    constructor(entity)
    {
        super();

        this.entity = entity;
    }
}

class CommandQueue extends Queue
{
    /**
     * @param {Command} command
     */
    enqueue(command)
    {
        if (command instanceof Command) {
            super.enqueue(command);
            return;
        }

        throw new Error('instance of Command expected');
    }

    /**
     * @returns {Command}
     */
    dequeue()
    {
        return super.dequeue();
    }

    /**
     * @returns {Command}
     */
    peek()
    {
        return super.peek();
    }
}

const Commands = {
    CommandQueue,
    Command,
    MoveCommand,
    LockOnTargetCommand,
    LunchProjectileCommand,
    DestroyCommand
};

export default Commands;

