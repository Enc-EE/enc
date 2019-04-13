import { RenderObject } from "../renderObject";
import { Point } from "../../geometry/Point";
import { ECanvas } from "../eCanvas";
import { EEventT } from "../../eEvent";

export abstract class Control extends RenderObject {
    protected isMouseOver = false;
    public isEnabled = true;
    public clicked = new EEventT<Control>();

    public abstract align(ctx: CanvasRenderingContext2D, position: Point): void;

    public mouseMove = (ev: MouseEvent) => {
        if (this.isEnabled) {
            if (this.bounds.isHitBy(ev.clientX, ev.clientY)) {
                this.isMouseOver = true;
                ECanvas.SetCursor(this.name, true);
            } else {
                this.isMouseOver = false;
                ECanvas.SetCursor(this.name, false);
            }
        }
    }

    public click = (ev: MouseEvent) => {
        if (this.isEnabled) {
            if (this.bounds.isHitBy(ev.clientX, ev.clientY)) {
                this.clicked.dispatchEvent(this);
            }
        }
    }
}