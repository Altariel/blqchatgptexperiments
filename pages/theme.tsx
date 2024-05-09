import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary:{
            main: "#7FC8F8",
            light: "#7FC8F8",
            dark: "#219EBC",
        },
        secondary:{
            main: "#FF6392",
            light: "#FF6392",
            dark: "#FFB703",
        },
        background: {
            default: "#F9F9F9",
        },
        text: {
            primary: "#000000",
            secondary: "#000000",
            disabled: "#000000",
        },
    
    }
});

export default theme;