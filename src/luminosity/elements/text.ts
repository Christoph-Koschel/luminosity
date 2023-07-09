import {XAMLComponent} from "../builder/xaml";
import {R} from "../vfs";
import {apply_style} from "./emit";
import {XAMLClickListeners} from "../builder/events";

export class TextView extends XAMLComponent {
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
        apply_style(this.getElement(), [...this.styleList, this.style]);
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

export class Button extends XAMLComponent implements XAMLClickListeners {
    name: string = "Button";
    sheet: string = R.core.Button;

    render(): void {
        apply_style(this.getElement(), [...this.styleList, this.style]);
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

export class EditText extends XAMLComponent {
    name: string = "EditText";
    sheet: string = R.core.EditText;

    render(): void {
        apply_style(this.getElement(), [...this.styleList, this.style]);
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