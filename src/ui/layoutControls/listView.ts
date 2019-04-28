import { LayoutView } from "./layoutView";
import { Control } from "../controls/control";
import { Point } from "../../geometry/Point";
import { Rectangle } from "../../geometry/rectangle";
import { HorizontalAlignementOption } from "../alignement/horizontalAlignementOption";
import { VerticalAlignementOption } from "../alignement/verticalAlignementOption";

export class ListView extends LayoutView {
    public spacing = 30;

    private controls: Control[] = [];
    private layoutViews: LayoutView[] = [];

    public addControl = (control: Control) => {
        control.alignement = this.alignement;
        this.controls.push(control);
        this.children.push(control);
        this.triggerUpdateLayout();
    }

    public removeControl = (control: Control) => {
        this.controls.removeItem(control);
        this.children.removeItem(control);
        this.triggerUpdateLayout();
    }

    public addLayoutView = (layoutView: LayoutView) => {
        layoutView.alignement = this.alignement;
        this.layoutViews.push(layoutView);
        this.children.push(layoutView);
        this.triggerUpdateLayout();
    }

    public removeLayoutView = (layoutView: LayoutView) => {
        this.layoutViews.removeItem(layoutView);
        this.children.removeItem(layoutView);
        this.triggerUpdateLayout();
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        var x = 0;
        switch (this.alignement.horizontalAlign) {
            case HorizontalAlignementOption.Left:
                x = bounds.x;
                break;
            case HorizontalAlignementOption.Center:
                x = bounds.x - bounds.width / 2;
                break;
            case HorizontalAlignementOption.Right:
                x = bounds.x - bounds.width;
                break;
        }
        this.bounds.x = x;

        var y = 0;
        switch (this.alignement.verticalAlign) {
            case VerticalAlignementOption.Top:
                y = bounds.y;
                break;
            case VerticalAlignementOption.Center:
                y = bounds.y - bounds.height / 2;
                break;
            case VerticalAlignementOption.Bottom:
                y = bounds.y - bounds.height;
                break;
        }
        this.bounds.y = y;

        var width = 0;
        var height = 0;

        for (const child of this.children) {
            if (this.children.indexOf(child) > 0) {
                y += this.spacing;
                height += this.spacing;
            }
            if (this.controls.contains(child as Control)) {
                var control = child as Control;
                console.log(y);
                
                control.align(ctx, new Point(x, y))
                y += control.bounds.height;
                height += control.bounds.height;
                width = Math.max(width, control.bounds.width);
            }
            else if (this.layoutViews.contains(child as LayoutView)) {
                var layoutView = child as LayoutView;
                layoutView.updateLayout(ctx, new Rectangle(x, y, 0, 0));
                y += layoutView.bounds.height;
                height += control.bounds.height;
                width = Math.max(width, layoutView.bounds.width);
            }
            else {
                throw new Error("Error: 280420191625");
            }
        }

        if (height != this.bounds.height || width != this.bounds.width) {
            this.bounds.height = height;
            this.bounds.width = width;
            this.updateLayout(ctx, new Rectangle(bounds.x, bounds.y, this.bounds.width, this.bounds.height));
        }
    }
}