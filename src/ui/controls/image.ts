import { Rectangle } from "../../geometry/rectangle";
import { Control } from "./control";
import { ImageProperties } from "./imageProperties";
import { ImageScalingMode } from "./imageScalingMode";

export class EImage extends Control {
    private image: HTMLImageElement;
    public properties = new ImageProperties();

    constructor(image: HTMLImageElement) {
        super();
        this.image = image;
    }

    public static createFromUrl = (imageUrl: string): Promise<EImage> => {
        return new Promise((resolve, reject) => {
            var image = new Image();
            image.src = imageUrl;
            image.onload = () => {
                resolve(new EImage(image));
            }
        });
    }

    private superRender = this.render;
    public render = (ctx: CanvasRenderingContext2D) => {
        this.superRender(ctx);

        ctx.drawImage(this.image, this.dimensions.x, this.dimensions.y, this.dimensions.width, this.dimensions.height);
        if (this.isMouseOver && this.isEnabled) {
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.fillRect(this.dimensions.x, this.dimensions.y, this.dimensions.width, this.dimensions.height);
        }
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        super.updateLayout(ctx, bounds);

        var fitScale = 1;

        var imageSizing = this.image.naturalWidth / this.image.naturalHeight;
        var stageSizing = bounds.width / bounds.height;

        var isImageWider = imageSizing > stageSizing;

        switch (this.properties.imageScalingMode) {
            case ImageScalingMode.FitAndOverfill:
                if (isImageWider) {
                    fitScale = bounds.height / this.image.height;
                } else {
                    fitScale = bounds.width / this.image.width;
                }
                break;
            case ImageScalingMode.FitAndSpace:
                if (isImageWider) {
                    fitScale = bounds.width / this.image.width;
                } else {
                    fitScale = bounds.height / this.image.height;
                }
                break;
        }

        var width = this.image.naturalWidth * fitScale;
        var height = this.image.naturalHeight * fitScale;

        this.dimensions.x = this.alignement.calculateDimensionsX(bounds, width);
        this.dimensions.y = this.alignement.calculateDimensionsY(bounds, width);
        this.dimensions.width = width;
        this.dimensions.height = height;
    }
}