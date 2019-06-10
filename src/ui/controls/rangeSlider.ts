import { Control } from "./control";
import { Rectangle } from "../../geometry/rectangle";
import { EEventTT } from "../../eEvent";

export class RangeSlider extends Control {
    public radius: number = 10;

    public minValue = 0;
    public maxValue = 100;
    public currentValueLow = 25;
    public currentValueHigh = 75;
    public minDiff = 0.1;

    private isDraggingLow: boolean;
    private isDraggingHigh: boolean;

    public valuesChanged = new EEventTT<number, number>();

    constructor() {
        super();
    }


    public render = (ctx: CanvasRenderingContext2D): void => {
        var x = this.dimensions.x;
        var y = this.dimensions.y;

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + this.radius, y + this.dimensions.height / 2);
        ctx.lineTo(x + this.dimensions.width - this.radius, y + this.dimensions.height / 2);
        ctx.stroke();

        ctx.fillStyle = "blue";
        var sliderY = y + this.dimensions.height / 2;

        var relValueLow = (this.currentValueLow - this.minValue) / (this.maxValue - this.minValue);
        var lowX = x + this.radius + (this.dimensions.width - this.radius * 2) * relValueLow;

        var relValueHigh = (this.currentValueHigh - this.minValue) / (this.maxValue - this.minValue);
        var highX = x + this.radius + (this.dimensions.width - this.radius * 2) * relValueHigh;

        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lowX, sliderY);
        ctx.lineTo(highX, sliderY);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(lowX, sliderY, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(highX, sliderY, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    public updateLayout = (ctx: CanvasRenderingContext2D, bounds: Rectangle): void => {
        super.updateLayout(ctx, bounds);

        this.dimensions = new Rectangle(bounds.x, bounds.y, 200, this.radius * 2);
    }

    public mouseDown = (ev: MouseEvent) => {
        if (this.dimensions.isHitBy(ev.clientX, ev.clientY)) {
            var val = this.getClickedValue(ev);
            var diffToLow = Math.abs(this.currentValueLow - val);
            var diffToHigh = Math.abs(this.currentValueHigh - val);

            if (diffToLow == diffToHigh) {
                if (val < this.currentValueLow) {
                    this.isDraggingLow = true;
                } else {
                    this.isDraggingHigh = true;
                }
            }
            else if (diffToLow > diffToHigh) {
                this.isDraggingHigh = true;
            }
            else {
                this.isDraggingLow = true;
            }

            this.updateCurrentValues(ev);
        }
    }
    public mouseUp = (ev: MouseEvent) => {
        this.isDraggingHigh = false;
        this.isDraggingLow = false;
    }

    public mouseMove(ev: MouseEvent) {
        super.mouseMove(ev);
        if (this.isDraggingHigh || this.isDraggingLow) {
            this.updateCurrentValues(ev);
        }
    }

    private updateCurrentValues(ev: MouseEvent) {
        var val = this.getClickedValue(ev);

        if (this.isDraggingLow) {
            if (val > (this.currentValueHigh - this.minDiff)) {
                val = this.currentValueHigh - this.minDiff;
            }
        }
        else {
            if (val < this.currentValueLow + this.minDiff) {
                val = this.currentValueLow + this.minDiff;
            }
        }

        if (this.isDraggingLow) {
            this.currentValueLow = val;
        }
        else {
            this.currentValueHigh = val;
        }
        this.valuesChanged.dispatchEvent(this.currentValueLow, this.currentValueHigh);
    }

    private getClickedValue(ev: MouseEvent) {
        var val = ev.clientX - this.dimensions.x - this.radius;
        val = val / (this.dimensions.width - this.radius * 2) * (this.maxValue - this.minValue) + this.minValue;
        if (val > this.maxValue) {
            val = this.maxValue;
        }
        if (val < this.minValue) {
            val = this.minValue;
        }
        return val;
    }
}