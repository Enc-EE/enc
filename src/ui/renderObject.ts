import { Rectangle } from "../geometry/rectangle";
import { Alignement } from "./alignement/alignement";
import { MethodManipulation } from "../methodManipulation";
import { UImation } from "./uimation/uimation";

export abstract class RenderObject {
    private static idCounter = 0;
    private generateNewId = () => {
        RenderObject.idCounter++;
        return RenderObject.idCounter;
    }
    startTime: number;
    duration: number;

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

    private isActive = true;
    public activate = (durationSeconds: number) => {
        this.renderMethodManipulation.reset();
        var uimation = new UImation(durationSeconds);

        this.renderMethodManipulation.add((currentMethod) => {
            return (ctx: CanvasRenderingContext2D) => {
                if (uimation.ended()) {
                    currentMethod(ctx);
                    this.renderMethodManipulation.remove();
                } else {
                    ctx.save();
                    ctx.globalAlpha = uimation.getValue();
                    currentMethod(ctx);
                    ctx.restore();

                }
            }
        });
    }
    public deactivated = () => {
        this.renderMethodManipulation.clear();
    }

    public deactivate = (durationSeconds: number) => {
        var uimation = new UImation(durationSeconds);

        this.renderMethodManipulation.add((currentMethod) => {
            return (ctx: CanvasRenderingContext2D) => {
                if (uimation.ended()) {
                    this.renderMethodManipulation.remove();
                    this.renderMethodManipulation.clear();
                } else {
                    ctx.save();
                    ctx.globalAlpha = 1 - uimation.getValue();
                    currentMethod(ctx);
                    ctx.restore();
                }
            }
        });
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