import Commands from './commands.js';
import Entities from './entities.js';

export class EntityCommandDispatcher
{
    /**
     * @param {EntityGroup|*} entities
     * @param {Command|*} command
     */
    dispatchCommand(entities, command)
    {
        if (command instanceof Commands.LunchProjectileCommand) {
            entities.add(command.projectile);
        }

        if (command instanceof Commands.DestroyCommand) {
            entities.remove(command.entity);
        }
    }
}

export class UnitCommandDispatcher
{
    /**
     * @param {UnitGroup|*} units
     * @param {Command|*} command
     */
    dispatchCommand(units, command)
    {
        const {entity} = command;

        if (entity instanceof Entities.UnitGroup) {
            switch (true) {
                case command instanceof Commands.LockOnTargetCommand: {
                    entity.forEach(unit => unit.lockOnTarget(command.target));
                    break;
                }
            }
            return;
        }

        switch (true) {
            case command instanceof Commands.MoveCommand: {
                entity.move(command.destination);
                break;
            }
            case command instanceof Commands.DestroyCommand: {
                units.remove(entity);
                break;
            }
        }
    }
}