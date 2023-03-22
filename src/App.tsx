import {Accessor, createSignal, Setter} from "solid-js";
import logo from "./assets/logo.svg";
import {invoke} from "@tauri-apps/api/tauri";
import {Button, Stack} from "@suid/material";
import Home from "./screens/Home";
import AppRoutes from "./router";
import Header from "./components/Header";
import {Transition} from "solid-transition-group";
import {onMount} from 'solid-js';
import toast, {Toaster} from 'solid-toast';
import {listen} from "@tauri-apps/api/event";

interface SetCreds {
    setEmail: Setter<string>,
    setPassword: Setter<string>,
    setServer: Setter<string>,
    setIsLoading: Setter<boolean>
}

interface GetCreds {
    getEmail: Accessor<string>,
    getPassword: Accessor<string>,
    getServer: Accessor<string>,
    getIsLoading: Accessor<boolean>,
}

export interface Creds {
    getCreds: GetCreds,
    setCreds: SetCreds
}

function createTextFile(data: any) {
  // Create a new signal to hold the file content

  // Create a new Blob object with the file content
  const fileBlob = new Blob([data.toString()], { type: 'text/plain' });

  // Create a new URL object from the Blob object
  const fileUrl = URL.createObjectURL(fileBlob);

  // Create a link to the file URL
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = 'progress.txt';

  // Click the link to trigger the file download
  link.click();

  // Clean up the URL object
  URL.revokeObjectURL(fileUrl);
}

function App() {
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [server, setServer] = createSignal("");
    const [isLoading, setIsLoading] = createSignal(false);
    const [progress, setProgress] = createSignal<string[]>([]);

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

    onMount(async () => {
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

        ////////////////////////////////////////////////////////////////////////////////////

        await listen('rs2js', (event) => {
            // console.log("js: rs2js: " + event);
            let input = event.payload;
            console.log({timestamp: Date.now(), message: input});
            // inputs.value.push({timestamp: Date.now(), message: input});
        });

        await listen('progress', (event) => {
            let input = event.payload;
            console.log({timestamp: Date.now(), message: input});

            if (input === "Start sending") {
                setProgress([]);
            }
            if (`${input}`.includes("Success: ")) {
                toast.success(`${input}`.substring(8));
                setProgress([...progress(), `${input}`]);
            } else if (`${input}`.includes("Fail: ")) {
                toast.error(`${input}`.substring(6));
                setProgress([...progress(), `${input}`]);
            } else {
                toast(
                    `${input}`,
                    {
                        duration: 10000
                    }
                );
            }
            if (input === "End sending") {
                setIsLoading(false);
                createTextFile(progress());
            }
        });
    });

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
                    <AppRoutes
                        getCreds={{
                            getEmail: email,
                            getPassword: password,
                            getServer: server,
                            getIsLoading: isLoading
                        }}
                        setCreds={{
                            setEmail: setEmail,
                            setPassword: setPassword,
                            setServer: setServer,
                            setIsLoading: setIsLoading
                        }}
                    />)}
                {/*<div class="container">*/}
                {/*    <AppRoutes/>*/}
                {/*</div>*/}
            </Transition>
            <Toaster/>
        </>
    );
}

export default App;
