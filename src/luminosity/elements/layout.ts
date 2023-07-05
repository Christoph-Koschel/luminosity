import {AttrCollection, XAMLComponent, XAMLNode} from "../builder/xaml";
import {StyleBoxSizeValue, StyleColorValue, StyleSizeValue} from "../builder/styler";
import {R} from "../vfs";
import {apply_style} from "./emit";

const WIDTH_EVENT: GridComponent[] = [];
const HEIGHT_EVENT: GridComponent[] = [];

window.addEventListener("load", () => {
    window.addEventListener("resize", () => {
        let toRemove: GridComponent[] = [];

        WIDTH_EVENT.forEach((node) => {
            if (!node.resize(true, false)) {
                toRemove.push(node);
            }
        });
        toRemove.forEach(node => {
            const offset: number = WIDTH_EVENT.indexOf(node);
            WIDTH_EVENT.splice(offset, 1);
        });
        toRemove = [];

        HEIGHT_EVENT.forEach((node) => {
            if (!node.resize(false, true)) {
                toRemove.push(node);
            }
        });
        toRemove.forEach(node => {
            const offset: number = HEIGHT_EVENT.indexOf(node);
            HEIGHT_EVENT.splice(offset, 1);
        });
    });
});

export abstract class GridComponent extends XAMLComponent {
    public resize(width: boolean, height: boolean): boolean {
        if (!document.body.contains(this.getElement())) {
            return false;
        }

        if (width) {
            if (this.attrs.has("width") && this.attrs.get("width") == "match_parent") {
                let rect: DOMRect;
                let style: CSSStyleDeclaration;
                if (this.parent == null) {
                    rect = document.body.getClientRects().item(0);
                    style = getComputedStyle(document.body);
                } else {
                    // @ts-ignore
                    rect = (<XAMLComponent>this.parent).getElement(this).getClientRects().item(0);
                    // @ts-ignore
                    style = getComputedStyle((<XAMLComponent>this.parent).getElement(this));
                }

                this.getElement().style.width = (rect.width - 2 * parseFloat(style.padding)) + "px";
            } else if (this.attrs.has("width") && this.attrs.get("width") == "screen") {
                this.getElement().style.width = `calc(100vw - 2 * ${this.style.padding ?? "0px"})`;
            }
        }

        if (height) {
            if (this.attrs.has("height") && this.attrs.get("height") == "match_parent") {
                let rect: DOMRect;
                let style: CSSStyleDeclaration;
                if (this.parent == null) {
                    rect = document.body.getClientRects().item(0);
                    style = getComputedStyle(document.body);
                } else {
                    // @ts-ignore
                    rect = (<XAMLComponent>this.parent).getElement(this).getClientRects().item(0);
                    // @ts-ignore
                    style = getComputedStyle((<XAMLComponent>this.parent).getElement(this));
                }

                this.getElement(this).style.height = (rect.height - 2 * parseFloat(style.padding)) + "px";
            } else if (this.attrs.has("height") && this.attrs.get("height") == "screen") {
                this.getElement(this).style.height = `calc(100vh - 2 * ${this.style.padding ?? "0px"})`;
            }
        }

        return true;
    }

    render(): void {
        if (this.attrs.has("width")) {
            this.style.width = <StyleBoxSizeValue>this.attrs.get("width");
        }
        if (this.attrs.has("height")) {
            this.style.height = <StyleBoxSizeValue>this.attrs.get("height");
        }
        if (this.attrs.has("padding")) {
            this.style.padding = <StyleSizeValue[]>this.attrs.get("padding").split(" ");
        }
        if (this.attrs.has("margin")) {
            this.style.padding = <StyleSizeValue[]>this.attrs.get("margin").split(" ");
        }
        if (this.attrs.has("foreground")) {
            this.style.foreground = <StyleColorValue>this.attrs.get("foreground");
        }
        if (this.attrs.has("background")) {
            this.style.background = <StyleColorValue>this.attrs.get("background");
        }

        this.emitResizeEvents();
    }

    private emitResizeEvents(): void {
        console.log("Emit", this.style);
        if (this.style.width == "match_parent" || this.style.width == "screen") {
            if (!WIDTH_EVENT.includes(this)) {
                WIDTH_EVENT.push(this);
            }
        }

        if (this.style.height == "match_parent" || this.style.height == "screen") {
            if (!HEIGHT_EVENT.includes(this)) {
                HEIGHT_EVENT.push(this);
            }
        }
    }

    public setPadding(padding: StyleSizeValue[] | null): void {
        this.style.padding = padding;
        apply_style(this.getElement(this), this.style);
    }

