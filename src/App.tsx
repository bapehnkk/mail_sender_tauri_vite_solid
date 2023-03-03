import {createSignal} from "solid-js";
import logo from "./assets/logo.svg";
import {invoke} from "@tauri-apps/api/tauri";
import {Button, Stack} from "@suid/material";
import Home from "./screens/Home";
import AppRoutes from "./router";
import Header from "./components/Header";
import {Transition} from "solid-transition-group";
import {onMount} from 'solid-js';


function App() {
    // function animateBackgroundColor(element: any) {
    //     let change = 1.0;
    //     if (change >= 0.3) {
    //         setInterval(function () {
    //             const root = document.documentElement;
    //             if (root) {
    //                 root.style.setProperty("--scroll-bar-color", `rgba(96, 96, 96, ${change})`);
    //             }
    //             change -= 0.01;
    //         }, 10);
    //     }
    // }
    //
    // const handleScroll = (e: any) => {
    //     // check the direction of the scroll
    //     if (e.deltaY > 0) {
    //         console.log('scrolling down');
    //         // do something when scrolling down
    //     } else {
    //         console.log('scrolling up');
    //         // do something when scrolling up
    //     }
    // };

    onMount(() => {
        let isScrolling: any;
        window.addEventListener('scroll', function (event) {
            const root = document.documentElement;
            if (root) {
                root.style.setProperty("--scroll-bar-color", "rgba(96, 96, 96, 1)");
            }
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(function () {
                if (root) {
                    root.style.setProperty("--scroll-bar-color", "rgba(96, 96, 96, 0.3)");
                }
            }, 66);
        }, false);
    });
    /////////////////////////////////////////////////////////////////////////////////////////////
    // ####################################################################################### //
    /////////////////////////////////////////////////////////////////////////////////////////////
    const [greetMsg, setGreetMsg] = createSignal("");
    const [name, setName] = createSignal("");

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        setGreetMsg(await invoke("greet", {name: name()}));
    }

    const [show, toggleShow] = createSignal(true);
    return (
        <>
            <Header/>
            <Transition
                onBeforeEnter={(el: any) => (el.style.opacity = 0)}
                onEnter={(el, done) => {
                    const a = el.animate([{opacity: 0}, {opacity: 1}], {
                        duration: 300
                    });
                    a.finished.then(done);
                }}
                onAfterEnter={(el: any) => (el.style.opacity = 1)}
                onExit={(el, done) => {
                    const a = el.animate([{opacity: 1}, {opacity: 0}], {
                        duration: 300
                    });
                    a.finished.then(done);
                }}
            >
                {show() && (
                    <AppRoutes/>)}
                {/*<div class="container">*/}
                {/*    <AppRoutes/>*/}
                {/*</div>*/}
            </Transition>
        </>
    );
}

export default App;
