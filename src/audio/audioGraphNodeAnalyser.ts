import { AudioGraphNode } from "./audioGraphNode";

export class AudioGraphNodeAnalyser extends AudioGraphNode {
    analyserNode: AnalyserNode;
    bufferLength: number;
    dataArray: Uint8Array;

    public getAudioNode = (): AudioNode => {
        return this.analyserNode;
    }

    public reload(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.analyserNode) {
                this.analyserNode = this.audioCtx.createAnalyser();
            }
            this.analyserNode.fftSize = 32;
            this.analyserNode.smoothingTimeConstant = 0.9;
            this.bufferLength = this.analyserNode.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            resolve();
        });
    }

    public getSpectrum() {
        if (this.analyserNode) {
            this.analyserNode.getByteFrequencyData(this.dataArray);
            return this.dataArray;
        }
        return new Uint8Array(0);
    }

    public getWave() {
        if (this.analyserNode) {
            this.analyserNode.getByteTimeDomainData(this.dataArray);
            return this.dataArray;
        }
        return new Uint8Array(0);
    }
}