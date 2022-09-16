import {EntityCommandDispatcher, UnitCommandDispatcher} from './command/dispatcher.js';
import {AudioPlayer, AudioQueue} from './audio.js';
import {CommandQueue} from './command.js';
import {Scene} from '../canvas/object.js';

export default class Universe
{
    /** @type {EntityCommandDispatcher} */
    entityCommandDispatcher = new EntityCommandDispatcher(this);

    /** @type {UnitCommandDispatcher} */
    unitCommandDispatcher = new UnitCommandDispatcher(this);

    /** @type {AudioPlayer} */
    audioPlayer = new AudioPlayer();

    /** @type {AudioQueue} */
    audioQueue = new AudioQueue();

    /** @type {CommandQueue} */
    commandQueue = new CommandQueue();

    /** @type {Camera} */
    camera;

    /** @type {Scene} */
    scene;

    /** @type {Canvas} */
    canvas;

    /** @type {Player} */
    player;

    /** @type {Player[]} */
    players = [];

    /** @type {boolean} */
    debug = false;

    /**
     * @param {Canvas|*} canvas
     */
    constructor(canvas)
    {
        this.canvas = canvas;
        this.scene  = new Scene();
    }

    /**
     * @param {Object2D|*} object
     */
    add(object)
    {
        this.scene.add(object);
    }

    /**
     * @param {Object2D|*} object
     */
    remove(object)
    {
        this.scene.remove(object);

        if (this.player.units.contains(object)) {
            this.player.units.remove(object);
        }

        for (let i in this.players) {
            if (!this.players[i].units.contains(object)) {
                continue;
            }
            this.players[i].units.remove(object);
        }
    }

    /**
     * @param {Command|*} command
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
        this.processAudioQueue();
        this.processCommandQueue();
        this.scene.update();
    }

    render()
    {
        this.canvas.save();
        this.canvas.clear();
        this.camera.transform();
        this.scene.render();
        this.canvas.restore();
    }

    processAudioQueue()
    {
        while (!this.audioQueue.isEmpty) {
            this.audioPlayer.message(this.audioQueue.dequeue());
        }
    }

    processCommandQueue()
    {
        let command;
        while (!this.commandQueue.isEmpty) {
            command = this.commandQueue.dequeue();

            this.entityCommandDispatcher.dispatchCommand(command);

            if (this.player.selectedUnits.length > 0) {
                this.unitCommandDispatcher.dispatchCommand(command);
            }

            if (this.player.units.contains(command.entity)) {
                this.unitCommandDispatcher.dispatchCommand(command);
            }

            for (let i in this.players) {
                this.unitCommandDispatcher.dispatchCommand(command);
            }
        }
    }
}
