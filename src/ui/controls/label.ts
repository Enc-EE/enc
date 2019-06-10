import { Control } from "./control";
import { Rectangle } from "../../geometry/rectangle";
import { LabelProperties } from "./labelProperties";

export class Label extends Control {
    public properties = new LabelProperties();

    public text: string;

    constructor() {
        super();
        this.disableMouseEvents();
    }

    public render = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = this.properties.fillStyle;
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
        console.log(this.dimensions);
    }
}