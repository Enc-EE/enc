import { Rectangle } from "../geometry/rectangle";
import { Alignement } from "./alignement/alignement";
import { MethodManipulation } from "../methodManipulation";

export abstract class RenderObject {
    private static idCounter = 0;
    private generateNewId = () => {
        RenderObject.idCounter++;
        return RenderObject.idCounter;
    }
    startTime: number;
    duration: number;

    constructor(initializeAsActive = true) {
        this.id = this.generateNewId();
        this.name = "object " + this.id;

        this.isActive = initializeAsActive;
        if (!this.isActive) {
            this.deactivate();
        }
    }

    public id: number;
    public name: string;
    public tag: any;

    public bounds: Rectangle = new Rectangle(0, 0, 0, 0);
    public dimensions: Rectangle = new Rectangle(0, 0, 0, 0);

    public alignement = new Alignement();

    private shouldUpdateLayout = false;

    private _renderMethodManipulation: MethodManipulation<(ctx: CanvasRenderingContext2D) => void>;
    public get renderMethodManipulation(): MethodManipulation<(ctx: CanvasRenderingContext2D) => void> {
        if (!this._renderMethodManipulation) {
            this._renderMethodManipulation = new MethodManipulation(this, this.render, (render) => this.render = render);
        }
        return this._renderMethodManipulation;
    }

    public render = (ctx: CanvasRenderingContext2D) => {
        if (this.shouldUpdateLayout) {
            this.updateLayout(ctx, this.bounds);
            this.shouldUpdateLayout = false;
        }
    };

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle) {
        this.bounds = bounds;
        this.shouldUpdateLayout = false;
    }

    public triggerUpdateLayout = () => {
        this.shouldUpdateLayout = true;
    }

    private isActive = false;
    public activate = () => {
        this.startTime = Date.now();
        this.duration = 3;

        this.renderMethodManipulation.add((currentMethod) => {
            return (ctx: CanvasRenderingContext2D) => {
                var current = Date.now();
                var diff = current - this.startTime;
                if (diff <= 5000) {
                    ctx.save();
                    ctx.globalAlpha = diff / 1000 / this.duration
                    // currentMethod = currentMethod.bind(this);
                    currentMethod(ctx);
                    ctx.restore();
                } else {
                    // currentMethod = currentMethod.bind(this);
                    currentMethod(ctx);
                    this.renderMethodManipulation.remove();
                }
            }
        });
    }

    public deactivate = () => {
        // this.renderMethodCache = this.render;
        // this.render = (ctx: CanvasRenderingContext2D) => { };
    }

    public disableMouseEvents = () => {
        this.mouseDown = () => { };
        this.mouseUp = () => { };
        this.mouseMove = () => { };
        this.click = () => { };
    }

    abstract mouseDown(ev: MouseEvent): void;
    abstract mouseUp(ev: MouseEvent): void;
    abstract mouseMove(ev: MouseEvent): void;
    abstract click(ev: MouseEvent): void;
}