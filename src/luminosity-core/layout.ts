import {R} from "../luminosity/vfs";
import {GridComponent} from "./base";

export class LinearLayout extends GridComponent {
    name: string = "LinearLayout";
    sheet: string = R.core.LinearLayout;

    private row: boolean = false;

    render(): void {
        super.render();

        this.row = this.direction(this.attrs.get("direction"));
        this.align(this.attrs.getOrDefault("align", "left"));
        this.valign(this.attrs.getOrDefault("valign", "top"));
    }

    private align(align: string): void {
        switch (align) {
            case "left":
                if (this.row) {
                    this.style.costume["justifyContent"] = "flex-start";
                } else {
                    this.style.costume["alignItems"] = "flex-start";
                }
                break;
            case "center":
                if (this.row) {
                    try {
                        throw "JUSTIFY CENTER";
                    } catch (err) {
                        console.log(">>>>", err.stack);
                    }
                    this.style.costume["justifyContent"] = "center";
                } else {
                    this.style.costume["alignItems"] = "center";
                }
                break;
            case "right":
                if (this.row) {
                    this.style.costume["justifyContent"] = "flex-end";
                } else {
                    this.style.costume["alignItems"] = "flex-end";
                }
                break;
            case "fill":
                if (this.row) {
                    this.style.costume["justifyContent"] = "space-evenly";
                } else {
                    this.style.costume["alignItems"] = "stretch";
                }
                break;
            default:
                throw `Undefined align '${this.attrs.get("align")}'`;
        }
    }

    private direction(direction: string): boolean {
        switch (direction) {
            case "top":
                this.style.costume["flexDirection"] = "column-reverse";
                return false;

            case "right":
                this.style.costume["flexDirection"] = "row";
                return true;

            case "bottom":
                this.style.costume["flexDirection"] = "column";
                return false;

            case "left":
                this.style.costume["flexDirection"] = "row-reverse";
                return true;
            default:
                throw `Undefined direction '${direction}'`;
        }
    }

    private valign(align): void {
        switch (align) {
            case "top":
                if (this.row) {
                    this.style.costume["alignItems"] = "flex-start";
                } else {
                    this.style.costume["justifyContent"] = "flex-start";
                }
                break;
            case "center":
                if (this.row) {
                    this.style.costume["alignItems"] = "center";
                } else {
                    this.style.costume["justifyContent"] = "center";
                }
                break;
            case "bottom":
                if (this.row) {
                    this.style.costume["alignItems"] = "flex-end";
                } else {
                    this.style.costume["justifyContent"] = "flex-end";
                }
                break;
            default:
                throw `Undefined valign '${align}'`;
        }
    }

    public setDirection(direction: "top" | "left" | "right" | "bottom"): void {
        this.row = this.direction(direction);
        this.emitStyler();
    }

    public setAlign(align: "left" | "center" | "right" | "fill"): void {
        this.align(align);
        this.emitStyler();
    }

    public setVAlign(align: "top" | "center" | "bottom"): void {
        this.valign(align);
        this.emitStyler();
    }

    public getDirection(): "top" | "left" | "right" | "bottom" {
        return <("top" | "left" | "right" | "bottom")>this.attrs.get("direction");
    }

    public getAlign(): "left" | "center" | "right" | "fill" {
        if (this.attrs.has("align")) {
            return <("left" | "center" | "right" | "fill")>this.attrs.get("align");
        }
        return "left";
    }

    public getVAlign(): "top" | "center" | "bottom" {
        if (this.attrs.has("align")) {
            return <("top" | "center" | "bottom")>this.attrs.get("valign");
        }
        return "top";
    }
}

export class RelativeLayout extends GridComponent {
    public name: string = "RelativeLayout";
    public sheet: string = R.core.RelativeLayout;

    render(): void {
        super.render();
    }
}

export class AbsoluteLayout extends GridComponent {
    public name: string = "AbsoluteLayout";
    public sheet: string = R.core.AbsoluteLayout;

    render(): void {
        super.render();
    }
}