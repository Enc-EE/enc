import { LayoutView } from "./layoutControls/layoutView";
import { EAnimation } from "../eAnimation";
import { Label } from "./controls/label";
import { Rectangle } from "../geometry/rectangle";
import { HorizontalAlignementOption } from "./alignement/horizontalAlignementOption";
import { VerticalAlignementOption } from "./alignement/verticalAlignementOption";

export class FpsView extends LayoutView {
    private calcSeconds = 5;
    private refreshInterval = 1;
    private currentRefreshTime = 1;
    private frames: number[] = [];
    fpsLbl: Label;
    performanceLbl: Label;
    frameTimeLbl: Label;

    constructor(private animation: EAnimation) {
        super();
        this.fpsLbl = new Label();
        this.fpsLbl.text = "fps";
        this.fpsLbl.alignement.horizontalAlign = HorizontalAlignementOption.Right;
        this.fpsLbl.alignement.verticalAlign = VerticalAlignementOption.Top;
        this.children.push(this.fpsLbl);
        this.performanceLbl = new Label();
        this.performanceLbl.text = "perf";
        this.performanceLbl.alignement.horizontalAlign = HorizontalAlignementOption.Right;
        this.performanceLbl.alignement.verticalAlign = VerticalAlignementOption.Top;
        this.children.push(this.performanceLbl);
        this.frameTimeLbl = new Label();
        this.frameTimeLbl.text = "ft";
        this.frameTimeLbl.alignement.horizontalAlign = HorizontalAlignementOption.Right;
        this.frameTimeLbl.alignement.verticalAlign = VerticalAlignementOption.Top;
        this.children.push(this.frameTimeLbl);
        animation.addUpdateFunction(this.update);
    }

    private update = (timeDiff: number) => {
        this.frames.push(Date.now());
        
        if (this.currentRefreshTime <= 0) {
            var limit = Date.now() - this.calcSeconds * 1000;
            while (this.frames[0] <= limit) {
                this.frames.splice(0, 1);
            }
            this.fpsLbl.text = (this.frames.length / this.calcSeconds).toString();
            this.performanceLbl.text = (Math.round(this.animation.fpsPerformance * 100) / 100).toString();
            this.frameTimeLbl.text = (Math.round(this.animation.frameTime * 100) / 100).toString();
            this.currentRefreshTime = this.refreshInterval;
            this.triggerUpdateLayout();
        } else {
            this.currentRefreshTime = this.currentRefreshTime - timeDiff;
        }
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        super.updateLayout(ctx, bounds);
        this.fpsLbl.updateLayout(ctx, new Rectangle(bounds.x, bounds.y, bounds.width, bounds.height));
        this.performanceLbl.updateLayout(ctx, new Rectangle(bounds.x, bounds.y + this.fpsLbl.dimensions.height + 10, bounds.width, bounds.height));
        this.frameTimeLbl.updateLayout(ctx, new Rectangle(bounds.x, bounds.y + this.fpsLbl.dimensions.height + this.performanceLbl.dimensions.height + 20, bounds.width, bounds.height));
    }
}