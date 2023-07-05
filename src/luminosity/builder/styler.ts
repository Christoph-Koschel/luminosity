export class XAMLStyle {
    public sheet: string;
    public of: string;

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

export type StyleColorValue =
    `rgb(${number}, ${number}, ${number})`
    | `rgba(${number}, ${number}, ${number})`
    | `#${string}`;

export type StyleSizeValue = `${number}px` | `${number}rem` | `${number}em`;

export type StyleBoxSizeValue = "match_parent" | "screen" | StyleSizeValue | null;