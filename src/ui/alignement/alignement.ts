import { HorizontalAlignementOption } from "./horizontalAlignementOption";
import { VerticalAlignementOption } from "./verticalAlignementOption";
import { Rectangle } from "../../geometry/rectangle";
import { Spacing } from "./spacing";

export class Alignement {
    public horizontalAlign = HorizontalAlignementOption.Center;

    public set verticalAlign(v: VerticalAlignementOption) {
        switch (v) {
            case VerticalAlignementOption.Bottom:
                this.verticalAlignmentRatio = 1;
                break;
            case VerticalAlignementOption.Center:
                this.verticalAlignmentRatio = 0.5;
                break;
            case VerticalAlignementOption.Top:
                this.verticalAlignmentRatio = 0;
                break;
        }
    }

    public verticalAlignmentRatio = VerticalAlignementOption.Center;

    public margin = new Spacing();
    // public padding = new Spacing();

    constructor() {
        this.verticalAlign = VerticalAlignementOption.Center;
    }

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
        return bounds.y
            + bounds.height * this.verticalAlignmentRatio
            - height * this.verticalAlignmentRatio
            + (this.verticalAlignmentRatio > 0.5 ? -this.margin.bottom : this.margin.top);
    }
}