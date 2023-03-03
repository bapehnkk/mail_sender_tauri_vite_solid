import {Link} from "@solidjs/router";
import {AppBar, Toolbar, Typography, Button} from "@suid/material";
import {VsHome, VsSettingsGear} from 'solid-icons/vs'
import {Component} from "solid-js";


const Header: Component = () => {
    return (
        <header>
            <div class="logo">
                <img src="/logo.svg" class="logo__img"/>
                <div class="logo__text">
                    Mail sender
                </div>
            </div>
            <div class="links">
                <Link href="/" class="ripple">
                    <Button  class="links__icon" id="main">
                        <span class="svg home"></span>
                    </Button>
                </Link>
                <Link href="/settings" class="ripple">
                    <Button  class="links__icon" id="settings">
                        <span class="svg settings"></span>
                    </Button>
                </Link>
            </div>
        </header>
    );
}

export default Header;
