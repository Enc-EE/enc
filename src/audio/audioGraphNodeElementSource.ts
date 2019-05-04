import { AudioGraphNode } from "./audioGraphNode";
import { EEvent } from "../eEvent";

export class AudioGraphNodeElementSource extends AudioGraphNode {
    public url: string;
    public audioEnded = new EEvent();

    private source: MediaElementAudioSourceNode;
    private audio: HTMLAudioElement;

    constructor(name: string, audioCtx: AudioContext, url: string) {
        super(name, audioCtx);
        this.url = url;

        this.audio = document.createElement('audio');
        this.audio.controls = true;
        this.audio.src = this.url;
        this.audio.addEventListener("ended", this.audioEndedEvent);
    }

    private audioEndedEvent = () => {
        this.audioEnded.dispatchEvent();
    }

    public getAudioNode = (): AudioNode => {
        return this.source;
    }

    public reload(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.source) {
                this.source = this.audioCtx.createMediaElementSource(this.audio);
            }
            resolve();
        });
    }

    public play = () => {
        this.audio.play();
    }

    public pause = () => {
        this.audio.pause();
    }

    public stop = () => {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    public setUrl = (url: string) => {
        var play = !this.audio.paused;
        this.url = url;
        this.audio.src = url;
        this.audio.load();
        if (play) {
            this.audio.play();
        }
    }
}