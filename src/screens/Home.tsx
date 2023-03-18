import Field from "../components/FormField"
import {createEffect, createSignal, onMount} from 'solid-js';
import {invoke} from "@tauri-apps/api/tauri";
import {listen} from '@tauri-apps/api/event';

import toast from 'solid-toast';
import * as querystring from "querystring";

// type mailFields = {
//     sendersName: string,
//     title: string,
//     recipientsName: string,
//     text: string,
//     files: string[],
// }

interface Selects {
    selectedEmails: string[],
    selectedNames: string[],
    selectedSurnames: string[],
}

interface Excel {
    filePath: string,
    selects: Selects
}

export default function HomeScreen() {

    const [title, setTitle] = createSignal<string>();

    const getSelects = (inputExcel: HTMLElement) => {
        let selects: Selects = {
            "selectedEmails": [],
            "selectedNames": [],
            "selectedSurnames": [],
        };
        inputExcel!.parentElement!.querySelectorAll('select').forEach(elem => {
            const columnName = elem.parentElement!.parentElement!.querySelector(".select-columns__column-name")!.innerHTML;
            if (elem.value === '1') {
                selects["selectedEmails"].push(columnName);
            } else if (elem.value === '2') {
                selects["selectedNames"].push(columnName);
            } else if (elem.value === '3') {
                selects["selectedSurnames"].push(columnName);
            }
        });
        return selects;
    };


    async function sendMail() {
        const getElValue = (id: string): string => {
            const input = document.getElementById(id) as HTMLInputElement | null;
            return input!.value;
        };
        let files: string[] = Array.from(document.getElementById("choose-files")!.parentElement!.querySelectorAll(".fileName"), fileName => fileName.innerHTML);

        const excel: Excel = {
            filePath: document.getElementById("choose-excel")!.innerHTML,
            selects: getSelects(document.getElementById("choose-excel")!)
        };

        const mailFields = {
            senders_name: getElValue("sender-name"),
            title: getElValue("mail-title"),
            recipients_name: getElValue("recipients-name"),
            text: getElValue("mail-text"),
            files: files,
            excel_path: excel.filePath,
            selected_emails: excel.selects.selectedEmails,
            selected_names: excel.selects.selectedNames,
            selected_surnames: excel.selects.selectedSurnames,
        };

        // console.log(MailFields);

        invoke('start_mail_sending', {message: mailFields})
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });

    }

    async function greet() {
        const input = document.getElementById('title') as HTMLInputElement | null;
        const value: string = input!.value;
        console.log(value); // 👉️ "Initial value"

        const ret: string = await invoke("greet", {name: value});
        setTitle(ret);
        console.log(title());
    }

    createEffect(() => {
        if (title())
            toast.success(title());
    });

    function sendOutput() {
        console.log("js: start_mail_sending: " + "hi");
        invoke('start_mail_sending', {message: "hi"});
    }

    onMount(async () => {


        await listen('rs2js', (event) => {
            // console.log("js: rs2js: " + event);
            let input = event.payload;
            console.log({timestamp: Date.now(), message: input});
            // inputs.value.push({timestamp: Date.now(), message: input});
        })

        await listen('progress', (event) => {
            // console.log("js: rs2js: " + event);
            let input = event.payload;
            console.log({timestamp: Date.now(), message: input});
            toast(
                `${input}`,
                {
                    duration: 10000
                }
            )
            // inputs.value.push({timestamp: Date.now(), message: input});
        })
    });

    return (
        <div class={"container"}>
            <button onclick={sendOutput}>Say hello</button>
            <div class="form">
                <Field
                    svg={"sender"}
                    htmlID={"sender-name"}
                    fieldType={"text"}
                    content={"Sender's name"}
                ></Field>


                <Field
                    svg={"title"}
                    htmlID={"mail-title"}
                    fieldType={"text"}
                    content={"Mail title"}
                    description={{
                        description: "Write [name] or [surname] and select Excel column name if you want to personalize the email"
                    }}
                >
                    <Field
                        htmlID={"titleInPdf"}
                        svg={"edit-doc"}
                        fieldType={"text"}
                        content={"Chose title in .pdf"}
                    ></Field>
                </Field>


                <Field
                    svg={"recipient"}
                    htmlID={"recipients-name"}
                    fieldType={"text"}
                    content={"Recipient's name"}
                    description={{
                        description: "Select the column corresponding to the name of the recipient of the letter in Excel"
                    }}
                ></Field>

                <Field
                    htmlID={"mail-text"}
                    fieldType={"textarea"}
                    content={"Mail text"}
                    description={{
                        description: "Select the column corresponding to the name of the recipient of the letter in Excel"
                    }}
                >
                    <Field
                        svg={"html"}
                        htmlID={"choose-html"}
                        fieldType={"html"}
                        content={"Choose html"}
                        description={{
                            description: "Create a mail template from .html file"
                        }}
                    ></Field>
                    <Field
                        svg={"pdf"}
                        htmlID={"choose-pdf"}
                        fieldType={"pdf"}
                        content={"Choose pdf"}
                        description={{
                            description: "Create a mail template from pdf file"
                        }}
                    ></Field>
                </Field>
                <Field
                    svg={"file-present"}
                    htmlID={"choose-files"}
                    fieldType={"files"}
                    content={"Choose files"}
                    description={{
                        description: "Select the files to be attached to the email"
                    }}
                ></Field>
                <Field
                    svg={"excel"}
                    htmlID={"choose-excel"}
                    fieldType={"excel"}
                    content={"Choose Excel file*"}
                    description={{
                        description: "You must select an Excel file and a column with E-mail"
                    }}
                ></Field>

                <Field
                    svg={"pdf-copy"}
                    htmlID={"pdf-duplicate"}
                    fieldType={"checkbox"}
                    description={{
                        description: "Attach a .pdf file as a duplicate of the mail"
                    }}
                ></Field>

                <div class="form__field">
                    <button onclick={sendMail} class="form__field-submit" value="Send">
                        Send
                        <span class="svg send_mail"></span>
                    </button>
                </div>


                {/*<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>*/
                }
                {/*<div class="form__field">*/
                }
                {/*    <label for="sender-name" class="form__field-label">*/
                }
                {/*        <span class="svg sender"></span>*/
                }
                {/*    </label>*/
                }
                {/*    <input id="sender-name" type="text" class="form__field-input" placeholder="Sender's name"*/
                }
                {/*           title="Sender's name"/>*/
                }
                {/*</div>*/
                }
                {/*<div class="form__field customizable">*/
                }
                {/*    <label for="title" class="form__field-label cur-help">*/
                }
                {/*        <span class="svg title"></span>*/
                }
                {/*        <div class="form__field-description">*/
                }
                {/*            Write [name] or [surname] and select Excel column name if you want to personalize the email*/
                }
                {/*        </div>*/
                }
                {/*    </label>*/
                }
                {/*    <input id="title" type="text" class="form__field-input" placeholder="Mail title"*/
                }
                {/*           title="Mail title"/>*/
                }
                {/*    <span class="form__field-label settings">*/
                }
                {/*        <span class="svg settings-v2"></span>*/
                }
                {/*    </span>*/
                }
                {/*    <div class="form__field-settings none">*/
                }
                {/*        <div class="form__field-settings__close ">*/
                }
                {/*            <div class="burger active">*/
                }
                {/*                <span class="burger__span"></span>*/
                }
                {/*            </div>*/
                }
                {/*        </div>*/
                }
                {/*        /!*{% include 'components/title_settings.html' %}*!/*/
                }
                {/*        <div class="form__field">*/
                }
                {/*            <label for="" class="form__field-label">*/
                }
                {/*                <span class="svg edit-doc"></span>*/
                }
                {/*            </label>*/
                }
                {/*            <input type="text" class="form__field-input sub" placeholder="Chose title in .pdf"*/
                }
                {/*                   title="Chose title in .pdf"/>*/
                }
                {/*        </div>*/
                }

                {/*    </div>*/
                }
                {/*</div>*/
                }
                {/*<div class="form__field">*/
                }
                {/*    <label for="recipients-name" class="form__field-label cur-help">*/
                }
                {/*        <span class="svg recipient"></span>*/
                }
                {/*        <div class="form__field-description">*/
                }
                {/*            Select the column corresponding to the name of the recipient of the letter in Excel*/
                }
                {/*        </div>*/
                }
                {/*    </label>*/
                }
                {/*    <input id="recipients-name" type="text" class="form__field-input" placeholder="Recipient's name"*/
                }
                {/*           title="Recipient's name"/>*/
                }
                {/*</div>*/
                }


                {/*<div class="form__field customizable textarea">*/
                }
                {/*    <textarea id="mail-text" class="form__field-input" name="" cols="30" rows="10"*/
                }
                {/*              placeholder="Mail text"*/
                }
                {/*              title="Mail text"></textarea>*/
                }
                {/*    <span class="form__field-label settings">*/
                }
                {/*        <span class="svg settings-v2"></span>*/
                }
                {/*    </span>*/
                }
                {/*    <div class="form__field-settings none">*/
                }
                {/*        <div class="form__field-settings__close ">*/
                }
                {/*            <div class="burger active">*/
                }
                {/*                <span class="burger__span"></span>*/
                }
                {/*            </div>*/
                }
                {/*        </div>*/
                }
                {/*        /!*{% include 'components/text_settings.html' %}*!/*/
                }

                {/*        <div class="form__field">*/
                }
                {/*            <label class="form__field-label cur-help">*/
                }
                {/*                <span class="svg html"></span>*/
                }
                {/*                <div class="form__field-description">*/
                }
                {/*                    Create a mail template from .html file*/
                }
                {/*                </div>*/
                }
                {/*            </label>*/
                }
                {/*            <label for="choose-html" class="form__field-input sub cur-pointer">*/
                }
                {/*                Choose html*/
                }
                {/*            </label>*/
                }
                {/*            <input type="file" id="choose-html" accept=".html" class="d-none"/>*/
                }
                {/*        </div>*/
                }
                {/*        <div class="form__field">*/
                }
                {/*            <label class="form__field-label cur-help">*/
                }
                {/*                <span class="svg pdf"></span>*/
                }
                {/*                <div class="form__field-description">*/
                }
                {/*                    Create a mail template from pdf file*/
                }
                {/*                </div>*/
                }
                {/*            </label>*/
                }
                {/*            <label for="choose-pdf" class="form__field-input sub cur-pointer">*/
                }
                {/*                Choose pdf*/
                }
                {/*            </label>*/
                }
                {/*            <input type="file" id="choose-pdf" accept=".pdf" class="d-none"/>*/
                }
                {/*        </div>*/
                }

                {/*        <div class="form__field">*/
                }
                {/*            <label class="form__field-label cur-help">*/
                }
                {/*                <span class="svg pdf"></span>*/
                }
                {/*                <div class="form__field-description">*/
                }
                {/*                    Create a mail template from pdf file*/
                }
                {/*                </div>*/
                }
                {/*            </label>*/
                }
                {/*            <label class="form__field-input sub cur-pointer">*/
                }
                {/*                Choose file*/
                }
                {/*            </label>*/
                }
                {/*        </div>*/
                }

                {/*    </div>*/
                }
                {/*</div>*/
                }


                {/*<div class="form__field customizable">*/
                }

                {/*    <label for="choose-files" class="form__field-label cur-help">*/
                }
                {/*        <span class="svg file-present"></span>*/
                }
                {/*        <div class="form__field-description">*/
                }
                {/*            Select the files to be attached to the email*/
                }
                {/*        </div>*/
                }
                {/*    </label>*/
                }
                {/*    <label for="choose-files" class="form__field-input cur-pointer">*/
                }
                {/*        Choose files*/
                }
                {/*    </label>*/
                }
                {/*    <input type="file" id="choose-files" multiple class="d-none"/>*/
                }
                {/*    <span class="form__field-label settings">*/
                }
                {/*        <span class="svg settings-v2 visibility"></span>*/
                }
                {/*    </span>*/
                }
                {/*    <div class="form__field-settings none">*/
                }
                {/*        <div class="form__field-settings__close ">*/
                }
                {/*            <div class="burger active">*/
                }
                {/*                <span class="burger__span"></span>*/
                }
                {/*            </div>*/
                }
                {/*        </div>*/
                }
                {/*        /!*{% include 'components/choose_files.html' %}*!/*/
                }
                {/*        <ul class="selected-files">*/
                }
                {/*            <li>0 files selected</li>*/
                }
                {/*        </ul>*/
                }
                {/*    </div>*/
                }
                {/*</div>*/
                }

                {/*<div class="form__field customizable">*/
                }
                {/*    <label for="choose-excel" class="form__field-label cur-help">*/
                }
                {/*        <span class="svg excel"></span>*/
                }
                {/*        <div class="form__field-description">*/
                }
                {/*            You must select an Excel file and a column with E-mail*/
                }
                {/*        </div>*/
                }
                {/*    </label>*/
                }
                {/*    <label for="choose-excel" class="form__field-input cur-pointer">*/
                }
                {/*        Choose Excel file**/
                }
                {/*    </label>*/
                }
                {/*    <input type="file"*/
                }
                {/*           accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"*/
                }
                {/*           id="choose-excel" class="d-none"/>*/
                }
                {/*    <span class="form__field-label settings">*/
                }
                {/*        <span class="svg settings-v2"></span>*/
                }
                {/*    </span>*/
                }
                {/*    <div class="form__field-settings none">*/
                }
                {/*        <div class="form__field-settings__close ">*/
                }
                {/*            <div class="burger active">*/
                }
                {/*                <span class="burger__span"></span>*/
                }
                {/*            </div>*/
                }
                {/*        </div>*/
                }
                {/*        <div class="select-columns"></div>*/
                }
                {/*    </div>*/
                }
                {/*</div>*/
                }
                {/*<div class="form__field">*/
                }
                {/*    <label for="pdf-duplicate" class="form__field-label cur-pointer">*/
                }
                {/*        <span class="svg pdf "></span>*/
                }
                {/*    </label>*/
                }


                {/*    <label for="pdf-duplicate" class="form__field-input cur-pointer">*/
                }
                {/*        Attach a .pdf file as a duplicate of the mail*/
                }
                {/*        <input id="pdf-duplicate" type="checkbox"/><label for="pdf-duplicate"*/
                }
                {/*                                                          class="checkbox-label">Toggle</label>*/
                }
                {/*    </label>*/
                }
                {/*</div>*/
                }


                {/*<div class="form__field">*/
                }
                {/*    <button onclick={sendMail} class="form__field-submit" value="Send">*/
                }
                {/*        Send*/
                }
                {/*        <span class="svg send_mail"></span>*/
                }
                {/*    </button>*/
                }
                {/*</div>*/
                }
            </div>
        </div>
    )
        ;
}
