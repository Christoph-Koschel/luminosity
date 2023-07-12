import {
    StyleBoxSizeValue,
    StyleColorValue,
    StyleSizeValue,
    XAMLStyleEmitter
} from "../luminosity/builder/styler";

export class CoreStyleEmitter extends XAMLStyleEmitter {
    emitBackground(color: StyleColorValue): string[] {
        return ["background: " + color];
    }

    emitCostume(attrs: { [p: string]: string }): string[] {
        const result: string[] = [];

        Object.keys(attrs).forEach(key => {
            result.push(`${key}: ${attrs[key]}`);
        });

        return result;
    }

    emitForeground(color: StyleColorValue): string[] {
        return ["color: " + color];
    }

    emitHeight(height: StyleBoxSizeValue): string[] {
        if (height == "screen" || height == "match_parent") {
            return [];
        }

        return ["height: " + height];
    }

    emitMargin(margin: StyleSizeValue[]): string[] {
        return ["padding: " + margin.join(" ")];
    }

    emitPadding(padding: StyleSizeValue[]): string[] {
        return ["padding: " + padding.join(" ")];
    }

    emitWidth(width: StyleBoxSizeValue): string[] {
        if (width == "screen" || width == "match_parent") {
            return [];
        }

        return ["width: " + width];
    }
}

export const CORE_STYLER: CoreStyleEmitter = new CoreStyleEmitter();