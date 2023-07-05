import {vfs_read} from "../../vfs/vfs";
import {R} from "../vfs";
import {StyleSizeValue, XAMLStyle} from "./styler";

export type XMLElement = Element;
export type XMLCollection = HTMLCollection;


export abstract class XAMLNode {
    public abstract name: string;
    public abstract sheet: string;

    protected attrs: AttrCollection;
    private element: HTMLElement
    public children: XAMLNode[];
    public parent: XAMLNode;
    public style: XAMLStyle;

    public clone<T extends XAMLNode>(attrs: AttrCollection, element: HTMLElement | XAMLNode, children: XAMLNode[]): T {
        // @ts-ignore
        const c: T = new this.constructor();

        c.attrs = attrs;
        c.element = element instanceof HTMLElement ? element : element.element;
        c.children = children;

        for (const style of XAMLManifest.current_manifest.styles) {
            if (style.of == c.sheet) {
                c.style = style.clone();
                break;
            }
        }

        if (c.style == null) {
            c.style = new XAMLStyle(null);
        }

        return c;
    }

    protected getElement(node: XAMLNode): HTMLElement | null {
        if (node instanceof XAMLComponent || node instanceof XAMLView) {
            return this.element;
        }

        return null;
    }

    public constructor() {
    }

    public abstract render(): void;

    public getElementByRef<T extends XAMLNode>(ref: string): T {
        let out: T = null;

        this.forEachChildren(node => {
            if (node.attrs.has("ref") && node.attrs.get("ref").split(";").includes(ref)) {
                out = <T>node;
                return false;
            }

            return true;
        });

        if (out == null) {
            throw `Cannot find element reference with '${ref}'`;
        }

        return out;
    }

    public getContents(): HTMLCollection {
        return this.element.getElementsByTagName("Content");
    }

    public replaceContentsWith(nodes: XAMLNode[]): void {
        const replacer: HTMLCollection = this.getContents();
        const children: HTMLElement[] = [];

        nodes.forEach(node => children.push(node.element));


        for (let k: number = 0; k < replacer.length; k++) {
            const replace: Element = replacer.item(k);
            replace.replaceWith(...children);
        }
    }

    public append(...nodes: XAMLNode[]): void {
        nodes.forEach(node => this.appendChild(node));
    }

    public appendChild(node: XAMLNode): void {
        node.parent = this;
        this.children.push(node);
        this.element.appendChild(node.element);
    }

    private forEachNode(cb: { (node: Element): boolean }, node: Element = this.element): boolean {
        if (node == this.element && !cb(node)) {
            return false;
        }

        for (let i = 0; i < node.children.length; i++) {
            if (!cb(node.children.item(i))) {
                return false;
            }

            if (node.children.length != 0) {
                if (!this.forEachNode(cb, node.children.item(i))) {
                    return false;
                }
            }
        }

        return true;
    }

    private forEachChildren(cb: { (node: XAMLNode): boolean }): boolean {
        for (const child of this.children) {
            if (!cb(child)) {
                return false;
            }

            if (child.children.length != 0) {
                if (!child.forEachChildren(cb)) {
                    return false;
                }
            }
        }

        return true;
    }

    protected setListener<T extends Event>(ev: keyof GlobalEventHandlersEventMap, cb: { (cb: T): void }): void {
        this.element.addEventListener(ev, cb);
    }
}

export abstract class XAMLComponent extends XAMLNode {
    public constructor() {
        super()
    }

    protected getElement(node: XAMLNode = this): HTMLElement | null {
        return super.getElement(node);
    }
}

export abstract class XAMLView extends XAMLNode {
    public get view(): HTMLElement {
        return this.getElement(this);
    };

    public appendChild(node: XAMLNode): void {
        /// View can only hold one child
        this.children[0].appendChild(node);
    }
}

export abstract class XAMLManifest {
    public static current_manifest: XAMLManifest;

    public abstract sheet: string;
    public readonly styles: XAMLStyle[]

    public constructor() {
        this.styles = [];
    }


    public start(): void {
        XAML.parseManifest(this);
        this.load();
        this.ready();
        window.addEventListener("load", () => {
            dispatchEvent(new Event("resize"));
        });
    }

    protected abstract load(): void;

    protected abstract ready(): void;
}

export class XAML {
    private static set: Set<XAMLNode> = new Set<XAMLNode>();
    private static parser: DOMParser = new DOMParser();

