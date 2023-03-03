import {Component, ParentComponent} from "solid-js";
import InputField from "./InpitField";
import TextareaField from "./TextareaField";

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

export type FieldOptions = {
    htmlID: string,
    svg?: string,
    fieldType: "text" | "password" | "file" | "files",
    content?: string,
    description?: string,
    isTextareaType?: boolean
}

const Field: ParentComponent<FieldOptions> = (props) => {
    return (
        <>
            {
                props.isTextareaType ?
                    <TextareaField {...props}></TextareaField> :
                    <InputField {...props}></InputField>
            }
        </>
    );
}

export {openSubSettings, closeSubSettings};
export default Field;