import {createEffect, ParentComponent, Component, onMount, JSX, createSignal, For} from "solid-js";
import {FieldOptions} from "../FormField";
import {createKeyHold} from "@solid-primitives/keyboard";
import InputFieldDescription from "./InputFieldDescription";
import {openSubSettings, closeSubSettings} from "../FormField";

import {open} from '@tauri-apps/api/dialog';
import {readBinaryFile, readTextFile} from '@tauri-apps/api/fs';

import {invoke} from '@tauri-apps/api/tauri';

import toast from 'solid-toast';


const maximumSize = 20 * 1024 * 1024; // 20mb

type FileTypes = {
    filesPath: null | string | string[],
    allowedType: string
}
const allowedMimeTypes = [
    "text/html",
    "text/plain",
    "text/css",
    "application/pdf",
    // image
    "image/apng", "image/avif", "image/gif", "image/jpeg", "image/png", "image/svg+xml", "image/webp",
    // audio/video
    "audio/wave", "audio/wav", "audio/x-wav", "audio/x-pn-wav", "audio/webm", "video/webm", "audio/ogg", "video/ogg", "application/ogg",
    "audio/mp4", "video/mp4", "application/mp4"
];
const excelMimeTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel.sheet.macroEnabled.12",
    "application/vnd.ms-excel.addin.macroEnabled.12",
    "application/vnd.ms-excel.template.macroEnabled.12",
    "application/vnd.ms-excel.sheet.binary.macroEnabled.12"
]

// const FilePreview: Component<FileTypes> = (props) => {
//     const [iframeUrl, setIframeUrl] = createSignal<string>();
//
//
//     onMount(async () => {
//         let mimeType = await getMimeType(`${props.filesPath}`);
//         // console.log("Mime: " + mimeType);
//
//         if (allowedMimeTypes.includes(mimeType)) {
//             const fileSize = await invoke<string>('get_file_size', {filePath: `${props.filesPath}`});
//             console.log(`File size: ${fileSize}`);
//             if (parseInt(fileSize) <= maximumSize) {
//
//                 const binaryData: Uint8Array = await readBinaryFile(`${props.filesPath}`);
//                 const blob = new Blob([binaryData], {type: mimeType});
//
//                 setIframeUrl(prevURL => URL.createObjectURL(blob));
//
//                 // const extension = `${props.filesPath}`.split('.').pop()!;
//                 // console.log(extension);
//             } else {
//                 toast.error(`Oops! File is to big.`, {style: {"font-size": "1.4rem"}});
//             }
//         } else {
//             toast.error(`Oops! Unable to preview file: ${props.filesPath}`, {style: {"font-size": "1.4rem"}});
//         }
//     });
//
//     async function getMimeType(filePath: string): Promise<string> {
//         try {
//             const mimeType = await invoke<string>('get_mime_type', {filePath: `${props.filesPath}`});
//             return mimeType;
//         } catch (error) {
//             console.error('Error getting MIME type:', error);
//             throw error;
//         }
//     }
//
//
//     return (
//         <div>
//             {iframeUrl() && (
//                 <>
//                     <iframe src={iframeUrl()} width="100%" height="500"></iframe>
//                 </>
//             )}
//         </div>
//     );
// };

interface Previews {
    iframe: JSX.Element,
    size: number,
    name: string
}

