import { LayoutView } from "./layoutView";
import { Rectangle } from "../../geometry/rectangle";
import { RenderObject } from "../renderObject";
import { ListViewProperties } from "./listViewProperties";
import { HorizontalAlignementOption } from "../alignement/horizontalAlignementOption";
import { VerticalAlignementOption } from "../alignement/verticalAlignementOption";
import { Orientation } from "../alignement/orientation";

export class ListView extends LayoutView {
    public properties = new ListViewProperties();

    public get items() {
        return this.children;
    }

    public addItem = (layoutView: RenderObject) => {
        layoutView.alignement.horizontalAlign = HorizontalAlignementOption.Left;
        layoutView.alignement.verticalAlign = VerticalAlignementOption.Top;
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

        if (this.properties.orientation == Orientation.Vertical) {
            for (let i = 0; i < this.children.length; i++) {
                const child = this.children[i];
                if (i > 0) {
                    y += this.properties.itemSpacing;
                    height += this.properties.itemSpacing;
                }
                child.updateLayout(ctx, new Rectangle(x, y, 0, 0));
                y += child.dimensions.height;
                height += child.dimensions.height;
                width = Math.max(width, child.dimensions.width);
            }
        } else {
            for (let i = 0; i < this.children.length; i++) {
                const child = this.children[i];
                if (i > 0) {
                    x += this.properties.itemSpacing;
                    width += this.properties.itemSpacing;
                }
                child.updateLayout(ctx, new Rectangle(x, y, 0, 0));
                x += child.dimensions.width;
                width += child.dimensions.width;
                height = Math.max(height, child.dimensions.height);
            }
        }

        if (this.dimensions.x != x || this.dimensions.y != y || this.dimensions.width != width || this.dimensions.height != height) {
            this.dimensions.x = x;
            this.dimensions.y = y;
            this.dimensions.height = height;
            this.dimensions.width = width;
            this.updateLayout(ctx, bounds);
        }
    }
}