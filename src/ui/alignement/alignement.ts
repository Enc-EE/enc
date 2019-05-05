import { HorizontalAlignementOption } from "./horizontalAlignementOption";
import { VerticalAlignementOption } from "./verticalAlignementOption";
import { Rectangle } from "../../geometry/rectangle";
import { Spacing } from "./spacing";

export class Alignement {
    public horizontalAlign = HorizontalAlignementOption.Center;
    public verticalAlign = VerticalAlignementOption.Center;

    public margin = new Spacing();
    // public padding = new Spacing();

    public calculateDimensionsX = (bounds: Rectangle, width: number) => {
        switch (this.horizontalAlign) {
            case HorizontalAlignementOption.Left:
                return bounds.x + this.margin.left;
            case HorizontalAlignementOption.Center:
                return bounds.x + bounds.width / 2 - width / 2;
            case HorizontalAlignementOption.Right:
                return bounds.x + bounds.width - width - this.margin.right;
        }
    }

    public calculateDimensionsY = (bounds: Rectangle, height: number) => {
        switch (this.verticalAlign) {
            case VerticalAlignementOption.Top:
                return bounds.y + this.margin.top;
            case VerticalAlignementOption.Center:
                return bounds.y + bounds.height / 2 - height / 2;
            case VerticalAlignementOption.Bottom:
                return bounds.y + bounds.height - height - this.margin.bottom;
        }
    }
}