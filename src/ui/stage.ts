import { ECanvas } from "./eCanvas";
import { Rectangle } from "../geometry/rectangle";
import { LayoutView } from "./layoutControls/layoutView";

export class Stage {
    private view: LayoutView | undefined;
    private shouldUpdateLayout: boolean = false;
    private isTouchMode = false;

    constructor(private canvas: ECanvas) {
        canvas.addDrawFunction(this.render);
        canvas.resized.addEventListener(this.canvasResized);
        document.addEventListener("touchstart", this.touchMode);
        this.addMouseListeners();
    }

    private canvasResized = () => {
        this.shouldUpdateLayout = true;
    }

    private touchMode = (ev: TouchEvent) => {
        if (!this.isTouchMode) {
            console.log("switching to touch mode");
            ECanvas.cursorManipulation = false;
            this.isTouchMode = true;
            this.removeMouseListeners();
            this.addTouchListeners();
            document.body.addEventListener("mousedown", this.mouseMode);
            document.removeEventListener("touchstart", this.touchMode);
        }
    }

    private mouseMode = (ev: MouseEvent) => {
        if (this.isTouchMode) {
            console.log("switching to mouse mode");
            ECanvas.cursorManipulation = true;
            this.isTouchMode = false;
            this.addMouseListeners();
            this.removeTouchListeners();
            document.addEventListener("touchstart", this.touchMode);
            document.removeEventListener("mousedown", this.mouseMode);
        }
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
        if (this.view && width && height) {
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

    private removeMouseListeners() {
        document.removeEventListener("mouseup", this.mouseUp);
        document.removeEventListener("mousemove", this.mouseMove);
        document.removeEventListener("mousedown", this.mouseDown);
        document.removeEventListener("click", this.click);
    }

    private addMouseListeners() {
        document.addEventListener("mouseup", this.mouseUp);
        document.addEventListener("mousemove", this.mouseMove);
        document.addEventListener("mousedown", this.mouseDown);
        document.addEventListener("click", this.click);
    }

    private removeTouchListeners() {
        console.log("Waaaaaaah");
        
        // document.removeEventListener("touchend", this.mouseUp);
        // document.removeEventListener("touchmove", this.mouseMove);
        // document.removeEventListener("touchstart", this.click);
    }

    private addTouchListeners() {
        document.addEventListener("touchend", (touch) => { touch.preventDefault(); this.mouseUp(this.touchToMouse(touch)) });
        document.addEventListener("touchmove", (touch) => { if (touch.touches.length > 0) { this.mouseMove(this.touchToMouse(touch)) } });
        document.addEventListener("touchstart", (touch) => { if (touch.touches.length > 0) { this.click(this.touchToMouse(touch)); } });
    }

    private touchToMouse = (touchEvent: TouchEvent): MouseEvent => {
        if (touchEvent.touches.length > 0) {
            return {
                clientX: touchEvent.touches[0].clientX / this.canvas.dpr,
                clientY: touchEvent.touches[0].clientY / this.canvas.dpr,
                altKey: touchEvent.altKey,
                ctrlKey: true,
                shiftKey: touchEvent.shiftKey
            } as MouseEvent;
        } else {
            return {
                clientX: 0,
                clientY: 0,
                altKey: touchEvent.altKey,
                ctrlKey: true,
                shiftKey: touchEvent.shiftKey
            } as MouseEvent;
        }
    }
}