import {DestroyCommand, LockOnTargetCommand, LunchProjectileCommand, MoveCommand} from '../command.js';
import {UnitGroup} from '../unit.js';

export class EntityCommandDispatcher
{
    /** @type {Universe} */
    universe;

    /**
     * @param {Universe|*} universe
     */
    constructor(universe)
    {
        this.universe = universe;
    }

    /**
     * @param {Command|*} command
     */
    dispatchCommand(command)
    {
        if (command instanceof LunchProjectileCommand) {
            this.universe.add(command.projectile);
        }

        if (command instanceof DestroyCommand) {
            this.universe.remove(command.projectile);
        }
    }
}

export class UnitCommandDispatcher
{
    /** @type {Universe} */
    universe;

    /**
     * @param {Universe|*} universe
     */
    constructor(universe)
    {
        this.universe = universe;
    }

    /**
     * @param {Command|*} command
     */
    dispatchCommand(command)
    {
        const {entity} = command;

        if (entity instanceof UnitGroup) {
            switch (true) {
                case command instanceof LockOnTargetCommand: {
                    entity.forEach(unit => unit.lockOnTarget(command.target));
                    break;
                }
            }
            return;
        }

        switch (true) {
            case command instanceof MoveCommand: {
                entity.move(command.destination);
                break;
            }
            case command instanceof DestroyCommand: {
                this.universe.remove(entity);
                break;
            }
        }
    }
}