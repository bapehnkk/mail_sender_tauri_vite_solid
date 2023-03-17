import {ParentComponent} from "solid-js";
import {FieldOptions} from "../FormField"

const InputFieldDescription: ParentComponent<FieldOptions> = (props) => {

    return (
        <>
            {props.description ?
                <label for={props.htmlID} class="form__field-label cur-help">
                    <span class={`svg ${props.svg}`}></span>
                    {props.link ?
                        <a target="_blank"
                           class="form__field-description"
                           href={props.link}>
                            {props.description}
                        </a> :
                        <div class="form__field-description">
                            {props.description}
                        </div>
                    }
                    <div class="alert"></div>
                </label>
                :
                <label for={props.htmlID} class="form__field-label">
                    <span class={"svg " + props.svg}></span>
                    <div class="alert"></div>
                </label>
            }
        </>
    );
};

export default InputFieldDescription;