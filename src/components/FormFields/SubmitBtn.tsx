import {Component, For, onMount} from "solid-js";
import {FieldOptions} from "../FormField";


const SubmitBtn: Component<FieldOptions> = (props) => {
    let select: HTMLSelectElement | undefined;



    return (
        <div class="form__field">
            <button id={props.htmlID} class="form__field-submit" value="Send">
                Send
                <span class="svg send_mail"></span>
            </button>
        </div>
    );
};

export default SubmitBtn;