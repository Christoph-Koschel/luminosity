let onesLoaded: boolean = false;

export class XAMLState {
    public static get isLoaded(): boolean {
        return onesLoaded;
    }
}

window.addEventListener("load", () => {
    onesLoaded = true;
});