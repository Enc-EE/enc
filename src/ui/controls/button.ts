import { Rectangle } from "../../geometry/rectangle";
import { Control } from "./control";
import { ButtonProperties } from "./buttonProperties";

export class Button extends Control {

    public properties = new ButtonProperties();
    public text: string = "";

    public render = (ctx: CanvasRenderingContext2D) => {
        if (this.properties.backgroundFillStyle) {
            ctx.fillStyle = this.properties.backgroundFillStyle;
            ctx.fillRect(this.dimensions.x, this.dimensions.y, this.dimensions.width, this.dimensions.height);
        }

        if (this.isMouseOver) {
            ctx.fillStyle = this.properties.mouseOverFillStyle;
        } else {
            ctx.fillStyle = this.properties.fillStyle;
        }

        ctx.font = this.properties.getFont();
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(this.text, this.dimensions.x, this.dimensions.y);
    }

    public updateLayout = (ctx: CanvasRenderingContext2D, bounds: Rectangle): void => {
        super.updateLayout(ctx, bounds);

        ctx.font = this.properties.getFont();
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        var size = ctx.measureText(this.text);
        
        var x = this.alignement.calculateDimensionsX(bounds, size.width);
        var y = this.alignement.calculateDimensionsY(bounds, this.properties.fontSize);
        
        this.dimensions = new Rectangle(x, y, size.width, this.properties.fontSize)
    }
}