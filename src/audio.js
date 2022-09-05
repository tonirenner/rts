export class Synthesizer
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
    play(message)
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

Synthesizer.COMMANDS = {
    movingToPosition: new SpeechSynthesisUtterance('moving to position'),
    targetConfirmed:  new SpeechSynthesisUtterance('target confirmed')
};