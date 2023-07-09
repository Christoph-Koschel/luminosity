import {XAMLStyle} from "../builder/styler";

export function apply_style(element: HTMLElement, styles: XAMLStyle[]): void {
    element.setAttribute("style", "");

    for (const style of styles) {
        if (style == null) {
            return;
        }

        if (style.foreground != null) {
            element.style.color = style.foreground;
        }
        if (style.background != null) {
            element.style.background = style.background;
        }
        if (style.padding != null) {
            element.style.padding = style.padding.join(" ");
        }
        if (style.margin != null) {
            element.style.margin = style.margin.join(" ");
        }
        if (style.width != null && style.width != "match_parent" && style.width != "screen") {
            element.style.width = style.width;
        }
        if (style.height != null && style.height != "match_parent" && style.height != "screen") {
            element.style.height = style.height;
        }
        if (style.costume != null) {
            Object.keys(style.costume).forEach(key => {
                element.style[key] = style.costume[key];
            });
        }
    }
}