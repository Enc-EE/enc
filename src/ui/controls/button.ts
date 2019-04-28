import { Rectangle } from "../../geometry/rectangle";
import { Control } from "./control";
import { Point } from "../../geometry/Point";
import { ButtonProperties } from "./primitives/buttonProperties";
import { HorizontalAlignementOption } from "../alignement/horizontalAlignementOption";
import { VerticalAlignementOption } from "../alignement/verticalAlignementOption";

export class Button extends Control {
    public properties = new ButtonProperties();
    public text: string;
    public isVisible = true;

    public render = (ctx: CanvasRenderingContext2D) => {
        if (this.isVisible) {
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
    }

    public align = (ctx: CanvasRenderingContext2D, position: Point) => {
        ctx.font = this.properties.fontSize + "px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        var size = ctx.measureText(this.text);

        var bounds = new Rectangle(0, 0, size.width, this.properties.fontSize);
        console.log(this.alignement);
        
        switch (this.alignement.horizontalAlign) {
            case HorizontalAlignementOption.Left:
                bounds.x = position.x;
                break;
            case HorizontalAlignementOption.Center:
                bounds.x = position.x - size.width / 2;
                break;
            case HorizontalAlignementOption.Right:
                bounds.x = position.x - size.width;
                break;
        }
        switch (this.alignement.verticalAlign) {
            case VerticalAlignementOption.Top:
                bounds.y = position.y;
                break;
            case VerticalAlignementOption.Center:
                bounds.y = position.y - this.properties.fontSize / 2;
                break;
            case VerticalAlignementOption.Bottom:
                bounds.y = position.y - this.properties.fontSize;
                break;
        }
        this.bounds = bounds;
    }
}