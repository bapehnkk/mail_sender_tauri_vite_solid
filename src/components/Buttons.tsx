import {Button} from "@suid/material";
import {ThemeProvider} from "@suid/material/styles";
import theme from "../styles/Theme";
import CustomTheme from "../styles/Theme";
import {ParentComponent, ParentProps} from "solid-js";

const CustomButton: ParentComponent = (props: ParentProps) => {
    return (
        <CustomTheme>
            <Button class={"submit-btn"}>{props.children}</Button>
        </CustomTheme>
    );
};

export default CustomButton;