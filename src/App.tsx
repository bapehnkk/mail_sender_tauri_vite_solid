import {createSignal} from "solid-js";
import logo from "./assets/logo.svg";
import {invoke} from "@tauri-apps/api/tauri";
import "./styles/App.css";
import {Button, Stack} from "@suid/material";
import CustomButton from "./components/Buttons";
import CustomTheme from "./styles/Theme";
import Home from "./screens/Home";
import AppRoutes from "./router";
import Header from "./components/Header";

function App() {
    const [greetMsg, setGreetMsg] = createSignal("");
    const [name, setName] = createSignal("");

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        setGreetMsg(await invoke("greet", {name: name()}));
    }

    return (
        <>
            <Header/>
            <Stack spacing={2} >

                <Stack direction="row" justifyContent={"center"} spacing={2}>
                    <CustomButton>awwaww</CustomButton>
                </Stack>

                <AppRoutes />
            </Stack>
        </>
    );
}

export default App;
