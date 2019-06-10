import { Control } from "../control";
import { Point } from "../../../geometry/Point";
import { Rectangle } from "../../../geometry/rectangle";

export class CRectangle extends Control {
    mouseDown(ev: MouseEvent): void {
    }
    mouseUp(ev: MouseEvent): void {
    }
    public width = 100;
    public height = 100;
    public fillStyle = "black";
    public withBorder = false;

    public render = (ctx: CanvasRenderingContext2D): void => {
        ctx.save();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.bounds.x + this.bounds.width, this.bounds.y);
        ctx.lineTo(this.bounds.x + this.bounds.width, this.bounds.y + this.bounds.height);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        ctx.restore();
    }

    public align(ctx: CanvasRenderingContext2D, position: Point): void {
        this.bounds = new Rectangle(position.x - this.width / 2, position.y - this.height / 2, this.width, this.height);
    }
}