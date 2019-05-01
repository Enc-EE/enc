import { Rectangle } from "../geometry/rectangle";
import { Alignement } from "./alignement/alignement";

export abstract class RenderObject {
    private static idCounter = 0;
    private generateNewId = () => {
        RenderObject.idCounter++;
        return RenderObject.idCounter;
    }

    constructor() {
        this.id = this.generateNewId();
        this.name = "object " + this.id;
    }

    public id: number;
    public name: string;
    public tag: any;

    public bounds: Rectangle = new Rectangle(0, 0, 0, 0);
    public dimensions: Rectangle = new Rectangle(0, 0, 0, 0);

    public alignement = new Alignement();

    private shouldUpdateLayout = false;

    public render(ctx: CanvasRenderingContext2D) {
        if (this.shouldUpdateLayout) {
            this.updateLayout(ctx, this.bounds);
            this.shouldUpdateLayout = false;
        }
    };

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle) {
        this.bounds = bounds;
    }

    public triggerUpdateLayout = () => {
        this.shouldUpdateLayout = true;
    }

    abstract mouseDown(ev: MouseEvent): void;
    abstract mouseUp(ev: MouseEvent): void;
    abstract mouseMove(ev: MouseEvent): void;
    abstract click(ev: MouseEvent): void;
}