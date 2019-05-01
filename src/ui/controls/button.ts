import { Rectangle } from "../../geometry/rectangle";
import { Control } from "./control";
import { ButtonProperties } from "./primitives/buttonProperties";

export class Button extends Control {

    public properties = new ButtonProperties();
    public text: string;

    public render = (ctx: CanvasRenderingContext2D) => {
        if (this.properties.backgroundFillStyle) {
            ctx.fillStyle = this.properties.backgroundFillStyle;
            ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        }

        if (this.isMouseOver) {
            ctx.fillStyle = this.properties.mouseOverFillStyle;
        } else {
            ctx.fillStyle = this.properties.fillStyle;
        }

        ctx.font = this.properties.fontSize + "px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(this.text, this.bounds.x, this.bounds.y);
    }

    public updateLayout = (ctx: CanvasRenderingContext2D, bounds: Rectangle): void => {
        super.updateLayout(ctx, bounds);

        ctx.font = this.properties.fontSize + "px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        var size = ctx.measureText(this.text);

        var x = this.alignement.calculateDimensionsX(bounds, size.width);
        var y = this.alignement.calculateDimensionsY(bounds, this.properties.fontSize);

        this.dimensions = new Rectangle(x, y, size.width, this.properties.fontSize)
    }
}