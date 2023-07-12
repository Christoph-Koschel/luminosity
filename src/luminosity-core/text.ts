import {R} from "../luminosity/vfs";
import {XAMLClickListeners} from "../luminosity/builder/events";
import {CoreNode} from "./base";

export class TextView extends CoreNode {
    name: string = "TextView";
    sheet: string = R.core.TextView;

    private text: string;

    render(): void {
        this.style.costume["height"] = "16px";

        if (this.attrs.has("size")) {
            this.style.costume["height"] = this.attrs.get("size");
            this.style.costume["font-size"] = this.attrs.get("size");
        }
        if (this.attrs.has("weight")) {
            this.style.costume["font-weight"] = this.attrs.get("weight");
        }
        if (this.attrs.has("family")) {
            this.style.costume["font-family"] = this.attrs.get("family");
        }
        if (this.attrs.has("foreground")) {
            this.style.costume["color"] = this.attrs.get("foreground");
        }
        this.getElement().innerHTML = this.text = this.attrs.getOrDefault("text");
    }

    public setText(text: string): void {
        this.getElement().innerHTML = this.text = text;
    }

    public appendText(text: string): void {
        this.setText(this.text + text);
    }

    public getText(): string {
        return this.text;
    }
}

export class Button extends CoreNode implements XAMLClickListeners {
    name: string = "Button";
    sheet: string = R.core.Button;

    render(): void {
        this.getElement().innerHTML = this.attrs.get("text");
    }

    public addOnClickListener(cb: { (ev: MouseEvent): void }): void {
        this.getElement().addEventListener("click", cb);
    }

    public addOnDBClickListener(cb: { (e: MouseEvent): void }): void {
        this.getElement().addEventListener("dblclick", cb);
    }

    public addOnRClickListener(cb: { (e: MouseEvent): void }): void {
        this.getElement().addEventListener("contextmenu", cb);
    }
}

export class EditText extends CoreNode {
    name: string = "EditText";
    sheet: string = R.core.EditText;

    render(): void {
        if (this.attrs.has("type")) {
            (<HTMLInputElement>this.getElement()).type = this.attrs.get("type");
        } else {
            (<HTMLInputElement>this.getElement()).type = "text";
        }
    }

    public addOnChangeListener(cb: { (e: Event): void }): void {
        this.getElement().addEventListener("change", cb);
    }

    public setValue(value: string): void {
        (<HTMLInputElement>this.getElement()).value = value;
    }

    public getValue(): string {
        return (<HTMLInputElement>this.getElement()).value;
    }
}

export class Link extends CoreNode implements XAMLClickListeners {
    name: string = "Link"
    sheet: string = R.core.Link;

    render(): void {
        const anchor: HTMLAnchorElement = <HTMLAnchorElement>this.getElement();
        anchor.href = this.attrs.get("href");
        anchor.target = this.attrs.getOrDefault("target", "");
    }

    public setHREF(href: string): void {
        (<HTMLAnchorElement>this.getElement()).href = href;
    }

    public getHREF(): string {
        return (<HTMLAnchorElement>this.getElement()).href;
    }

    public setTarget(target: string | "_blank" | "_self" | "_parent" | "_top"): void {
        (<HTMLAnchorElement>this.getElement()).target = target;
    }

    public getTarget(): string | "_blank" | "_self" | "_parent" | "_top" {
        return (<HTMLAnchorElement>this.getElement()).target;
    }

    addOnClickListener(cb: { (e: MouseEvent): void }): void {
        this.getElement().addEventListener("click", cb);
    }

    addOnDBClickListener(cb: { (e: MouseEvent): void }): void {
        this.getElement().addEventListener("dblclick", cb);
    }

    addOnRClickListener(cb: { (e: MouseEvent): void }): void {
        this.getElement().addEventListener("contextmenu", cb);
    }
}