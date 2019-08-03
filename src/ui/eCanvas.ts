import { EAnimation } from "../eAnimation";
import { EEvent } from "../eEvent";

export type DrawFunction = (ctx: CanvasRenderingContext2D, width?: number, height?: number) => void;

export class ECanvas {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private drawFunctions: DrawFunction[] = [];
    public dpr = 1;

    public get width(): number {
        return this.canvas.clientWidth / this.dpr;
    }

    public get height(): number {
        return this.canvas.clientHeight / this.dpr;
    }

    private dprScalingEnabled = false;
    public enableDprScaling = () => {
        this.dprScalingEnabled = true;
        this.resize();
    }
    public disableDprScaling = () => {
        this.dprScalingEnabled = false;
        this.resize();
    }

    public resized = new EEvent()

    private constructor() { }

    public static createFullScreen(): ECanvas {
        document.body.parentElement.style.height = "100%";
        document.body.style.height = "100%";
        document.body.style.margin = "0";
        document.body.style.overflow = "hidden";

        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        canvas.style.width = "100%"
        canvas.style.height = "100%";

        var enCanvas = new ECanvas();
        enCanvas.canvas = canvas;
        enCanvas.ctx = canvas.getContext('2d');
        window.addEventListener("resize", enCanvas.resize);
        enCanvas.resize();
        return enCanvas;
    }

    private static cursorLock: string = null;

    public static SetCursor = (name: string, pointer: boolean) => {
        if (pointer) {
            document.body.style.cursor = "pointer";
            ECanvas.cursorLock = name;
        } else if (name == ECanvas.cursorLock) {
            document.body.style.cursor = "default";
            ECanvas.cursorLock = null;
        }
    }

    public resize = () => {
        this.dpr = this.dprScalingEnabled ? window.devicePixelRatio || 1 : 1;

        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.resized.dispatchEvent();
    }

    public draw = () => {
        this.ctx.save();
        this.ctx.scale(this.dpr, this.dpr);
        for (const drawFunction of this.drawFunctions) {
            drawFunction(this.ctx, this.width, this.height);
        }
        this.ctx.restore();
    }

    public addDrawFunction = (func: DrawFunction) => {
        this.drawFunctions.push(func);
    }

    public removeDrawFunction = (func: DrawFunction) => {
        this.drawFunctions.splice(this.drawFunctions.indexOf(func), 1);
    }
}