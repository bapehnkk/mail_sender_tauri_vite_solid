import {Link} from "@solidjs/router";
import {AppBar, Toolbar, Typography, Button} from "@suid/material";
import CustomTheme from "../styles/Theme";
import '../styles/header.css';
import { VsHome, VsSettingsGear  } from 'solid-icons/vs'


function Header() {
    return (
        <CustomTheme>
            <header class={'header'}>
                <div class="logo">
                    <Link href="/" class={"logo"}>
                        <div class="logo__img">
                            <img src="/logo.svg" alt="Logo"/>
                        </div>
                        <div class="logo__text">
                            Mail Sender
                        </div>
                    </Link>
                </div>
                <div class={"links"}>

                    <Link href="/">
                        <Button variant="text">
                            <VsHome/>
                        </Button>
                    </Link>
                    <Link  href="/settings">
                        <Button variant="text">
                            <VsSettingsGear/>
                        </Button>
                    </Link>
                </div>
            </header>


        </CustomTheme>
    );
}

export default Header;