const FileField: ParentComponent<FieldOptions> = (props) => {

    const [element, setElement] = createSignal<HTMLElement>();
    const pressing = createKeyHold("Escape", {preventDefault: false});
    const [files, setFiles] = createSignal<null | string | string[]>();
    const [iframes, setIframes] = createSignal<Previews[]>([]);

    const [cells, setCells] = createSignal<string[]>();

    createEffect(() => {
        if (pressing()) closeSubSettings(element());
    });

    const checkFile = async (filePath: string) => {
        setCells();
        let mimeType = await getMimeType(filePath);
        // console.log("Mime: " + mimeType);

        if (allowedMimeTypes.includes(mimeType)) {
            const fileSize = await invoke<string>('get_file_size', {filePath: filePath});
            // console.log(`File size: ${fileSize}`);
            if (parseInt(fileSize) <= maximumSize) {

                const binaryData: Uint8Array = await readBinaryFile(filePath);
                const blob = new Blob([binaryData], {type: mimeType});

                // setIframeUrl(prevURL => URL.createObjectURL(blob));
                const newIframe = <iframe src={URL.createObjectURL(blob)} width="100%" height="500"></iframe>;
                // setIframes(prevIframes => [...prevIframes, newIframe]);
                setIframes(prevIframes => [...prevIframes, {
                    iframe: newIframe,
                    size: parseInt(fileSize),
                    name: filePath
                }]);


                // const extension = `${props.filesPath}`.split('.').pop()!;
                // console.log(extension);
            } else {
                toast.error(`Oops! File is to big.`, {style: {"font-size": "1.4rem"}});
            }
        } else {
            if (excelMimeTypes.includes(mimeType)) {
                invoke('get_excel_header', {
                    filePath: filePath
                })
                    .then((excelHeader) => {
                        // console.log(`Header: ${excelHeader}. Type: ${typeof excelHeader}.`);

                        return excelHeader as string[]
                    })
                    .then((excelHeader: string[]) => {
                        if (excelHeader.length <= 0)
                            throw new Error("An error occurred while reading the file. Try choosing a different file.");
                        for (let el of excelHeader) {
                            // console.log(el)
                        }
                        setCells(excelHeader);
                    })
                    .catch((error) => {
                        console.error(`Error: ${error}`);
                    });
            } else {
                toast.error(`Oops! Unable to preview file: ${files()}`, {style: {"font-size": "1.4rem"}});
            }
        }
    }

    async function getMimeType(filePath: string): Promise<string> {
        try {
            const mimeType = await invoke<string>('get_mime_type', {filePath: filePath});
            return mimeType;
        } catch (error) {
            console.error('Error getting MIME type:', error);
            throw error;
        }
    }

    ////////////////////////////////////////////////////
    async function openFile() {
        setFiles(null);
        setIframes([]);
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
            for (const filePath of selected) checkFile(filePath);
        } else if (selected === null) {
            // user cancelled the selection
            console.log(`user cancelled the selection`);
        } else {
            // user selected a single directory
            console.log(`user selected a single directory`);
            checkFile(selected);
        }

    }


    return (
        <div class={files() || props.children ? "form__field customizable" : "form__field"} ref={setElement}>
            <InputFieldDescription {...props}/>
            <div id={props.htmlID} class="form__field-input cur-pointer" title={props.content} onClick={openFile}>
                {/*{files() ? `Selected file: ${files()}` : props.content}*/}
                {files() ? (files()?.length! <= 1 ? `${files()}` : `${files()?.length} files have been selected`) : props.content}
            </div>
            {(files() && iframes() || props.children) && (
                <>
                    <span class="form__field-label settings active" onClick={() => openSubSettings(element())}>
                        <span class="svg settings-v2"></span>
                    </span>
                    <div class={"form__field-settings none"}>
                        <div class="form__field-settings__close">
                            <div class="burger active" onClick={() => closeSubSettings(element())}>
                                <span class="burger__span"></span>
                            </div>
                        </div>
                        {/*{files() && <FilePreview filesPath={files()!} allowedType={props.fieldType}/>}*/}
                        {iframes() &&
                            <ul class="selected-files">
                                <For each={iframes()}>{(preview, i) =>
                                    <li>
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td>{i() + 1}.</td>
                                                <td>Name</td>
                                                <td>Size</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>{preview.name}</td>
                                                <td>{Math.ceil(preview.size / 1024).toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$& ")}kb</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        {preview.iframe}
                                    </li>
                                }</For>
                            </ul>
                        }
                        {cells() &&
                            <>
                                <div class="select-columns">
                                    <For each={cells()}>{(cell, i) =>
                                        <div class="select-columns__column">
                                            <div class="select-columns__column-name">{cell}</div>
                                            <div class="select-columns__select">
                                                <select size="{i() + 1}">
                                                    <option value="">Select an option</option>
                                                    <option value="1">E-mail</option>
                                                    <option value="2">Name</option>
                                                    <option value="3">Surname</option>
                                                </select>
                                            </div>
                                        </div>
                                    }</For>
                                </div>
                            </>
                        }
                        <br/><br/><br/><br/><br/><br/><br/><br/>
                        {props.children}
                    </div>
                </>
            )}
        </div>
    );
}

export default FileField;