    public static register(x: XAMLNode): void {
        this.set.add(x);
    }

    public static parseXML(stream: string): XAMLNode {
        const xml: XMLDocument = this.parseXMLContent(stream);
        console.log(xml);

        return this.buildElements(xml.children)[0];
    }

    public static parseNode(node: XAMLNode): XAMLNode {
        const creation: XAMLNode = this.parseXML(vfs_read(node.sheet));
        creation.clone(AttrCollection.empty(), creation, creation.children);

        node = node.clone(AttrCollection.empty(), creation, [creation]);
        node.render();

        return node;
    }

    private static buildElement(element: XMLElement): XAMLNode {
        for (let node of this.set) {
            if (node.name == element.tagName) {
                if (node instanceof XAMLComponent) {
                    const creation: HTMLElement = <HTMLElement>this.parser.parseFromString(vfs_read(node.sheet), "text/html").body.children.item(0);
                    const collection: AttrCollection = AttrCollection.fromElement(element);

                    AttrCollection.mergeAttributes(creation, collection);
                    node = node.clone(collection, creation, []);
                    node.render();
                    return node;
                }

                const child: XAMLNode = this.parseXML(vfs_read(node.sheet));
                console.log(">>>", child);
                node = node.clone(AttrCollection.fromElement(element), child, [child]);
                console.log(">>>", node.children);

                return node;
            }
        }

        throw `Could not find node ${element.tagName}`;
    }

    private static buildElements(collection: XMLCollection): XAMLNode[] {
        const items: XAMLNode[] = [];

        for (let i: number = 0; i < collection.length; i++) {
            const child: XMLElement = collection.item(i);
            const element: XAMLNode = this.buildElement(child);

            if (child.children.length != 0) {
                const children: XAMLNode[] = this.buildElements(child.children);
                element.append(...children);
                element.replaceContentsWith(children);
            }
            items.push(element);
        }
        return items;
    }

    public static activate<T extends XAMLNode>(template: typeof XAMLNode, collection: AttrCollection): T {
        // @ts-ignore
        let node: T = <T>(new template());
        if (node instanceof XAMLComponent) {
            const creation: HTMLElement = <HTMLElement>this.parser.parseFromString(vfs_read(node.sheet), "text/html").body.children.item(0);
            AttrCollection.mergeAttributes(creation, collection);
            node = node.clone(collection, creation, []);
            node.render();
        } else {
            const creation: XAMLNode = this.parseXML(vfs_read(node.sheet));
            node = node.clone(collection, creation, [creation]);
            node.render();
        }
        return node;
    }

    private static onesLoaded: boolean = false;

    public static displayView(node: XAMLView): void {
        document.body.style.margin = "0";
        node = <XAMLView>XAML.parseNode(node);
        for (let i = 0; i < document.body.children.length; i++) {
            document.body.children.item(i).remove();
        }

        document.body.appendChild(node.view);

        if (this.onesLoaded) {
            dispatchEvent(new Event("resize"));
        } else {
            window.addEventListener("load", () => {
                dispatchEvent(new Event("resize"));
                this.onesLoaded = true;
            });
        }
    }

    public static parseManifest(manifest: XAMLManifest): void {
        const xml: XMLDocument = this.parseXMLContent(vfs_read(manifest.sheet));
        if (xml.children[0].tagName != "Manifest") {
            throw `SyntaxError in the Manifest file '${manifest.sheet}'`;
        }

        const root: XMLElement = xml.children[0];
        this.forEachCollection(root.getElementsByTagName("StyleGroup"), (group: XMLElement) => {
            this.forEachCollection(group.getElementsByTagName("File"), (file: XMLElement) => {
                const attrs: AttrCollection = AttrCollection.fromElement(file);
                const path: string = attrs.get("path");
                const style = new XAMLStyle(path);
                this.parseStyle(style);
                manifest.styles.push(style);
            });
        });

        XAMLManifest.current_manifest = manifest;
    }