    public getPadding(): StyleSizeValue[] | null {
        return this.style.padding;
    }

    public setMargin(padding: StyleSizeValue[] | null): void {
        this.style.padding = padding;
        apply_style(this.getElement(this), this.style);
    }

    public getMargin(): StyleSizeValue[] | null {
        return this.style.padding;
    }
}

export class LinearLayout extends GridComponent {
    name: string = "LinearLayout";
    sheet: string = R.core.LinearLayout;

    private row: boolean = false;

    render(): void {
        super.render();

        this.row = this.direction(this.attrs.get("direction"));
        this.align(this.attrs.getOrDefault("align", "left"));
        this.valign(this.attrs.getOrDefault("valign", "top"));
        apply_style(this.getElement(this), this.style);
    }

    private align(align: string): void {
        switch (align) {
            case "left":
                if (this.row) {
                    this.style.costume["justifyContent"] = "flex-start";
                } else {
                    this.style.costume["alignItems"] = "flex-start";
                }
                break;
            case "center":
                if (this.row) {
                    try {
                        throw "JUSTIFY CENTER";
                    } catch (err) {
                        console.log(">>>>", err.stack);
                    }
                    this.style.costume["justifyContent"] = "center";
                } else {
                    this.style.costume["alignItems"] = "center";
                }
                break;
            case "right":
                if (this.row) {
                    this.style.costume["justifyContent"] = "flex-end";
                } else {
                    this.style.costume["alignItems"] = "flex-end";
                }
                break;
            case "fill":
                if (this.row) {
                    this.style.costume["justifyContent"] = "space-evenly";
                } else {
                    this.style.costume["alignItems"] = "stretch";
                }
                break;
            default:
                throw `Undefined align '${this.attrs.get("align")}'`;
        }
    }

    private direction(direction: string): boolean {
        switch (direction) {
            case "top":
                this.style.costume["flexDirection"] = "column-reverse";
                return false;

            case "right":
                this.style.costume["flexDirection"] = "row";
                return true;

            case "bottom":
                this.style.costume["flexDirection"] = "column";
                return false;

            case "left":
                this.style.costume["flexDirection"] = "row-reverse";
                return true;
            default:
                throw `Undefined direction '${direction}'`;
        }
    }

    private valign(align): void {
        switch (align) {
            case "top":
                if (this.row) {
                    this.style.costume["alignItems"] = "flex-start";
                } else {
                    this.style.costume["justifyContent"] = "flex-start";
                }
                break;
            case "center":
                if (this.row) {
                    this.style.costume["alignItems"] = "center";
                } else {
                    this.style.costume["justifyContent"] = "center";
                }
                break;
            case "bottom":
                if (this.row) {
                    this.style.costume["alignItems"] = "flex-end";
                } else {
                    this.style.costume["justifyContent"] = "flex-end";
                }
                break;
            default:
                throw `Undefined valign '${align}'`;
        }
    }

    public setDirection(direction: "top" | "left" | "right" | "bottom"): void {
        this.row = this.direction(direction);
        apply_style(this.getElement(this), this.style);
    }

    public setAlign(align: "left" | "center" | "right" | "fill"): void {
        this.align(align);
        apply_style(this.getElement(this), this.style);
    }

    public setVAlign(align: "top" | "center" | "bottom"): void {
        this.valign(align);
        apply_style(this.getElement(this), this.style);
    }

    public getDirection(): "top" | "left" | "right" | "bottom" {
        return <("top" | "left" | "right" | "bottom")>this.attrs.get("direction");
    }

    public getAlign(): "left" | "center" | "right" | "fill" {
        if (this.attrs.has("align")) {
            return <("left" | "center" | "right" | "fill")>this.attrs.get("align");
        }
        return "left";
    }

    public getVAlign(): "top" | "center" | "bottom" {
        if (this.attrs.has("align")) {
            return <("top" | "center" | "bottom")>this.attrs.get("valign");
        }
        return "top";
    }

    clone<T extends XAMLNode>(attrs: AttrCollection, element: HTMLElement | XAMLNode, children: XAMLNode[]): T {
        const n: T = super.clone(attrs, element, children);

        console.log(n);

        return n;
    }
}

export class RelativeLayout extends GridComponent {
    public name: string = "RelativeLayout";
    public sheet: string = R.core.RelativeLayout;

    render(): void {
        super.render();
        apply_style(this.getElement(this), this.style);
    }
}

export class AbsoluteLayout extends GridComponent {
    public name: string = "AbsoluteLayout";
    public sheet: string = R.core.AbsoluteLayout;

    render(): void {
        super.render();
        apply_style(this.getElement(this), this.style);
    }
}