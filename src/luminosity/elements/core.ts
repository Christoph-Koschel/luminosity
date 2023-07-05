import {XAML} from "../builder/xaml";
import {AbsoluteLayout, LinearLayout, RelativeLayout} from "./layout";
import {Button, EditText, TextView} from "./text";

export function load_core(): void {
    XAML.register(new AbsoluteLayout());
    XAML.register(new LinearLayout());
    XAML.register(new RelativeLayout());
    XAML.register(new TextView());
    XAML.register(new Button());
    XAML.register(new EditText());
}
