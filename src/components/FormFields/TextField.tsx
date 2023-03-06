import {createEffect, ParentComponent} from "solid-js";
import {FieldOptions} from "../FormField";
import {createSignal} from "solid-js";
import {createKeyHold} from "@solid-primitives/keyboard";
import InputFieldDescription from "./InputFieldDescription";
import {openSubSettings, closeSubSettings} from "../FormField";


const TextField: ParentComponent<FieldOptions> = (props) => {
    const [element, setElement] = createSignal<HTMLElement>();
    const pressing = createKeyHold("Escape", {preventDefault: false});

    createEffect(() => {
        if (pressing()) closeSubSettings(element());
    });

    if (!props.children)
        return (
            <div class="form__field">
                <InputFieldDescription {...props}/>
                <input id={props.htmlID} type={props.fieldType} class="form__field-input" placeholder={props.content}
                       title={props.content} autocomplete="off"/>
            </div>
        );
    else
        return (
            <div class="form__field customizable" ref={setElement}>
                <InputFieldDescription {...props}/>
                <input id={props.htmlID} type={props.fieldType} class="form__field-input" placeholder={props.content}
                       title={props.content}/>
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

export default TextField;