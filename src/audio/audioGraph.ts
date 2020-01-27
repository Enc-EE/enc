import { AudioGraphNode } from "./audioGraphNode";
import { AudioGraphNodeAnalyser } from "./audioGraphNodeAnalyser";
import { AudioGraphNodeDestination } from "./audioGraphNodeDestination";
import { AudioGraphNodeElementSource } from "./audioGraphNodeElementSource";
import { AudioGraphNodeStreamSource } from "./audioGraphNodeStreamSource";
import { EEventT } from "../eEvent";

export class AudioGraph {
    public audioCtx: AudioContext;

    // private sourceNode: AudioGraphNode<AudioNode>;
    // private analyzerNode: AudioGraphNodeAnalyser;

    // remove generic T?
    private audioNodes: AudioGraphNode[] = [];

    public destinationNode: AudioGraphNode;

    constructor() {
        this.audioCtx = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
        if (!this.audioCtx) {
            alert("It seems that your device doesn't support Web Audio API")
        }
        this.audioCtx.addEventListener("statechange", this.audioContextStateChangedEvaluator);
        if (this.audioCtx.state === "suspended") {
            document.addEventListener("click", this.documentClick);
            console.log("Audio context is suspended. Click the dom to make it running.");
        }
        this.destinationNode = new AudioGraphNodeDestination("destination", this.audioCtx);
    }

    public addMediaElementSource = (name: string, url: string) => {
        var sourceNode = new AudioGraphNodeElementSource(name, this.audioCtx, url);
        this.audioNodes.push(sourceNode);
        return sourceNode;
    }

    public addAnalyzer = (name: string) => {
        var analyzerNode = new AudioGraphNodeAnalyser(name, this.audioCtx);
        this.audioNodes.push(analyzerNode);
        return analyzerNode;
    }

    public getAudioGraphNode = (name: string) => {
        return this.audioNodes.first(x => x.name == name);
    }

    // public playUrl = (url: string) => {
    //     this.sourceNode = new AudioGraphNodeElementSource(this.audioCtx, url);
    //     if (this.audioCtx.state === "running") {
    //         this.buildGraph();
    //     }
    // }

    // public playStream = () => {
    //     this.sourceNode = new AudioGraphNodeStreamSource(this.audioCtx);
    //     if (this.audioCtx.state === "running") {
    //         this.buildGraph();
    //     }
    // }

    public audioContextStateChanged = new EEventT<string>();

    private documentClick = () => {
        if (this.audioCtx.state === "suspended") {
            this.audioCtx.resume();
            document.removeEventListener("click", this.documentClick);
        }
    }

    private audioContextStateChangedEvaluator = () => {
        if (this.audioCtx.state === "running") {
            console.log("audio context state changed");

            this.audioCtx.removeEventListener("statechange", this.audioContextStateChangedEvaluator);
            this.reload()
                .then(() => {
                    this.audioContextStateChanged.dispatchEvent(this.audioCtx.state);
                });
        }
    }

    public reload = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            console.log("realoading audio graph");
            Promise.all(this.audioNodes.map(x => x.reload()))
                .then(() => {
                    console.log("reloaded audio graph");
                    for (let i = 0; i < this.audioNodes.length; i++) {
                        const audioNode = this.audioNodes[i];
                        var subAudioNode = audioNode.getAudioNode()
                        if (subAudioNode) {
                            subAudioNode.disconnect();

                            if (i < this.audioNodes.length - 1) {
                                var x = this.audioNodes[i + 1].getAudioNode()
                                if (x) {
                                    subAudioNode.connect(x);
                                }
                            } else {
                                var y = this.destinationNode.getAudioNode()
                                if (y) {
                                    subAudioNode.connect(y);
                                }
                            }
                        }
                    }
                    resolve();
                });
        });
    }

    // private buildGraph() {
    //     console.log("Building audio graph.");

    //     if (this.sourceNode.getAudioNode()) {
    //         this.sourceNode.getAudioNode().disconnect();
    //         this.analyzerNode.getAudioNode().disconnect();
    //         this.destinationNode.getAudioNode().disconnect();
    //         this.sourceNode.getAudioNode().connect(this.analyzerNode.getAudioNode());
    //         this.analyzerNode.getAudioNode().connect(this.destinationNode.getAudioNode());
    //     } else {
    //         console.log("Audio source not available. Waiting some time.");
    //         setTimeout(() => {
    //             this.buildGraph();
    //         }, 1000);
    //     }
    // }

    // public getSpectrum() {
    //     return this.analyzerNode.getSpectrum();
    // }

    // public getWave() {
    //     return this.analyzerNode.getWave();
    // }
}