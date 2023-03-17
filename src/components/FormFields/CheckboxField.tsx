import {ParentComponent, createSignal, For, onMount, createEffect} from "solid-js";
import InputFieldDescription from "./InputFieldDescription";
import {openSubSettings, closeSubSettings} from "../FormField";
import {FieldOptions} from "../FormField";
import {createKeyHold} from "@solid-primitives/keyboard";

const CheckboxField: ParentComponent<FieldOptions> = (props) => {
    const [element, setElement] = createSignal<HTMLDivElement>();
    const [duplicate, setDuplicate] = createSignal(false);

    const pressing = createKeyHold("Escape", {preventDefault: false});

    createEffect(() => {
        if (pressing()) closeSubSettings(element()!);
    });


    return (
        <div class={(duplicate() || props.children) ? "form__field customizable" : "form__field"} ref={setElement}>
            <InputFieldDescription {...props}/>


            <label for={props.htmlID} class="form__field-input cur-pointer">

                <input
                    id={props.htmlID}
                    type="checkbox"
                    class="d-none"
                    checked={duplicate()}
                    onchange={[setDuplicate, !duplicate()]}
                />
                <label
                    for={props.htmlID}
                    class="checkbox-label"
                >Toggle</label>
            </label>
            {(duplicate() || props.children) &&
                <>
                    <span class="form__field-label settings active" onClick={() => openSubSettings(element()!)}>
                        <span class={duplicate() ? "svg settings-v2 visibility" : "svg settings-v2"}></span>
                    </span>
                    <div class={"form__field-settings none"}>
                        <div class="form__field-settings__close ">
                            <div class="burger active" onClick={() => closeSubSettings(element()!)}>
                                <span class="burger__span"></span>
                            </div>
                        </div>
                        {props.children}
                    </div>
                </>
            }
        </div>
    );
};


export default CheckboxField;