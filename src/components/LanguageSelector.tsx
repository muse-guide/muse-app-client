import {Box, Dialog, DialogContent, DialogTitle, Grid2, IconButton} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import {useTranslation} from "react-i18next";
import {useDialog} from "./hooks";
import {LangIcon} from "./LangIcon";

interface LanguageSelectorProps {
    languages: string[];
}

export default function LanguageSelector(props: LanguageSelectorProps) {
    const {t, i18n} = useTranslation();
    const landDialog = useDialog()

    const langSelectHandler = (lang: string) => {
        landDialog.closeDialog();
        i18n.changeLanguage(lang);
    };

    return (
        <React.Fragment>
            <Box sx={{display: "flex", flexGrow: 0}}>
                <IconButton sx={{padding: 0}} onClick={landDialog.openDialog}>
                    <LangIcon lang={i18n.language}/>
                </IconButton>
            </Box>
            <Dialog fullScreen open={landDialog.isOpen} onClose={landDialog.closeDialog}>
                <DialogTitle
                    sx={{
                        paddingX: 2,
                        paddingY: 0,
                        height: "56px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                    }}
                >
                    <IconButton aria-label="close" onClick={landDialog.closeDialog} sx={{padding: 0}}>
                        <CloseIcon color="primary" fontSize="inherit"/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid2 container spacing={0} px={2} pt={8}>
                        <Grid2 size={12} pb={2} justifyContent={"center"} display={"flex"}>
                            {t("selectLang")}
                        </Grid2>
                        {props.languages.map((lang, index) => (
                            <Grid2 key={`lang${index}`} size={12} p={4} justifyContent={"center"} display={"flex"}>
                                <IconButton sx={{padding: 0}} onClick={() => langSelectHandler(lang)}>
                                    <LangIcon lang={lang} height="96"/>
                                </IconButton>
                            </Grid2>
                        ))}
                    </Grid2>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
