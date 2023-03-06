import {ParentComponent} from "solid-js";
import {FieldOptions} from "../FormField"

const InputFieldDescription: ParentComponent<FieldOptions> = (props) => {

    if (!props.description)
        return (
            <label for={props.htmlID} class="form__field-label">
                <span class={"svg " + props.svg}></span>
                <div class="alert"></div>
            </label>
        );
    else
        return (
            <label for={props.htmlID} class="form__field-label cur-help">
                <span class={`svg ${props.svg}`}></span>
                <div class="form__field-description">
                    {props.description}
                </div>
                <div class="alert"></div>
            </label>

        );
};

export default InputFieldDescription;