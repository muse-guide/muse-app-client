import { AppBar, IconButton, Slide, Toolbar, Typography, useScrollTrigger } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { Configuration } from "../configuration";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import { useTheme } from "@mui/material/styles";

export default function ApplicationMainBar() {
    const theme = useTheme();
    const trigger = useScrollTrigger();
    const navigate = useNavigate();

    const navigateTo = (destination?: string) => {
        if (destination) navigate(destination);
    };

    return (
        <React.Fragment>
            <Slide appear={false} direction="down" in={!trigger}>
                <AppBar elevation={0} color="transparent">
                    <Toolbar sx={{ paddingX: 2 }}>
                        <IconButton sx={{ padding: 0 }} onClick={() => navigateTo("/")}>
                            <AllInclusiveIcon sx={{ display: "flex", color: theme.palette.secondary.main }} />
                        </IconButton>

                        <Typography
                            variant="body1"
                            noWrap
                            component="div"
                            sx={{
                                flexGrow: 1,
                                display: "block",
                                paddingLeft: 1,
                                color: theme.palette.secondary.main,
                                fontWeight: "bolder",
                            }}
                        >
                            MUSE
                        </Typography>

                        <LanguageSelector languages={Configuration.UI_SUPPORTED_LANGUAGES} />
                    </Toolbar>
                </AppBar>
            </Slide>
        </React.Fragment>
    );
}
