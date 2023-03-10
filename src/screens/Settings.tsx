import {Link} from "@solidjs/router";
import {Button} from "@suid/material";
import {Component, createEffect} from 'solid-js';

import {createSignal, onMount} from 'solid-js';
import {listen} from '@tauri-apps/api/event';
import {invoke} from '@tauri-apps/api/tauri';


const SettingsScreen: Component = () => {


    async function sendMail() {
        const mailFields = {
            sendersName: 'John Doe',
            title: 'My email',
            recipientsName: 'Jane Smith',
            text: 'Hello Jane, how are you?',
            files: ['attachment1.txt', 'attachment2.txt'],
        };

        // console.log(MailFields);

        invoke('send_smtp_mail', mailFields)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
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
                    onclick={sendMail}>Send to Mail
                </button>
            </div>
        </div>
    );
};

export default SettingsScreen;
