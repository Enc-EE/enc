import { LayoutView } from "./layoutView";
import { Control } from "../controls/control";
import { Point } from "../../geometry/Point";
import { Rectangle } from "../../geometry/rectangle";

export class ListView extends LayoutView {
    public spacing = 30;

    public get items(): Control[] {
        return this.children as Control[];
    }
    public set items(v: Control[]) {
        this.children = v;
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        var count = this.items.length;
        if (count > 0) {
            var x = bounds.width / 2;
            for (let i = 0; i < count; i++) {
                var y = bounds.height / 2 - this.spacing * (count - 1) / 2 + i * this.spacing;
                this.items[i].align(ctx, new Point(x, y));
            }
        }
    }
}