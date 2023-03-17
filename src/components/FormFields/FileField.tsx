import {createEffect, createSignal, For, JSX, ParentComponent} from "solid-js";
import {closeSubSettings, FieldOptions, openSubSettings} from "../FormField";
import {createKeyHold} from "@solid-primitives/keyboard";
import InputFieldDescription from "./InputFieldDescription";

import {open} from '@tauri-apps/api/dialog';
import {readBinaryFile} from '@tauri-apps/api/fs';

import {invoke} from '@tauri-apps/api/tauri';

import toast from 'solid-toast';
import ExcelSelect from "./ExcelSelect";


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

    const [files, setFiles] = createSignal<string[]>([]);
    const [totalWeight, setTotalWeight] = createSignal<number>(0);

    const [iframes, setIframes] = createSignal<Previews[]>([]);
    const [cells, setCells] = createSignal<string[]>();

    const pressing = createKeyHold("Escape", {preventDefault: false});
    createEffect(() => {
        if (pressing()) closeSubSettings(element()!);
    });


    const checkFile = async (filePath: string) => {
        const fileSize = await invoke<string>('get_file_size', {filePath: filePath});
        if (parseInt(fileSize) + totalWeight() <= maximumSize) {
            setTotalWeight(parseInt(fileSize) + totalWeight());
            setFiles([filePath, ...files()]);
            console.log(`F: ${files()}`);


            let mimeType = await getMimeType(filePath);
            if (allowedMimeTypes.includes(mimeType)) {
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
            } else if (excelMimeTypes.includes(mimeType) && props.fieldType == "excel") {
                invoke('get_excel_header', {
                    filePath: filePath
                })
                    .then((excelHeader) => {
                        // console.log(`Header: ${excelHeader}. Type: ${typeof excelHeader}.`);

                        return excelHeader as string[]
                    })
                    .then((excelHeader: string[]) => {
                        if (excelHeader.length <= 0)
                            throw new Error("An error occurred while reading the file. Try choosing a different file. \nMake sure the file contains at least 1 email");
                        // for (let el of excelHeader) {
                        //     // console.log(el)
                        // }
                        // setCells(excelHeader);
                        setIframes(prevIframes => [...prevIframes, {
                            iframe: <ExcelSelect cells={excelHeader}/>,
                            size: parseInt(fileSize),
                            name: filePath
                        }]);
                    })
                    .catch((error) => {
                        console.error(`Error: ${error}`);
                        toast.error(`${error}`, {style: {"font-size": "1.4rem"}});
                        setFiles([]);
                    });

            } else {
                setIframes(prevIframes => [...prevIframes, {
                    iframe: <></>,
                    size: parseInt(fileSize),
                    name: filePath
                }]);
            }

        } else {
            toast.error(`Oops! Total weight already filled or file "${filePath}" is to big.`, {
                style: {
                    "font-size": "1.4rem",
                    "overflow": "scroll"
                }
            });
        }
    }

    async function getMimeType(filePath: string): Promise<string> {
        try {
            return await invoke<string>('get_mime_type', {filePath: filePath});
        } catch (error) {
            console.error('Error getting MIME type:', error);
            throw error;
        }
    }

    ////////////////////////////////////////////////////
    async function openFile() {
        setFiles([]);
        setIframes([]);
        setCells();
        let selected: null | string | string[];

        switch (props.fieldType) {
            case "files": {
                selected = await open({
                    multiple: true
                });
                break;
            }
            case "pdf": {
                selected = await open({
                    filters: [{
                        name: "Pdf",
                        extensions: ["pdf"]
                    }]
                });
                break;
            }
            case "html": {
                selected = await open({
                    filters: [{
                        name: "Html",
                        extensions: ["html"]
                    }]
                });
                break;
            }
            case "excel": {
                selected = await open({
                    filters: [{
                        name: "Excel",
                        extensions: ["xlsx", "xlsm", "xlsb", "xltx", "xltm", "xls", "xlt", "xlam", "xla", "xlw"]
                    }]
                });
                break;
            }

            default: {
                // fieldType == file
                selected = await open();
                break;
            }
        }


        if (Array.isArray(selected)) {
            // user selected multiple directories
            console.log(`user selected multiple directories`);
            for (const filePath of selected) checkFile(filePath);
        } else if (selected === null) {
            // user cancelled the selection
            console.log(`user cancelled the selection`);
        } else {
            // user selected a single directoryf
            console.log(`user selected a single directory`);
            checkFile(selected);
        }

    }


    return (
        <div class={files().length > 0 || props.children ? "form__field customizable" : "form__field"} ref={setElement}>
            <InputFieldDescription {...props}/>
            <div id={props.htmlID} class="form__field-input cur-pointer" title={props.content} onClick={openFile}>
                {/*{files() ? `Selected file: ${files()}` : props.content}*/}
                {
                    files().length > 0 ? (
                        files().length === 1 ?
                            `${files()}` :
                            (props.fieldType === "files" ?
                                `${files()?.length} files have been selected` :
                                `${files()}`)
                    ) : props.content
                }
            </div>
            {(files().length > 0 && iframes() || props.children) &&
                <>
                    <span class="form__field-label settings active" onClick={() => openSubSettings(element()!)}>
                        <span
                            class={(files().length > 0 || cells()) ? "svg settings-v2 visibility" : "svg settings-v2"}></span>
                    </span>
                    <div class={"form__field-settings none"}>
                        <div class="form__field-settings__close">
                            <div class="burger active" onClick={() => closeSubSettings(element()!)}>
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
                                                <td>
                                                    {Math.ceil(preview.size / 1024).toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$& ")}kb
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        {preview.iframe}
                                    </li>
                                }</For>
                            </ul>
                        }
                        {cells() &&
                            <ExcelSelect cells={cells()}/>
                        }
                        <br/><br/><br/><br/><br/><br/><br/><br/>
                        {props.children}
                    </div>
                </>
            }
        </div>
    );
}

export default FileField;