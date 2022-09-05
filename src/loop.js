export default class GameLoop
{
    /**
     * @type {number}
     */
    delta              = 0;
    /**
     * @type {number}
     */
    currentFrameCount  = 0;
    /**
     * @type {number}
     */
    lastFrameTimestamp = 0;
    /**
     * @type {number}
     */
    fpsUpdateTimestamp = 0;
    /**
     * @type {number}
     */
    fps                = 60;
    /**
     * @type {number}
     */
    fpsCut             = 0;
    /**
     * @type {number}
     */
    fpsMillisecondsCut = 0;
    /**
     * @type {number}
     */
    timeStep           = (1000 / 60) | 0;

    constructor()
    {
        this.cutFPSAt(30);
    }

    /**
     * @param {number} fps
     */
    cutFPSAt(fps)
    {
        this.fpsCut             = fps | 0;
        this.fpsMillisecondsCut = (1000 / this.fpsCut) | 0;
    }

    /**
     * @type {function}
     */
    onDraw = () => {
    };

    /**
     * @type {function}
     */
    onUpdate = () => {
    };

    /**
     * @type {function}
     */
    onStats = () => {
    };


    /**
     * @type {function}
     * @private
     */
    _loopCallback = this.loop.bind(this);

    start()
    {
        requestAnimationFrame(this._loopCallback);
    }

    /**
     * @param {number} timestamp
     */
    loop(timestamp)
    {
        if (timestamp < this.lastFrameTimestamp + this.fpsMillisecondsCut) {
            requestAnimationFrame(this._loopCallback);
            return;
        }

        this.delta += timestamp - this.lastFrameTimestamp;
        this.lastFrameTimestamp = timestamp;

        this._updateFrameStats(timestamp);
        this._updateGameState();

        this.onDraw();
        this.onStats();

        requestAnimationFrame(this._loopCallback);
    }

    /**
     * @param {number} timestamp
     * @private
     */
    _updateFrameStats(timestamp)
    {
        if (timestamp > this.fpsUpdateTimestamp + 1000) {
            this.fps = 0.25 * this.currentFrameCount + 0.75 * this.fps;

            this.fpsUpdateTimestamp = timestamp;
            this.currentFrameCount  = 0;
        }
        this.currentFrameCount++;
    }

    /**
     * @private
     */
    _updateGameState()
    {
        this.updateSteps = 0;
        while (this.delta >= this.timeStep) {
            this.onUpdate();
            this.delta -= this.timeStep;
            if (++this.updateSteps > 20) {
                this.delta = 0;
                break;
            }
        }
    }
}