import { Control } from "./control";
import { Point } from "../../geometry/Point";
import { Rectangle } from "../../geometry/rectangle";

export class Label extends Control {
    mouseDown(ev: MouseEvent): void {
    }
    mouseUp(ev: MouseEvent): void {
    }
    public fontSize: number = 30;
    public text: string;

    public render = (ctx: CanvasRenderingContext2D) => {
        ctx.font = this.fontSize + "px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(this.text, this.bounds.x, this.bounds.y);
    }

    public align = (ctx: CanvasRenderingContext2D, position: Point) => {
        ctx.font = this.fontSize + "px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        var size = ctx.measureText(this.text);
        this.bounds = new Rectangle(position.x - size.width / 2, position.y - this.fontSize / 2, size.width, this.fontSize);
    }
}