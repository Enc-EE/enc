import { RenderObject } from "../renderObject";
import { Rectangle } from "../../geometry/rectangle";
import { Alignement } from "../alignement/alignement";

export abstract class LayoutView extends RenderObject {
    protected children: RenderObject[] = [];
    private shouldUpdateLayout = false;
    
    public alignement = new Alignement();

    public render(ctx: CanvasRenderingContext2D) {
        if (this.shouldUpdateLayout) {
            this.updateLayout(ctx, this.bounds);
            this.shouldUpdateLayout = false;
        }
        for (const child of this.children) {
            child.render(ctx);
        }
    };

    public abstract updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void;

    public triggerUpdateLayout = () => {
        this.shouldUpdateLayout = true;
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