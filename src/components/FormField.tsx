import {Component, createSignal, JSX, ParentComponent} from "solid-js";
import TextField from "./FormFields/TextField";
import TextareaField from "./FormFields/TextareaField";
import FileField from "./FormFields/FileField";
import SubmitBtn from "./FormFields/SubmitBtn";
import CheckboxField from "./FormFields/CheckboxField";

const openSubSettings = (element: HTMLElement) => {
    // console.log("opening");
    if (element) {
        element.querySelector('.form__field-settings')?.classList.remove('none');
        setTimeout(() => {
            element.querySelector('.form__field-settings')?.classList.add('open');
            setTimeout(() => {
                const height = (element.querySelector('.form__field-settings.open') as HTMLElement)?.offsetHeight;
                // console.log("Height: " + height);
                // (element.querySelector('.form__field-settings.open') as HTMLElement)!.style.height = `${height}px`;
            }, 1000)
        }, 10);
    }
};

const closeSubSettings = (element: HTMLElement) => {
    // console.log("closing");
        element.querySelector('.form__field-settings')?.classList.remove('open');
        setTimeout(() => {
            element.querySelector('.form__field-settings')?.classList.add('none');
        }, 300);
};
interface DescriptionOptions {
    description: string,
    link?: string
}

export interface  FieldOptions {
    fieldType: "text" | "password" | "email" | "excel" | "pdf" | "html" | "file" | "files" | "textarea" | "checkbox" | "submit",
    htmlID: string,
    svg?: string,
    content?: string,
    description?: DescriptionOptions
}

interface FieldTypes {
    [key: string]: JSX.Element
}

const getFieldComponent = (props: FieldOptions): JSX.Element => {
    const [fieldComponents] = createSignal<FieldTypes>({
        textarea: <TextareaField {...props}></TextareaField>,

        text: <TextField {...props}></TextField>,
        password: <TextField {...props}></TextField>,
        email: <TextField {...props}></TextField>,

        excel: <FileField {...props}></FileField>,
        pdf: <FileField {...props}></FileField>,
        html: <FileField {...props}></FileField>,
        file: <FileField {...props}></FileField>,
        files: <FileField {...props}></FileField>,

        checkbox: <CheckboxField {...props}></CheckboxField>,

        submit: <SubmitBtn {...props}></SubmitBtn>
    });

    return fieldComponents()[props.fieldType];
}

const Field: ParentComponent<FieldOptions> = (props) => {
    return getFieldComponent(props)
}

export {openSubSettings, closeSubSettings};
export default Field;