import { RenderObject } from "./renderObject";
import { Rectangle } from "../geometry/rectangle";

export class QuickDrawView extends RenderObject {
    mouseDown(ev: MouseEvent): void {
    }
    mouseUp(ev: MouseEvent): void {
    }
    public bounds: Rectangle = new Rectangle(0, 0, 0, 0);

    constructor(renderMethod: (ctx: CanvasRenderingContext2D, bounds: Rectangle) => void) {
        super();
        this.renderMethod = renderMethod;
    }

    public renderMethod: (ctx: CanvasRenderingContext2D, bounds: Rectangle) => void;

    public render = (ctx: CanvasRenderingContext2D): void => {
        this.renderMethod(ctx, this.bounds);
    }

    mouseMove(ev: MouseEvent): void {
    }
    click(ev: MouseEvent): void {
    }
}