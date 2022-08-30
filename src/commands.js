import {Vec2} from './coordinates.js';

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

class Queue
{
    /**
     * @type {{}}
     */
    commands = {};

    /**
     * @type {number}
     */
    head = 0;

    /**
     * @type {number}
     */
    tail = 0;

    get length()
    {
        return this.tail - this.head;
    }

    get isEmpty()
    {
        return this.length === 0;
    }

    /**
     * @param {Command} command
     */
    enqueue(command)
    {
        if (command instanceof Command) {
            this.commands[this.tail] = command;
            this.tail++;
            return;
        }

        throw new Error('instance of Command expected');
    }

    /**
     * @returns {Command}
     */
    dequeue()
    {
        const item = this.commands[this.head];
        delete this.commands[this.head];
        this.head++;

        return item;
    }

    /**
     * @returns {Command}
     */
    peek()
    {
        return this.commands[this.head];
    }
}

const Commands = {
    Queue,
    Command,
    MoveCommand,
    LockOnTargetCommand,
    LunchProjectileCommand,
    DestroyCommand
};

export default Commands;

