type soundID = 'click';

const soundIDs = ['click']

export class AudioManager {
    actx: AudioContext;
    buffers: { [bufferID: string]: AudioBuffer };

    muted: boolean;

    constructor() {
        this.actx = new AudioContext;

        this.muted = false;

        this.buffers = {};
    }

    async init() {

        this.actx.resume();

        this.buffers['noise'] = new AudioBuffer({
            length: this.actx.sampleRate / 2,
            sampleRate: this.actx.sampleRate
        })

        // This gives us the actual array that contains the data
        var nowBuffering = this.buffers['noise'].getChannelData(0);
        for (var i = 0; i < this.buffers['noise'].length; i++) {
            // Math.random() is in [0; 1.0]
            // audio needs to be in [-1.0; 1.0]
            nowBuffering[i] = Math.random() * 2 - 1;
        }

        for (let id of soundIDs) {
            this.buffers[id] = await this.actx.decodeAudioData(await (await fetch(`sounds/${id}.wav`)).arrayBuffer());
        }
    }

    play(soundID: soundID) {
        if (this.muted) return;
        const source = this.actx.createBufferSource();
        source.buffer = this.buffers[soundID];
        source.connect(this.actx.destination);
        source.start();
    }
}