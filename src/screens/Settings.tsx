import {Link} from "@solidjs/router";
import {Button} from "@suid/material";
import {Component, createEffect} from 'solid-js';

import {createSignal, onMount} from 'solid-js';
import {listen} from '@tauri-apps/api/event';
import {invoke} from '@tauri-apps/api/tauri';
import Field from "../components/FormField";


const SettingsScreen: Component = () => {


    async function readExcel() {


        invoke('get_excel_header', {
            filePath: "C:\\Users\\User\\Desktop\\sspisok jur (karberi 18) 2022.xlsx"
        })
            .then((excelHeader) => {
                console.log(`Header: ${excelHeader}. Type: ${typeof excelHeader}.`);

                return excelHeader as string[]

            })
            .then((excelHeader: string[]) => {
                if (excelHeader.length <= 0)
                    throw new Error("An error occurred while reading the file. Try choosing a different file.");
                for (let el of excelHeader) {
                    console.log(el)
                }
            })
            .catch((error) => {
                console.error(`Error: ${error}`);
            });
    }


    // const sendMail = () => {
    //     invoke('send_smtp_mail').then(() => console.log('Completed!'));
    // };


    return (
        <div class={"container"}>
            <div class="form">
                <Field
                    svg={"contact-email"}
                    htmlID={"email"}
                    fieldType={"text"}
                    content={"Email*"}
                ></Field>
                <Field
                    svg={"password"}
                    htmlID={"password"}
                    fieldType={"text"}
                    content={"Password*"}
                ></Field>
                <Field
                    svg={"server"}
                    htmlID={"server"}
                    fieldType={"text"}
                    content={"Server*"}
                    description={{
                        description: "smtp.gmail.com"
                    }}
                ></Field>
                <Field
                    svg={"port"}
                    htmlID={"port"}
                    fieldType={"text"}
                    content={"Port*"}
                    description={{
                        description: "465"
                    }}
                ></Field>
                <Field
                    svg={"sender"}
                    htmlID={"sender-name"}
                    fieldType={"text"}
                    content={"Convertio API key"}
                    description={{
                        description: "How to obtain an API key?",
                        link: "https://support.convertio.co/hc/en-us/articles/360006894493-How-to-obtain-an-API-key-"
                    }}
                ></Field>


                <div class="form__field">
                    <button class="form__field-submit" value="Send">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;
