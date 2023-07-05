import {XAMLStyle} from "../builder/styler";

export function apply_style(element: HTMLElement, style: XAMLStyle): void {
    if (style == null) {
        return;
    }

    if (style.foreground != null) {
        element.style.color = style.foreground;
    } else {
        element.style.color = "";
    }
    if (style.background != null) {
        element.style.background = style.background;
    } else {
        element.style.background = "";
    }
    if (style.padding != null) {
        element.style.padding = style.padding.join(" ");
    } else {
        element.style.padding = "";
    }
    if (style.margin != null) {
        element.style.margin = style.margin.join(" ");
    } else {
        element.style.margin = "";
    }

    if (style.costume != null) {
        Object.keys(style.costume).forEach(key => {
            element.style[key] = style.costume[key];
        });
    }
}