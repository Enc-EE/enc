import { Control } from "../control";
import { Point } from "../../../geometry/Point";
import { Rectangle } from "../../../geometry/rectangle";

export class Circle extends Control {
    public radius: number = 20;

    public render = (ctx: CanvasRenderingContext2D) => {
        if (this.isMouseOver) {
            ctx.fillStyle = "rgba(255,255,255,0.5)";
        } else {
            ctx.fillStyle = "rgba(255,255,255,0.2)";
        }

        ctx.beginPath();
        ctx.arc(this.bounds.x + this.radius, this.bounds.y + this.radius, this.radius, 0, Math.PI * 2);

        ctx.fill();
        ctx.closePath();
    }

    public align(ctx: CanvasRenderingContext2D, position: Point): void {
        this.bounds = new Rectangle(position.x - this.radius, position.y - this.radius, this.radius * 2, this.radius * 2);
    }
}