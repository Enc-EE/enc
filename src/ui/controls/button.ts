import { Rectangle } from "../../geometry/rectangle";
import { Control } from "./control";
import { Point } from "../../geometry/Point";

export class Button extends Control {
    public fontSize: number = 40;
    public text: string;

    public render = (ctx: CanvasRenderingContext2D) => {
        if (this.isMouseOver) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "black";
        }

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