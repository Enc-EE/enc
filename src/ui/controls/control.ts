import { RenderObject } from "../renderObject";
import { ECanvas } from "../eCanvas";
import { EEventT } from "../../eEvent";

export abstract class Control extends RenderObject {
    protected isMouseOver = false;
    public isEnabled = true;

    public clicked = new EEventT<Control>();

    public mouseMove(ev: MouseEvent) {
        if (this.isEnabled) {
            if (this.dimensions.isHitBy(ev.clientX, ev.clientY)) {
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
            if (this.dimensions.isHitBy(ev.clientX, ev.clientY)) {
                this.clicked.dispatchEvent(this);
            }
        }
    }

    public mouseDown(ev: MouseEvent): void { }
    public mouseUp(ev: MouseEvent): void { }
}