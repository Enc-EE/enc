import { HorizontalAlignementOption } from "./horizontalAlignementOption";
import { VerticalAlignementOption } from "./verticalAlignementOption";
import { Rectangle } from "../../geometry/rectangle";

export class Alignement {
    public horizontalAlign = HorizontalAlignementOption.Center;
    public verticalAlign = VerticalAlignementOption.Center;

    public calculateDimensionsX = (bounds: Rectangle, width: number) => {
        switch (this.horizontalAlign) {
            case HorizontalAlignementOption.Left:
                return bounds.x;
            case HorizontalAlignementOption.Center:
                return bounds.x + bounds.width / 2 - width / 2;
            case HorizontalAlignementOption.Right:
                return bounds.x + bounds.width - width;
        }
    }

    public calculateDimensionsY = (bounds: Rectangle, height: number) => {
        switch (this.horizontalAlign) {
            case HorizontalAlignementOption.Left:
                return bounds.y;
            case HorizontalAlignementOption.Center:
                return bounds.y + bounds.height / 2 - height / 2;
            case HorizontalAlignementOption.Right:
                return bounds.y + bounds.height - height;
        }
    }
}