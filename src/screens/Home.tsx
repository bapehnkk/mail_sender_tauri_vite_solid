import Field, {FieldOptions} from "../components/FormField"
import {createEffect, createSignal, onMount, ParentComponent} from 'solid-js';
import {invoke} from "@tauri-apps/api/tauri";
import {listen} from '@tauri-apps/api/event';

import toast from 'solid-toast';
import * as querystring from "querystring";

import {Creds} from "../App";

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


const HomeScreen: ParentComponent<Creds> = (props) => {
    const [title, setTitle] = createSignal<string>();

    const credsIsEmpty = (): boolean => {
        if (props.getCreds.getEmail() === "") return true;
        else if (props.getCreds.getPassword() === "") return true;
        else return props.getCreds.getServer() === "";
    };

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
        if (document.getElementById("choose-excel")!.innerText === "Choose Excel file*") {
            toast.error("Choose Excel file*");
            return
        }
        if (credsIsEmpty()) {
            toast.error("Credentials is empty");
            return;
        }


        const getElValue = (id: string): string => {
            const input = document.getElementById(id) as HTMLInputElement | null;
            return input!.value;
        };
        let files: string[] = []; // Array.from(document.getElementById("choose-files")!.parentElement!.querySelectorAll(".fileName"), fileName => fileName.innerHTML);
        let htmlFile: string = document.getElementById("choose-html")!.innerText === "Create a mail template from .html file" ? "" : document.getElementById("choose-html")!.innerText;

        const excel: Excel = {
            filePath: document.getElementById("choose-excel")!.innerHTML,
            selects: getSelects(document.getElementById("choose-excel")!)!
        };


        const creds = {
            email: props.getCreds.getEmail(),
            password: props.getCreds.getPassword(),
            server: props.getCreds.getServer()
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
            html_abs_path: htmlFile,
            creds: creds
        };


        // console.log(MailFields);

        props.setCreds.setIsLoading(true);
        invoke('start_mail_sending', {
            message: mailFields
        })
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


    return (
        <div class={"container"}>
            {/*<button onclick={sendOutput}>Say hello</button>*/}

            {props.getCreds.getIsLoading() ?
                <div class="load">
                    <hr/>
                    <hr/>
                    <hr/>
                    <hr/>
                </div>
                :
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
                        {/*<Field*/}
                        {/*    svg={"pdf"}*/}
                        {/*    htmlID={"choose-pdf"}*/}
                        {/*    fieldType={"pdf"}*/}
                        {/*    content={"Choose pdf"}*/}
                        {/*    description={{*/}
                        {/*        description: "Create a mail template from pdf file"*/}
                        {/*    }}*/}
                        {/*></Field>*/}
                    </Field>
                    {/*<Field*/}
                    {/*    svg={"file-present"}*/}
                    {/*    htmlID={"choose-files"}*/}
                    {/*    fieldType={"files"}*/}
                    {/*    content={"Choose files"}*/}
                    {/*    description={{*/}
                    {/*        description: "Select the files to be attached to the email"*/}
                    {/*    }}*/}
                    {/*></Field>*/}
                    <Field
                        svg={"excel"}
                        htmlID={"choose-excel"}
                        fieldType={"excel"}
                        content={"Choose Excel file*"}
                        description={{
                            description: "You must select an Excel file and a column with E-mail"
                        }}
                    ></Field>

                    {/*<Field*/}
                    {/*    svg={"pdf-copy"}*/}
                    {/*    htmlID={"pdf-duplicate"}*/}
                    {/*    fieldType={"checkbox"}*/}
                    {/*    description={{*/}
                    {/*        description: "Attach a .pdf file as a duplicate of the mail"*/}
                    {/*    }}*/}
                    {/*></Field>*/}

                    <div class="form__field">
                        <button onclick={sendMail} class="form__field-submit" value="Send">
                            Send
                            <span class="svg send_mail"></span>
                        </button>
                    </div>

                </div>
            }
        </div>
    )
        ;
};
export default HomeScreen;
