import { AudioGraphNode } from "./audioGraphNode";

export class AudioGraphNodeDestination extends AudioGraphNode {
    public getAudioNode = (): AudioNode => {
        return this.audioCtx.destination;
    }

    public reload(): Promise<void> {
        return Promise.resolve();
    }
}