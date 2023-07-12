import {XAMLState} from "./state";

export enum XAMLStyleTargets {
    Element = "",
    Hover = ":hover",
    Select = ":select",
    FirstOfType = ":first-of-type",
    LastOfType = ":last-of-type",
    FirstOfChild = ":first-child",
    LastOfChild = ":last-child"
}

export class XAMLStyle {
    private static counter: number = 0;
    private _id: number = XAMLStyle.counter++;
    public sheet: string;
    public of: string;
    public when: string;
    public target: XAMLStyleTargets;

    public width: StyleBoxSizeValue;
    public height: StyleBoxSizeValue;

    public padding: (StyleSizeValue | null)[];
    public margin: (StyleSizeValue | null)[];

    public foreground: StyleColorValue | null;
    public background: StyleColorValue | null;

    public costume: { [key: string]: string } | null;

    public get id(): number {
        return this._id;
    }

    public constructor(sheet: string, increment: boolean = true) {
        this.sheet = sheet;
        this.costume = {};
        if (increment) {
            this._id = XAMLStyle.counter++;
        }
    }

    public clone(): XAMLStyle {
        const style: XAMLStyle = new XAMLStyle(this.sheet, false);
        style.of = this.of;
        style.when = this.when;
        style.target = this.target;
        style._id = this.id;

        style.width = this.width;
        style.height = this.height;

        style.padding = this.padding;
        style.margin = this.margin;

        style.foreground = this.foreground;
        style.background = this.background;

        style.costume = {};
        Object.keys(this.costume).forEach((key: string): void => {
            style.costume[key] = this.costume[key];
        });

        return style;
    }
}

export abstract class XAMLStyleEmitter {
    protected target: XAMLStyleTargets;
    private static generated: number[] = [];
    private readonly element: HTMLStyleElement;

    public constructor() {
        this.element = document.createElement("style");
        if (XAMLState.isLoaded) {
            document.head.appendChild(this.element);
        } else {
            window.addEventListener("load", (): void => {
                document.head.appendChild(this.element);
            });
        }
    }

    public emit(element: HTMLElement, styles: XAMLStyle[], defaultStyle: XAMLStyle): void {
        Object.keys(XAMLStyleTargets).forEach((value: XAMLStyleTargets): void => {
            const toEmit: XAMLStyle[] = styles.filter(s => {
                console.log(s.target, XAMLStyleTargets[value], s.target == XAMLStyleTargets[value]);
                return s.target == XAMLStyleTargets[value]
            });

            this.target = XAMLStyleTargets[value];

            toEmit.forEach(xamlStyle => {
                element.classList.add("style" + xamlStyle.id);
                if (XAMLStyleEmitter.generated.includes(xamlStyle.id)) {
                    return;
                }

                XAMLStyleEmitter.generated.push(xamlStyle.id);
                const style: string = this.emitStyle(xamlStyle, ";\n    ");
                this.element.innerHTML += `.style${xamlStyle.id}${this.target} {\n    ${style}\n}\n`;
            });
        });

        this.target = XAMLStyleTargets.Element;
        element.setAttribute("style", this.emitStyle(defaultStyle, ";"));
    }

    private emitStyle(xamlStyle: XAMLStyle, join: string): string {
        let style: string = "";
        if (xamlStyle.foreground != null) {
            style += this.emitForeground(xamlStyle.foreground).join(join) + join;
        }
        if (xamlStyle.background != null) {
            style += this.emitBackground(xamlStyle.background).join(join) + join;
        }
        if (xamlStyle.padding != null) {
            style += this.emitPadding(xamlStyle.padding).join(join) + join;
        }
        if (xamlStyle.margin != null) {
            style += this.emitMargin(xamlStyle.margin).join(join) + join;
        }
        if (xamlStyle.width != null) {
            style += this.emitWidth(xamlStyle.width).join(join) + join;
        }
        if (xamlStyle.height != null) {
            style += this.emitHeight(xamlStyle.height).join(join) + join;
        }
        if (xamlStyle.costume != null) {
            style += this.emitCostume(xamlStyle.costume).join(join) + join;
        }

        return style;
    }

    public abstract emitForeground(color: StyleColorValue): string[];

    public abstract emitBackground(color: StyleColorValue): string[];

    public abstract emitPadding(padding: StyleSizeValue[]): string[];

    public abstract emitMargin(margin: StyleSizeValue[]): string[];

    public abstract emitWidth(width: StyleBoxSizeValue): string[];

    public abstract emitHeight(height: StyleBoxSizeValue): string[];

    public abstract emitCostume(attrs: { [p: string]: string }): string[];
}


export function style_target_of(x: string): XAMLStyleTargets {
    switch (x) {
        case "element":
            return XAMLStyleTargets.Element;
        case "hover":
            return XAMLStyleTargets.Hover;
        case "select":
            return XAMLStyleTargets.Select;
        case "first-of-child":
            return XAMLStyleTargets.FirstOfChild;
        case "last-of-child":
            return XAMLStyleTargets.LastOfChild;
        case "first-of-type":
            return XAMLStyleTargets.FirstOfType;
        case "last-of-type":
            return XAMLStyleTargets.LastOfType;
    }

    return XAMLStyleTargets.Element;
}

export type StyleColorValue =
    `rgb(${number}, ${number}, ${number})`
    | `rgba(${number}, ${number}, ${number})`
    | `#${string}`;

export type StyleSizeValue = `${number}px` | `${number}rem` | `${number}em`;

export type StyleBoxSizeValue = "match_parent" | "screen" | StyleSizeValue | null;