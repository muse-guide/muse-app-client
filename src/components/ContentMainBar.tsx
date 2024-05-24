import { AppBar, Box, IconButton, Slide, Toolbar, Typography, useScrollTrigger } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { Configuration } from "../configuration";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { normalizeText } from "./ComponentUtils";

interface ContentMainBarProps {
    loading: boolean;
    parentPageUrl?: string;
    title?: string;
    langOptions?: string[];
}

export default function ContentMainBar(props: ContentMainBarProps) {
    const trigger = useScrollTrigger();
    const navigate = useNavigate();

    const navigateTo = (destination?: string) => {
        if (destination) navigate(destination);
    };

    const hideBackArrow = !props.parentPageUrl;
    const hideLangSelector = !props.langOptions || props.langOptions.length < 1;

    return (
        <React.Fragment>
            <Slide appear={false} direction="down" in={!trigger}>
                <AppBar elevation={0} color="transparent" sx={{background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)'}}>
                    {!props.loading && (
                        <Toolbar sx={{ paddingX: 3 }}>
                            {!hideBackArrow && (
                                <IconButton sx={{ padding: 0 }} onClick={() => navigateTo(props.parentPageUrl)}>
                                    <ArrowBackRoundedIcon sx={{ display: "flex" }} color={"primary"} />
                                </IconButton>
                            )}

                            <Box
                                sx={{
                                    display: "flex",
                                    flexGrow: 1,
                                    justifyContent: "center",
                                    paddingLeft: hideBackArrow ? 3 : 0,
                                    paddingRight: hideLangSelector ? 4 : 0,
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {props.title ? normalizeText(props.title, 28) : null}
                                </Typography>
                            </Box>

                            {!hideLangSelector && <LanguageSelector languages={props.langOptions ?? []} />}
                        </Toolbar>
                    )}
                </AppBar>
            </Slide>
        </React.Fragment>
    );
}
