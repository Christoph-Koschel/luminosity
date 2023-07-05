export interface XAMLAllEventListeners extends XAMLClickListeners, XAMLMouseListeners, XAMLDragListeners, XAMLFocusListeners, XAMLKeyBoardListeners {

}

export interface XAMLClickListeners {
    addOnClickListener(cb: { (e: MouseEvent): void }): void;

    addOnRClickListener(cb: { (e: MouseEvent): void }): void;

    addOnDBClickListener(cb: { (e: MouseEvent): void }): void;
}

export interface XAMLMouseListeners {
    addOnMouseDownListener(cb: { (e: MouseEvent): void }): void;

    addOnMouseEnterListener(cb: { (e: MouseEvent): void }): void;

    addOnMouseLeaveListener(cb: { (e: MouseEvent): void }): void;

    addOnMouseMoveListener(cb: { (e: MouseEvent): void }): void;

    addOnMouseOverListener(cb: { (e: MouseEvent): void }): void;

    addOnMouseOutListener(cb: { (e: MouseEvent): void }): void;

    addOnMouseUpListener(cb: { (e: MouseEvent): void }): void;
}

export interface XAMLDragListeners {
    addOnDragListener(cb: { (e: DragEvent): void }): void;

    addOnDropListener(cb: { (e: DragEvent): void }): void;

    addOnDragEndListener(cb: { (e: DragEvent): void }): void;

    addOnDragEnterListener(cb: { (e: DragEvent): void }): void;

    addOnDragLeaveListener(cb: { (e: DragEvent): void }): void;

    addOnDragOverListener(cb: { (e: DragEvent): void }): void;

    addOnDragStartListener(cb: { (e: DragEvent): void }): void;
}

export interface XAMLFocusListeners {
    addOnFocusListener(cb: { (e: FocusEvent): void }): void;

    addOnFocusInListener(cb: { (e: FocusEvent): void }): void;

    addOnFocusOutListener(cb: { (e: FocusEvent): void }): void;
}

export interface XAMLKeyBoardListeners {
    addOnKeyDownListener(cb: { (e: KeyboardEvent): void }): void;

    addOnKeyUpListener(cb: { (e: KeyboardEvent): void }): void;

    addOnKeyPressListener(cb: { (e: KeyboardEvent): void }): void;

    addOnChangeListener(cb: { (e: KeyboardEvent): void }): void;
}