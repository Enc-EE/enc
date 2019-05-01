import { LayoutView } from "./layoutView";
import { Rectangle } from "../../geometry/rectangle";
import { HorizontalAlignementOption } from "../alignement/horizontalAlignementOption";
import { VerticalAlignementOption } from "../alignement/verticalAlignementOption";
import { RenderObject } from "../renderObject";

export class ListView extends LayoutView {
    public spacing = 30;

    public addItem = (layoutView: RenderObject) => {
        layoutView.alignement = this.alignement;
        this.children.push(layoutView);
        this.triggerUpdateLayout();
    }

    public removeItem = (layoutView: RenderObject) => {
        this.children.removeItem(layoutView);
        this.triggerUpdateLayout();
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        super.updateLayout(ctx, bounds);

        var x = this.alignement.calculateDimensionsX(bounds, this.dimensions.width);
        var y = this.alignement.calculateDimensionsY(bounds, this.dimensions.height);

        var width = 0;
        var height = 0;

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (i > 0) {
                y += this.spacing;
                height += this.spacing;
            }
            child.updateLayout(ctx, new Rectangle(x, y, 0, 0));
            y += child.dimensions.height;
            height += child.dimensions.height;
            width = Math.max(width, child.dimensions.width);
        }

        if (this.dimensions.x != x || this.dimensions.y != y || this.dimensions.width != width || this.dimensions.height != height) {
            this.dimensions.x = x;
            this.dimensions.y = y;
            this.dimensions.height = height;
            this.dimensions.width = width;
            this.updateLayout(ctx, new Rectangle(bounds.x, bounds.y, this.dimensions.width, this.dimensions.height));
        }
    }
}