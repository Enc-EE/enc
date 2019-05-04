import { AudioGraphNode } from "./audioGraphNode";

export class AudioGraphNodeStreamSource extends AudioGraphNode {
    source: MediaStreamAudioSourceNode;

    public getAudioNode = (): AudioNode => {
        return this.source;
    }

    public reload(): Promise<void> {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                .then((stream) => {
                    this.source = this.audioCtx.createMediaStreamSource(stream);
                    resolve();
                })
                .catch(function (err) {
                    alert("error1923012258")
                    reject();
                });
        });
    }
}