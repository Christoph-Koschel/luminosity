import {XAML} from "../luminosity/builder/xaml";
import {AbsoluteLayout, LinearLayout, RelativeLayout} from "./layout";
import {Button, EditText, Link, TextView} from "./text";
import {Image} from "./media";

export function load_core(): void {
    XAML.register(new AbsoluteLayout());
    XAML.register(new LinearLayout());
    XAML.register(new RelativeLayout());
    XAML.register(new TextView());
    XAML.register(new Button());
    XAML.register(new EditText());
    XAML.register(new Link());
    XAML.register(new Image())
}
