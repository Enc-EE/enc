import { RenderObject } from "../renderObject";

export abstract class LayoutView extends RenderObject {
    protected children: RenderObject[] = [];

    public render(ctx: CanvasRenderingContext2D) {
        super.render(ctx);
        for (const child of this.children) {
            child.render(ctx);
        }
    };

    public mouseDown(ev: MouseEvent) {
        for (const child of this.children) {
            child.mouseDown(ev);
        }
    }

    public mouseUp(ev: MouseEvent) {
        for (const child of this.children) {
            child.mouseUp(ev);
        }
    }

    public mouseMove(ev: MouseEvent) {
        for (const child of this.children) {
            child.mouseMove(ev);
        }
    }

    public click(ev: MouseEvent) {
        for (const child of this.children.toList()) {
            child.click(ev);
        }
    }
}