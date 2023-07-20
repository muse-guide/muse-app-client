import { Box, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { useState } from "react";
import { CircleFlag } from "react-circle-flags";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

interface LanguageSelectorProps {
    languages: string[];
}

export default function LanguageSelector(props: LanguageSelectorProps) {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const langSelectHandler = (lang: string) => {
        handleClose();
        i18n.changeLanguage(lang);
    };

    return (
        <React.Fragment>
            <Box sx={{ display: "flex", flexGrow: 0 }}>
                <IconButton sx={{ padding: 0 }} onClick={handleClickOpen}>
                    <CircleFlag countryCode={i18n.language} height="24" />
                </IconButton>
            </Box>
            <Dialog fullScreen open={open} onClose={handleClose}>
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
                    <IconButton aria-label="close" onClick={handleClose} sx={{ padding: 0 }}>
                        <CloseIcon color="primary" fontSize="inherit" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid2 container spacing={0} px={2} pt={8}>
                        <Grid2 xs={12} pb={2} justifyContent={"center"} display={"flex"}>
                            {t("selectLang")}
                        </Grid2>
                        {props.languages.map((lang, index) => (
                            <Grid2 key={`lang${index}`} xs={12} p={4} justifyContent={"center"} display={"flex"}>
                                <IconButton sx={{ padding: 0 }} onClick={() => langSelectHandler(lang)}>
                                    <CircleFlag countryCode={lang} height="96" />
                                </IconButton>
                            </Grid2>
                        ))}
                    </Grid2>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