    public static parseStyle(style: XAMLStyle): void {
        function parse_quartet(x: string | null): (StyleSizeValue | null)[] {
            if (x == null) {
                return null;
            }

            const parts: StyleSizeValue[] = <StyleSizeValue[]>x.split(" ");

            if (parts.length == 1) {
                return [parts[0], parts[0], parts[0], parts[0]];
            } else if (parts.length == 2) {
                return [parts[0], parts[1], parts[0], parts[1]];
            } else if (parts.length == 4) {
                return [parts[0], parts[1], parts[2], parts[3]];
            }

            throw "Unable to parse quartet style property";
        }

        function read_element<T>(of: XMLElement, name: string, dValue: T): T {
            const elements = of.getElementsByTagName(name)
            if (elements.length == 0) {
                return dValue;
            }

            return <T>elements[0].innerHTML;
        }

        const xml: XMLDocument = this.parseXMLContent(vfs_read(style.sheet));
        if (xml.children[0].tagName != "Style") {
            throw `SyntaxError in the Style file '${style.sheet}'`;
        }
        const root: XMLElement = xml.children[0];
        const attrs = AttrCollection.fromElement(root);
        style.of = attrs.get("of");
        style.width = read_element(root, "Width", null);
        style.height = read_element(root, "Height", null);

        style.padding = parse_quartet(read_element(root, "Padding", null));
        style.margin = parse_quartet(read_element(root, "Margin", null));

        style.foreground = read_element(root, "Foreground", null);
        style.background = read_element(root, "Background", null);

        this.forEachCollection(root.getElementsByTagName("Costume"), (node: XMLElement) => {
            const attr: AttrCollection = AttrCollection.fromElement(node);
            const key: string = attr.get("key");
            const value: string = attr.get("value");

            style.costume = style.costume ?? {};
            style.costume[key] = value;
        });

        // TODO add styles
    }

    private static forEachCollection(collection: HTMLCollection, cb: { (node: Element): void }): void {
        for (let i: number = 0; i < collection.length; i++) {
            cb(collection.item(i));
        }
    }

    private static parseXMLContent(content: string): XMLDocument {
        content = content.replace(/xmlns=".*"/gi, "");
        return this.parser.parseFromString(content, "text/xml");
    }

    public static loadModule(mod: { (): void }): void {
        mod();
    }
}

const ATTR_FORWARD_LIST: string[] = [];

export class AttrCollection {
    private attrs: Map<string, string>;

    private constructor(attrs: Map<string, string>) {
        this.attrs = attrs;
    }

    public getOrDefault(name: string, dValue: string = ""): string {
        if (this.attrs.has(name)) {
            return this.map(this.attrs.get(name));
        }

        return dValue;
    }

    public get(name: string): string {
        if (this.attrs.has(name)) {
            return this.map(this.attrs.get(name));
        }

        throw `Undefined attribute '${name}'`;
    }

    public has(name: string): boolean {
        return this.attrs.has(name);
    }

    public isEmpty(): boolean {
        return this.attrs.size == 0;
    }

    public [Symbol.iterator](): IterableIterator<[key: string, value: string]> {
        return this.attrs.entries();
    }

    private map(key: string): string {
        if (key.startsWith("@static/")) {
            let substring: string = key.substring(8);
            if (substring.startsWith("R.")) {
                substring = substring.substring(2);
                const parts: string[] = substring.split(".");
                let r: any = R;
                for (const part of parts) {
                    r = r[part];
                    if (r == undefined) {
                        throw `Undefined static reference '${key}'`;
                    }
                }

                key = <string>r;
            }
        }

        return key;
    }

    public static fromElement(x: Element): AttrCollection {
        const map: Map<string, string> = new Map<string, string>();

        x.getAttributeNames().forEach(attr => {
            map.set(attr, x.getAttribute(attr));
        });

        return new AttrCollection(map);
    }

    public static of(attrs: { [key: string]: string }): AttrCollection {
        const map: Map<string, string> = new Map<string, string>();

        Object.keys(attrs).forEach(key => {
            map.set(key, attrs[key]);
        });

        return new AttrCollection(map);
    }

    public static empty(): AttrCollection {
        return new AttrCollection(new Map<string, string>());
    }

    public static mergeAttributes(x: Element, collection: AttrCollection): void {
        for (const [key, value] of collection) {
            if (ATTR_FORWARD_LIST.includes(key)) {
                if (x.hasAttribute(key)) {
                    if (!x.getAttribute(key).split(";").includes(value)) {
                        x.setAttribute(key, x.getAttribute(key) + ";" + value);
                    }
                } else {
                    x.setAttribute(key, value);
                }
            }
        }
    }
}