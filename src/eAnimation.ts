import { EEvent } from "./eEvent";

export type UpdateFunction = (timeDiff: number) => void;

export class EAnimation {
    private updateFunctions: UpdateFunction[] = [];
    private isRunning = false;
    private lastFrameTime: number = 0;
    private fps: number = 30;
    private fpsInterval: number = 1000 / 30;
    private performanceWarningThreshold = 0.9;
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

    public fpsPerformance = 0;
    private updateFpsPerformance = true;

    private frameTimes: number[] = [];
    public frameTime: number = 0;
    private frameTimesCount = 60;
    private animationLoop = () => {
        var now = Date.now();
        var elapsed = now - this.lastFrameTime;

        if (elapsed > this.fpsInterval) {
            if (this.isRunning) {
                requestAnimationFrame(this.animationLoop);
            }
            this.lastFrameTime = now;
            if (this.updateFpsPerformance) {
                this.fpsPerformance = this.fpsInterval / elapsed;
                if (this.fpsPerformance < this.performanceWarningThreshold) {
                    console.log("Warning: low performance");
                    this.currentPerformanceWarningDelayRun++;
                    if (this.currentPerformanceWarningDelayRun > this.performanceWarningDelayRuns) {
                        this.lowPerformance.dispatchEvent();
                        this.currentPerformanceWarningDelayRun = 0;
                    }
                } else if (this.currentPerformanceWarningDelayRun > 0) {
                    this.currentPerformanceWarningDelayRun = 0;
                }
            }
            this.updateFpsPerformance = true

            var timeDiff = elapsed / 1000;

            for (const updateFunction of this.updateFunctions) {
                updateFunction(timeDiff);
            }
            var frameTime = Date.now() - now;
            this.frameTimes.push(frameTime);
            if (this.frameTimes.length > this.frameTimesCount) {
                this.frameTimes.splice(0, 1);
            }
            this.frameTime = this.frameTimes.reduce((x, y) => x + y) / this.frameTimes.length;
        } else { // request animation frame is faster then actual fps setting
            this.fpsPerformance = this.fpsInterval / elapsed;
            this.updateFpsPerformance = false
            setTimeout(() => {
                this.animationLoop();
            }, this.fpsInterval - elapsed);
        }
    }
}