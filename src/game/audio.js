import Queue from './queue.js';

export class AudioPlayer
{
    /**
     * @type {SpeechSynthesis}
     */
    speechSynthesis;
    /**
     * @type {SpeechSynthesisVoice[]}
     */
    voices = [];

    constructor()
    {
        this.speechSynthesis = window.speechSynthesis;
        setTimeout(() => this.voices = this.speechSynthesis.getVoices(), 1000);
    }

    /**
     * @param {SpeechSynthesisUtterance} message
     */
    message(message)
    {
        if (!(message instanceof SpeechSynthesisUtterance)) {
            throw new Error('message must be instance of SpeechSynthesisUtterance');
        }

        message.lang   = 'en-US';
        message.rate   = 1.1;
        message.volume = 0.2;
        message.voice  = this.voices[6];

        this.speechSynthesis.speak(message);
    }
}

export class AudioQueue extends Queue
{
}

export const AUDIO_COMMANDS = {
    MOVING_TO_POSITION: new SpeechSynthesisUtterance('moving to position'),
    TARGET_CONFIRMED:   new SpeechSynthesisUtterance('target confirmed')
};
