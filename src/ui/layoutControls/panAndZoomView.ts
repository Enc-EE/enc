import { LayoutView } from "./layoutView";
import { Rectangle } from "../../geometry/rectangle";
import { Point } from "../../geometry/point";
import { RenderObject } from "../renderObject";
import { Control } from "../controls/control";

export class PanAndZoomView extends LayoutView {
    protected zoom: number = 1;
    private offsetX: number = 0;
    private offsetY: number = 0;
    private isDragging: boolean;
    private oldPosition: Point;

    public addChild = (child: RenderObject) => {
        this.children.push(child);
        this.triggerUpdateLayout();
    }

    constructor() {
        super();
        document.addEventListener('mousedown', this.pazMouseDown);
        document.addEventListener('mouseup', this.pazMouseUp);
        document.addEventListener('wheel', this.pazMouseScroll)
    }

    private superRender2 = this.render;
    public render = (ctx: CanvasRenderingContext2D) => {
        this.superRender2(ctx);
        ctx.save();
        ctx.transform(this.zoom, 0, 0, this.zoom, this.offsetX + this.bounds.x, this.offsetY + this.bounds.y);
        super.render(ctx);
        ctx.restore();
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        this.bounds = bounds;
        for (const child of this.children) {
            child.updateLayout(ctx, child.bounds);
        }
    }

    public pazMouseDown = (ev: MouseEvent) => {
        if (this.bounds.isHitBy(ev.clientX, ev.clientY)) {
            if (ev.ctrlKey || ev.shiftKey || ev.altKey) {
                // update cursor
                this.isDragging = true;
                this.oldPosition = {
                    x: ev.clientX,
                    y: ev.clientY
                };
            }
        }
    }
    public pazMouseUp = (ev: MouseEvent) => {
        this.isDragging = false;
    }

    public pazMouseScroll = (ev: WheelEvent) => {
        var viewX = ev.clientX - this.bounds.x - this.offsetX;
        var viewY = ev.clientY - this.bounds.y - this.offsetY;
        viewX = viewX / this.bounds.width / this.zoom;
        viewY = viewY / this.bounds.height / this.zoom;
        if (ev.deltaY >= 0) {
            this.zoom = this.zoom / (1.1);
        } else {
            this.zoom = this.zoom * (1.1);
        }
        this.offsetX = - viewX * this.bounds.width * this.zoom + ev.clientX - this.bounds.x;
        this.offsetY = - viewY * this.bounds.height * this.zoom + ev.clientY - this.bounds.y;

    }

    protected getPazPoint = (point: Point): Point => {
        var p: Point = null;
        if (this.bounds) {
            if (this.bounds.isHitBy(point.x, point.y)) {
                var viewX = point.x - this.bounds.x - this.offsetX;
                var viewY = point.y - this.bounds.y - this.offsetY;
                viewX = viewX / this.zoom;
                viewY = viewY / this.zoom;
                p = new Point(viewX, viewY);
            }
        }
        return p;
    }

    public mouseMove(ev: MouseEvent) {
        if (this.isDragging) {

            this.offsetX += ev.clientX - this.oldPosition.x
            this.offsetY += ev.clientY - this.oldPosition.y
            this.oldPosition = {
                x: ev.clientX,
                y: ev.clientY
            };
        } else {
            var p = this.getPazPoint({
                x: ev.clientX,
                y: ev.clientY
            })
            if (p) {
                for (const child of this.children) {
                    child.mouseMove({
                        clientX: p.x,
                        clientY: p.y,
                    } as MouseEvent);
                }
            }
        }
    }

    public click(ev: MouseEvent) {
        var p = this.getPazPoint({
            x: ev.clientX,
            y: ev.clientY
        })
        if (p) {
            for (const child of this.children) {
                child.click({
                    clientX: p.x,
                    clientY: p.y,
                    altKey: ev.altKey,
                    ctrlKey: ev.ctrlKey,
                    shiftKey: ev.shiftKey
                } as MouseEvent);
            }
        }
    }
}