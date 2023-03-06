import {createEffect, ParentComponent, Component} from "solid-js";
import {FieldOptions} from "../FormField";
import {createSignal} from "solid-js";
import {createKeyHold} from "@solid-primitives/keyboard";
import InputFieldDescription from "./InputFieldDescription";
import {openSubSettings, closeSubSettings} from "../FormField";

import {open} from '@tauri-apps/api/dialog';
import {readBinaryFile, readTextFile} from '@tauri-apps/api/fs';





type FileTypes = {
    filesPath: null | string | string[]
}
const allowedFileTypes = [
    "text/html",
    "application/xhtml+xml",
    "image/svg+xml",
    "application/json",
    "application/pdf"
];

const FilePreview: Component<FileTypes> = (props) => {
    const [iframeSrc, setIframeSrc] = createSignal("");
    const [base64Data, setBase64Data] = createSignal<string>("");
    const extensions: string[] = [];
    for (const ext of props.filesPath!) extensions.push(ext);
    async function getSrc() {
        const binaryData = await readBinaryFile(`${props.filesPath}`);
        setBase64Data(btoa(String.fromCharCode(...binaryData)));
        console.log(base64Data)
    }
    getSrc();

    return (
        <div>
            {base64Data() && (
                <iframe src={`data:application/octet-stream;base64,${base64Data()}`} width="100%" height="500"></iframe>
            )}
            <img src={`data:image/svg+xml;base64,${base64Data()}`} alt=""/>
        </div>
    );

};


const FileField: ParentComponent<FieldOptions> = (props) => {

    const [element, setElement] = createSignal<HTMLElement>();
    const pressing = createKeyHold("Escape", {preventDefault: false});
    const [files, setFiles] = createSignal<null | string | string[]>();

    createEffect(() => {
        if (pressing()) closeSubSettings(element());
    });


    // function handleFileInputChange(event: Event) {
    //     console.log("This");
    //     const input = event.target as HTMLInputElement;
    //     const selectedFile = input.files && input.files[0];
    //
    //     if (selectedFile) {
    //         setFile(() => selectedFile);
    //         console.log(file()!.name);
    //     }
    // }

    async function openFile() {
        let selected: null | string | string[];

        if (props.fieldType === "files") {
            selected = await open({
                multiple: true
            });
        } else {
            selected = await open();
        }

        if (selected) setFiles(selected);

        if (Array.isArray(selected)) {
            // user selected multiple directories
            console.log(`user selected multiple directories`);
            console.log(selected);
        } else if (selected === null) {
            // user cancelled the selection
            console.log(`user cancelled the selection`);
            console.log(selected);
        } else {
            // user selected a single directory
            console.log(`user selected a single directory`);
            console.log(selected);
        }
    }


    return (
        <div class={files() || props.children ? "form__field customizable" : "form__field"} ref={setElement}>
            <InputFieldDescription {...props}/>
            <div id={props.htmlID} class="form__field-input cur-pointer" title={props.content} onClick={openFile}>
                {/*{files() ? `Selected file: ${files()}` : props.content}*/}
                {files() ? `${files()}` : props.content}
            </div>
            {(files() || props.children) && (
                <>
                    <span class="form__field-label settings active" onClick={() => openSubSettings(element())}>
                        <span class="svg settings-v2"></span>
                    </span>
                    <div class={"form__field-settings"}>
                        <div class="form__field-settings__close">
                            <div class="burger active" onClick={() => closeSubSettings(element())}>
                                <span class="burger__span"></span>
                            </div>
                        </div>
                        {files() ? <FilePreview filesPath={files()!} /> : props.content}
                        <br/><br/><br/><br/><br/><br/><br/><br/>
                        {props.children}
                    </div>
                </>
            )}
        </div>
    );
}

export default FileField;