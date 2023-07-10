export class XAMLStyle {
    public sheet: string;
    public of: string;
    public when: string;

    public width: StyleBoxSizeValue;
    public height: StyleBoxSizeValue;

    public padding: (StyleSizeValue | null)[];
    public margin: (StyleSizeValue | null)[];

    public foreground: StyleColorValue | null;
    public background: StyleColorValue | null;

    public costume: { [key: string]: string } | null;

    public constructor(sheet: string) {
        this.sheet = sheet;
        this.costume = {};
    }

    public clone(): XAMLStyle {
        const style: XAMLStyle = new XAMLStyle(this.sheet);
        style.of = this.of;
        style.when = this.when;

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
    protected element: HTMLElement;

    public emit(element: HTMLElement, styles: XAMLStyle[]): void {
        element.setAttribute("style", "");
        this.element = element;
        for (const style of styles) {
            if (style == null) {
                return;
            }

            if (style.foreground != null) {
                this.emitForeground(style.foreground);
            }
            if (style.background != null) {
                this.emitBackground(style.background);
            }
            if (style.padding != null) {
                this.emitPadding(style.padding);
            }
            if (style.margin != null) {
                this.emitMargin(style.margin);
            }
            if (style.width != null) {
                this.emitWidth(style.width);
            }
            if (style.height != null) {
                this.emitHeight(style.height);
            }
            if (style.costume != null) {
                this.emitCostume(style.costume);
            }
        }
    }

    public abstract emitForeground(color: StyleColorValue): void;

    public abstract emitBackground(color: StyleColorValue): void;

    public abstract emitPadding(padding: StyleSizeValue[]): void;

    public abstract emitMargin(margin: StyleSizeValue[]): void;

    public abstract emitWidth(width: StyleBoxSizeValue): void;

    public abstract emitHeight(height: StyleBoxSizeValue): void;

    public abstract emitCostume(attrs: { [p: string]: string }): void;
}

export type StyleColorValue =
    `rgb(${number}, ${number}, ${number})`
    | `rgba(${number}, ${number}, ${number})`
    | `#${string}`;

export type StyleSizeValue = `${number}px` | `${number}rem` | `${number}em`;

export type StyleBoxSizeValue = "match_parent" | "screen" | StyleSizeValue | null;