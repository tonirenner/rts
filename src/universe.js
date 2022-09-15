import Entities from './entities.js';
import Commands from './commands.js';
import {EntityCommandDispatcher, UnitCommandDispatcher} from './command.dispatcher.js';
import {FloatingOrigin, Vec2} from './coordinates.js';
import Audio from './audio.js';

export class Player
{
    /**
     * @type {Universe}
     */
    universe;

    /**
     * @type {UnitGroup|*}
     */
    units;

    /**
     * @type {UnitGroup|*}
     */
    selectedUnits;

    /**
     * @type {string}
     */
    color = 'rgb(37,148,13)';

    /**
     * @param {Universe} universe
     */
    constructor(universe)
    {
        this.universe      = universe;
        this.units         = new Entities.UnitGroup(this);
        this.selectedUnits = new Entities.UnitGroup(this);
    }

    /**
     * @param {Commands.Command|*} command
     */
    dispatchCommand(command)
    {
        this.universe.dispatchCommand(command);
    }

    /**
     * @param {any} audio
     */
    dispatchAudio(audio)
    {
        this.universe.dispatchAudio(audio);
    }
}

export class Universe
{
    entityCommandDispatcher = new EntityCommandDispatcher();
    unitCommandDispatcher   = new UnitCommandDispatcher();

    /**+
     * @type {AudioPlayer|*}
     */
    audioPlayer = new Audio.AudioPlayer();

    /**
     * @type {AudioQueue|*}
     */
    audioQueue = new Audio.AudioQueue();

    /**
     * @type {CommandQueue|*}
     */
    commandQueue = new Commands.CommandQueue();

    /**
     * @type {Camera}
     */
    camera;

    /**
     * @type {EntityGroup|*}
     */
    entities;

    /**
     * @type {Canvas}
     */
    canvas;

    /**
     * @type {Player}
     */
    player;

    /**
     * @type {Player[]}
     */
    players = [];

    /**
     * @type {boolean}
     */
    debug = false;

    /**
     * @param {Canvas|*} canvas
     */
    constructor(canvas)
    {
        this.canvas   = canvas;
        this.entities = new Entities.EntityGroup();
    }

    /**
     * @param {Commands.Command|*} command
     */
    dispatchCommand(command)
    {
        this.commandQueue.enqueue(command);
    }

    /**
     * @param {any} audio
     */
    dispatchAudio(audio)
    {
        this.audioQueue.enqueue(audio);
    }

    update()
    {
        while (!this.audioQueue.isEmpty) {
            this.audioPlayer.message(this.audioQueue.dequeue());
        }

        let command;
        while (!this.commandQueue.isEmpty) {
            command = this.commandQueue.dequeue();

            this.entityCommandDispatcher.dispatchCommand(this.entities, command);

            if (this.player.selectedUnits.length > 0) {
                this.unitCommandDispatcher.dispatchCommand(this.player.selectedUnits, command);
            }

            if (this.player.units.contains(command.entity)) {
                this.unitCommandDispatcher.dispatchCommand(this.player.units, command);
            }

            for (let i in this.players) {
                if (!this.players[i].units.contains(command.entity)) {
                    continue;
                }
                this.unitCommandDispatcher.dispatchCommand(this.players[i].units, command);
            }
        }


        this.player.units.update();
        for (let i in this.players) {
            this.players[i].units.update();
        }

        this.entities.update();
    }

    render()
    {
        this.canvas.save();
        this.canvas.clear();
        this.camera.transform();

        this.entities.render();

        for (let i in this.players) {
            this.players[i].units.render();
        }

        this.player.units.render();


        this.canvas.restore();
    }
}
