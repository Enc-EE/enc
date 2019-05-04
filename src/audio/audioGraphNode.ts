export abstract class AudioGraphNode {
    constructor(public name: string, protected audioCtx: AudioContext) { }

    public abstract getAudioNode(): AudioNode;
    public abstract reload(): Promise<void>;
}