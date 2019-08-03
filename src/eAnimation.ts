import { EEvent } from "./eEvent";

export type UpdateFunction = (timeDiff: number) => void;

export class EAnimation {
    private updateFunctions: UpdateFunction[] = [];
    private isRunning = false;
    private lastFrameTime: number;
    private fps: number;
    private fpsInterval: number;
    private performanceWarningThreshold = 1.2;
    private performanceWarningDelayRuns = 8;
    private currentPerformanceWarningDelayRun = 0;

    public constructor() {
        this.setFps(30);
        this.play();
        document.addEventListener('keyup', (event) => {
            if (event.keyCode == 80) { // p
                this.playPause();
            }
        });
    }

    public lowPerformance: EEvent = new EEvent();

    public play() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastFrameTime = Date.now();
            this.animationLoop();
        }
    }

    public pause() {
        if (this.isRunning) {
            this.isRunning = false;
        }
    }

    public playPause() {
        this.isRunning ? this.pause() : this.play();
    }

    public addUpdateFunction = (func: UpdateFunction) => {
        this.updateFunctions.push(func);
    }

    public removeUpdateFunction = (func: UpdateFunction) => {
        this.updateFunctions.splice(this.updateFunctions.indexOf(func), 1);
    }

    public setFps = (fps: number) => {
        this.fps = fps;
        this.fpsInterval = 1000 / this.fps;
    }

    private animationLoop = () => {
        if (this.isRunning) {
            requestAnimationFrame(this.animationLoop);
        }

        var now = Date.now();
        var elapsed = now - this.lastFrameTime;

        if (elapsed > this.fpsInterval) {
            this.lastFrameTime = now;
            var timeDiff = elapsed / 1000;

            if ((elapsed / this.fpsInterval) - 1 > this.performanceWarningThreshold) {
                console.log("Warning: low performance");
                this.currentPerformanceWarningDelayRun++;
                if (this.currentPerformanceWarningDelayRun > this.performanceWarningDelayRuns) {
                    this.lowPerformance.dispatchEvent();
                    this.currentPerformanceWarningDelayRun = 0;
                }
            } else if (this.currentPerformanceWarningDelayRun > 0) {
                this.currentPerformanceWarningDelayRun = 0;
            }

            for (const updateFunction of this.updateFunctions) {
                updateFunction(timeDiff);
            }
        }
    }
}