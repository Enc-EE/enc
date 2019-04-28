import { ECanvas } from "./eCanvas";
import { Rectangle } from "../geometry/rectangle";
import { LayoutView } from "./layoutControls/layoutView";
import { EAnimation } from "../eAnimation";

export class Stage {
    private view: LayoutView;
    private shouldUpdateLayout: boolean;

    constructor(private canvas: ECanvas) {
        canvas.addDrawFunction(this.render);
        document.addEventListener("mousedown", this.mousedown);
        document.addEventListener("mouseup", this.mouseup);
        document.addEventListener("mousemove", this.mouseMove);
        document.addEventListener("click", this.click);
    }

    public static create(): Stage {
        var canvas = ECanvas.createFullScreen();
        var stage = new Stage(canvas);
        var animation = new EAnimation();
        animation.addUpdateFunction(canvas.draw);
        return stage;
    }

    private mousedown = (ev: MouseEvent) => {
        if (this.view) {
            this.view.mouseDown(ev);
        }
    }

    private mouseup = (ev: MouseEvent) => {
        if (this.view) {
            this.view.mouseUp(ev);
        }
    }

    private mouseMove = (ev: MouseEvent) => {
        if (this.view) {
            this.view.mouseMove(ev);
        }
    }

    private click = (ev: MouseEvent) => {
        if (this.view) {
            this.view.click(ev);
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