import {Link} from "@solidjs/router";
import {Button} from "@suid/material";
import {Component, createEffect} from 'solid-js';

import {createSignal, onMount} from 'solid-js';
import {listen} from '@tauri-apps/api/event';
import {invoke} from '@tauri-apps/api/tauri';


const SettingsScreen: Component = () => {


    async function readExcel() {
        // invoke('read_excel')
        //     .catch((error) => {
        //         console.error(error);
        //     });


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
        <div style="display: grid; grid-template-columns: auto auto;">
            <div style="grid-column: span 2; grid-row: 1;">
                <label for="input" style="display: block;">Message</label>
                <input id="input" v-model="output"/>
                <br/>
                <button
                    onclick={readExcel}>Send to Mail
                </button>
            </div>
        </div>
    );
};

export default SettingsScreen;
