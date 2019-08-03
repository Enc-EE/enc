import { ECanvas } from "./eCanvas";
import { Rectangle } from "../geometry/rectangle";
import { LayoutView } from "./layoutControls/layoutView";
import { EAnimation } from "../eAnimation";

export class Stage {
    private view: LayoutView;
    private shouldUpdateLayout: boolean;
    private isTouchMode = false;

    constructor(private canvas: ECanvas) {
        canvas.addDrawFunction(this.render);
        canvas.resized.addEventListener(this.canvasResized);
        document.addEventListener("click", this.click);
        document.addEventListener("touchstart", this.touchMode);
        document.addEventListener("mousedown", this.mouseDown);
        document.addEventListener("mouseup", this.mouseUp);
        document.addEventListener("mousemove", this.mouseMove);
    }

    private canvasResized = () => {
        this.shouldUpdateLayout = true;
    }

    private touchMode = (ev: TouchEvent) => {
        if (!this.isTouchMode) {
            this.isTouchMode = true;
            document.removeEventListener("mouseup", this.mouseUp);
            document.removeEventListener("mousemove", this.mouseMove);
            document.removeEventListener("mousedown", this.mouseDown);
            document.addEventListener("mousedown", this.mouseMode);
            document.removeEventListener("touchstart", this.touchMode);
        }
    }
    
    private mouseMode = (ev: TouchEvent) => {
        if (this.isTouchMode) {
            this.isTouchMode = false;
            document.addEventListener("mouseup", this.mouseUp);
            document.addEventListener("mousemove", this.mouseMove);
            document.addEventListener("mousedown", this.mouseDown);
            document.addEventListener("touchstart", this.touchMode);
            document.removeEventListener("mousedown", this.mouseMode);
        }
    }

    private mouseDown = (ev: MouseEvent) => {
        if (this.view) {
            // console.log("hi");

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