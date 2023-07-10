import {
    StyleBoxSizeValue,
    StyleColorValue,
    StyleSizeValue,
    XAMLStyleEmitter
} from "../luminosity/builder/styler";

export class CoreStyleEmitter extends XAMLStyleEmitter {
    emitBackground(color: StyleColorValue): void {
        this.element.style.background = color;
    }

    emitCostume(attrs: { [p: string]: string }): void {
        Object.keys(attrs).forEach(key => {
            this.element.style[key] = attrs[key];
        });
    }

    emitForeground(color: StyleColorValue): void {
        this.element.style.color = color;
    }

    emitHeight(height: StyleBoxSizeValue): void {
        if (height == "screen" || height == "match_parent") {
            return;
        }

        this.element.style.height = height;
    }

    emitMargin(margin: StyleSizeValue[]): void {
        this.element.style.margin = margin.join(" ");
    }

    emitPadding(padding: StyleSizeValue[]): void {
        this.element.style.padding = padding.join(" ");
    }

    emitWidth(width: StyleBoxSizeValue): void {
        if (width == "screen" || width == "match_parent") {
            return;
        }

        this.element.style.width = width;
    }
}

export const CORE_STYLER: CoreStyleEmitter = new CoreStyleEmitter();