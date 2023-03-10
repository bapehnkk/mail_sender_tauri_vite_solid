import {Link} from "@solidjs/router";
import {Button} from "@suid/material";
import {Component, createEffect} from 'solid-js';

import {createSignal, onMount} from 'solid-js';
import {listen} from '@tauri-apps/api/event';
import {invoke} from '@tauri-apps/api/tauri';


const SettingsScreen: Component = () => {

    const sendMail = ()=>{

        invoke('send_smtp_mail').then(() => console.log('Completed!'))
    };


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
