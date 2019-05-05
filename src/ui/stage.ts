import { ECanvas } from "./eCanvas";
import { Rectangle } from "../geometry/rectangle";
import { LayoutView } from "./layoutControls/layoutView";
import { EAnimation } from "../eAnimation";

export class Stage {
    private view: LayoutView;
    private shouldUpdateLayout: boolean;

    constructor(private canvas: ECanvas) {
        canvas.addDrawFunction(this.render);
        canvas.resized.addEventListener(this.canvasResized);
        document.addEventListener("mousedown", this.mouseDown);
        document.addEventListener("mouseup", this.mouseUp);
        document.addEventListener("mousemove", this.mouseMove);
        document.addEventListener("click", this.click);
    }

    private canvasResized = () => {
        this.shouldUpdateLayout = true;
    }

    private mouseDown = (ev: MouseEvent) => {
        if (this.view) {
            this.view.mouseDown({
                clientX: ev.clientX / this.canvas.dpr,
                clientY: ev.clientY / this.canvas.dpr,
                altKey: ev.altKey,
                ctrlKey: ev.ctrlKey,
                shiftKey: ev.shiftKey
            } as MouseEvent);
        }
    }

    private mouseUp = (ev: MouseEvent) => {
        if (this.view) {
            this.view.mouseUp({
                clientX: ev.clientX / this.canvas.dpr,
                clientY: ev.clientY / this.canvas.dpr,
                altKey: ev.altKey,
                ctrlKey: ev.ctrlKey,
                shiftKey: ev.shiftKey
            } as MouseEvent);
        }
    }

    private mouseMove = (ev: MouseEvent) => {
        if (this.view) {
            this.view.mouseMove({
                clientX: ev.clientX / this.canvas.dpr,
                clientY: ev.clientY / this.canvas.dpr,
                altKey: ev.altKey,
                ctrlKey: ev.ctrlKey,
                shiftKey: ev.shiftKey
            } as MouseEvent);
        }
    }

    private click = (ev: MouseEvent) => {
        if (this.view) {
            this.view.click({
                clientX: ev.clientX / this.canvas.dpr,
                clientY: ev.clientY / this.canvas.dpr,
                altKey: ev.altKey,
                ctrlKey: ev.ctrlKey,
                shiftKey: ev.shiftKey
            } as MouseEvent);
        }
    }

    private render = (ctx: CanvasRenderingContext2D, width?: number, height?: number) => {
        if (this.view) {
            if (this.shouldUpdateLayout) {
                this.view.updateLayout(ctx, new Rectangle(0, 0, width, height));
                this.shouldUpdateLayout = false;
            }
            ctx.clearRect(0, 0, width, height);
            this.view.render(ctx);
        }
    }

    public setView = (view: LayoutView) => {
        this.view = view;
        this.shouldUpdateLayout = true;
    }
}