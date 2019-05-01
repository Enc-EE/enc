import { Rectangle } from "../../geometry/rectangle";
import { Control } from "./control";
import { Point } from "../../geometry/Point";

export class EImage extends Control {
    private image: HTMLImageElement;
    public scale = 1;
    private isLoaded = false;
    private shouldAlign = false;

    constructor(imageUrl: string) {
        super();
        this.image = new Image();
        this.image.src = imageUrl;
        this.image.onload = () => {
            this.isLoaded = true;
            this.shouldAlign = true;
        }
    }

    public render = (ctx: CanvasRenderingContext2D) => {
        if (this.shouldAlign) {
            this.align(ctx, new Point(this.bounds.x, this.bounds.y));
            this.shouldAlign = false;
        }

        ctx.drawImage(this.image, this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        if (this.isMouseOver && this.isEnabled) {
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        }
    }

    public align = (ctx: CanvasRenderingContext2D, position: Point) => {
        if (this.isLoaded) {
            var width = this.image.naturalWidth * this.scale;
            var height = this.image.naturalHeight * this.scale;
            this.bounds = new Rectangle(position.x - width / 2, position.y - height / 2, width, height);
        } else {
            this.bounds = new Rectangle(position.x, position.y, 0, 0);
        }
    }
}