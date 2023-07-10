import {XAMLComponent} from "../luminosity/builder/xaml";
import {StyleBoxSizeValue, StyleColorValue, StyleSizeValue} from "../luminosity/builder/styler";
import {CORE_STYLER} from "./emit";

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

export abstract class CoreNode extends XAMLComponent {
    public constructor() {
        super(CORE_STYLER);
    }
}

export abstract class GridComponent extends CoreNode {
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
        this.emitStyler();
    }

    public getPadding(): StyleSizeValue[] | null {
        return this.style.padding;
    }

    public setMargin(padding: StyleSizeValue[] | null): void {
        this.style.padding = padding;
        this.emitStyler();
    }

    public getMargin(): StyleSizeValue[] | null {
        return this.style.padding;
    }
}