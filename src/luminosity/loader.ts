import {AttrCollection, XAML, XAMLManifest, XAMLNode, XAMLView} from "./builder/xaml";
import {R} from "./vfs";
import {XAMLClickListeners} from "./builder/events";
import {Button, TextView} from "./elements/text";
import {load_core} from "./elements/core";

class Calculator extends XAMLView {
    name: string = "Calculator";
    sheet: string = R.test.Calculator;

    private output: TextView;

    render(): void {
        this.output = this.getElementByRef("output");
        this.output.setText("");

        // (<Button>this.getElementByRef("back")).addOnClickListener(ev => {
        //     XAML.displayView(new Index());
        // });

        for (let i: number = 0; i <= 9; i++) {
            const btn: Button = this.getElementByRef("b" + i);
            btn.addOnClickListener(ev => {
                this.output.appendText(i.toString());
            });
        }

        (<Button>this.getElementByRef("bC")).addOnClickListener(ev => {
            this.output.setText("");
        });

        ["+", "-", "*", "/"].forEach(op => {
            const btn: Button = this.getElementByRef("b" + op);
            btn.addOnClickListener(ev => {
                this.output.appendText(op);
            });
        });

        (<Button>this.getElementByRef("b=")).addOnClickListener(ev => {
            const str: string = this.output.getText();
            try {
                let result: string = eval(str).toString();
                this.output.setText(result);
            } catch {
                this.output.setText("FAILURE");
            }
        });
    }

}

class Index extends XAMLView {
    name: string = "Index";
    sheet: string = R.test.Index;

    render(): void {
        const apps: XAMLView[] = [new Calculator()];

        for (let app of apps) {
            let item: ListItem = XAML.activate(ListItem, AttrCollection.empty());
            item.setTitle(app.name);
            this.appendChild(item);
            item.addOnClickListener(() => {
                XAML.displayView(app);
            });
        }
    }
}

class ListItem extends XAMLNode implements XAMLClickListeners {
    public name: string = "ListItem";
    public sheet: string = R.test.comp.ListItem;

    private title: TextView;

    render(): void {
        this.title = this.getElementByRef("title");
    }

    public setTitle(text: string): void {
        this.title.setText(text);
    }

    public addOnClickListener(cb: { (e: MouseEvent): void }): void {
        this.setListener("click", cb);
    }

    public addOnDBClickListener(cb: { (e: MouseEvent): void }): void {
        this.setListener("dblclick", cb);
    }

    public addOnRClickListener(cb: { (e: MouseEvent): void }): void {
        this.setListener("contextmenu", cb);
    }
}

class App extends XAMLManifest {
    sheet: string = R.Manifest;

    protected load(): void {
        XAML.loadModule(load_core);
        XAML.register(new ListItem());
    }

    protected ready(): void {
        XAML.displayView(new Calculator());
    }
}


const app: App = new App();
app.start();

