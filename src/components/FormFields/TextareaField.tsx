import {createEffect, ParentComponent} from "solid-js";
import {FieldOptions} from "../FormField";
import {createSignal} from "solid-js";
import {createKeyHold} from "@solid-primitives/keyboard";
import {openSubSettings, closeSubSettings} from "../FormField";




const TextareaField: ParentComponent<FieldOptions> = (props) => {
    const [element, setElement] = createSignal<HTMLElement>();
    const pressing = createKeyHold("Escape", {preventDefault: false});

    createEffect(() => {
        if (pressing()) closeSubSettings(element());
    });

    return (
        <div class="form__field customizable textarea" ref={setElement}>
            <textarea
                id="mail-text"
                class="form__field-input"
                name=""
                cols="30"
                rows="10"
                placeholder="Mail text"
                title="Mail text"
            ></textarea>
            <span class="form__field-label settings active" onClick={() => openSubSettings(element())}>
                <span class="svg settings-v2"></span>
            </span>
            <div class={"form__field-settings"}>
                <div class="form__field-settings__close ">
                    <div class="burger active" onClick={() => closeSubSettings(element())}>
                        <span class="burger__span"></span>
                    </div>
                </div>
                {props.children}
            </div>
        </div>
    );
}

export default TextareaField;