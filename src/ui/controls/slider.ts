import { Control } from "./control";
import { Point } from "../../geometry/point";
import { Rectangle } from "../../geometry/rectangle";
import { EEventT } from "../../eEvent";

export class Slider extends Control {
    public radius: number = 10;

    public minValue = 0;
    public maxValue = 100;
    public currentValue = 50;
    isDragging: boolean;
    oldPosition: { x: number; y: number; };

    public valueChanged = new EEventT<number>();

    constructor() {
        super();
    }

    public render(ctx: CanvasRenderingContext2D): void {
        var x = this.dimensions.x;
        var y = this.dimensions.y;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + this.radius, y + this.dimensions.height / 2);
        ctx.lineTo(x + this.dimensions.width - this.radius, y + this.dimensions.height / 2);
        ctx.stroke();

        var relValue = (this.currentValue - this.minValue) / (this.maxValue - this.minValue);
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(x + this.radius + (this.dimensions.width - this.radius * 2) * relValue, y + this.dimensions.height / 2, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    public updateLayout = (ctx: CanvasRenderingContext2D, bounds: Rectangle): void => {
        super.updateLayout(ctx, bounds);

        this.dimensions = new Rectangle(bounds.x, bounds.y, 200, this.radius * 2);
    }

    public mouseDown = (ev: MouseEvent) => {
        if (this.dimensions.isHitBy(ev.clientX, ev.clientY)) {
            this.isDragging = true;
            this.updateCurrentValue(ev);
        }
    }
    public mouseUp = (ev: MouseEvent) => {
        this.isDragging = false;
    }

    public mouseMove(ev: MouseEvent) {
        super.mouseMove(ev);
        if (this.isDragging) {
            this.updateCurrentValue(ev);
        }
    }

    private updateCurrentValue(ev: MouseEvent) {
        var val = ev.clientX - this.dimensions.x - this.radius;
        val = val / (this.dimensions.width - this.radius * 2) * (this.maxValue - this.minValue) + this.minValue;
        if (val > this.maxValue) {
            val = this.maxValue;
        }
        if (val < this.minValue) {
            val = this.minValue;
        }
        this.currentValue = val;
        this.valueChanged.dispatchEvent(this.currentValue);
    }
}