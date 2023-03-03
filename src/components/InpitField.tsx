import {createEffect, ParentComponent} from "solid-js";
import {FieldOptions} from "./FormField";
import {createSignal} from "solid-js";
import {createKeyHold} from "@solid-primitives/keyboard";


const openSubSettings = (element?: HTMLElement) => {
    // console.log("opening");
    if (element) {
        element.querySelector('.form__field-settings')!.classList.remove('none');
        setTimeout(() => {
            element.querySelector('.form__field-settings')!.classList.add('open');
        }, 10);
    }
};

const closeSubSettings = (element?: HTMLElement) => {
    // console.log("closing");
    if (element) {
        element.querySelector('.form__field-settings')!.classList.remove('open');
        setTimeout(() => {
            element.querySelector('.form__field-settings')!.classList.add('none');
        }, 300);
    }
};

const InputField: ParentComponent<FieldOptions> = (props) => {
    const [element, setElement] = createSignal<HTMLElement>();
    const pressing = createKeyHold("Escape", {preventDefault: false});

    createEffect(() => {
        if (pressing()) closeSubSettings(element());
    });

    if (!props.children)
        return (
            <div class="form__field">
                <label for={props.htmlID} class="form__field-label">
                    <span class={"svg " + props.svg}></span>
                    <div class="alert"></div>
                </label>
                <input id={props.htmlID} type={props.fieldType} class="form__field-input" placeholder={props.content}
                       title={props.content} autocomplete="off"/>
            </div>
        );
    else
        return (
            <div class="form__field customizable" ref={setElement}>
                <label for={props.htmlID} class="form__field-label cur-help">
                    <span class={`svg ${props.svg}`}></span>
                    <div class="form__field-description">
                        {props.description}
                    </div>
                    <div class="alert"></div>
                </label>
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
                    {/*{% include 'components/title_settings.html' %}*/}
                    {props.children}
                </div>
            </div>
        );
}

export default InputField;