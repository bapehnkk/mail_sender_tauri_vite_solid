import {Component, ParentComponent} from "solid-js";
import InputField from "./InpitField";

export type FieldOptions = {
    htmlID: string,
    svg: string,
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
                    <textarea></textarea> :
                    <InputField
                        htmlID={props.htmlID}
                        svg={props.svg}
                        content={props.content}
                        fieldType={props.fieldType}
                        description={props.description}
                    >{props.children}</InputField>
                }


        </>
    );
}

export default Field;