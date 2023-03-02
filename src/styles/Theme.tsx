import {createTheme, ThemeProvider} from "@suid/material/styles";
import {grey} from "@suid/material/colors";
import {Button} from "@suid/material";

const theme = createTheme({
    palette: {
        primary: {
            // Purple and green play nicely together.
            main: grey[700],
        },
        secondary: {
            // This is green.A700 as hex.
            main: "#11cb5f",
        },
    },
});

function CustomTheme(props: any) {
    return (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>
    );
}

export default CustomTheme;