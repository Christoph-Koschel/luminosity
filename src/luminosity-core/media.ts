import {CoreNode} from "./base";
import {R} from "../luminosity/vfs";

export class Image extends CoreNode {
    name: string = "Image";
    sheet: string = R.core.Image;

    render(): void {
        (<HTMLImageElement>this.getElement()).src = this.attrs.get("href");
        (<HTMLImageElement>this.getElement()).alt = this.attrs.getOrDefault("alt", "");
    }

    public setHREF(href: string): void {
        (<HTMLImageElement>this.getElement()).src = href;
        this.emitStyler();
    }

    public getHREF(): string {
        return (<HTMLImageElement>this.getElement()).src;
    }

    public setAlt(alt: string): void {
        (<HTMLImageElement>this.getElement()).alt = alt;
    }

    public getAlt(): string {
        return (<HTMLImageElement>this.getElement()).src;
    }
}