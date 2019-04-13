import { Rectangle } from "../geometry/rectangle";

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
    public abstract render(ctx: CanvasRenderingContext2D): void;

    abstract mouseMove(ev: MouseEvent): void;
    abstract click(ev: MouseEvent): void;
}