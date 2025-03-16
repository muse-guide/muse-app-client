import React from "react";
import {Box, Stack, Typography} from "@mui/material";
import ApplicationMainBar from "../components/ApplicationMainBar";
import {useTranslation} from "react-i18next";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import {useTheme} from "@mui/material/styles";

const MainPage = () => {
    const {t} = useTranslation();
    const theme = useTheme();

    return (
        <Stack px={2} height="100svh" display="flex" alignItems="center" justifyContent="center">
            <ApplicationMainBar/>
            <Stack alignItems={"center"} justifyContent={"center"}>
                <Box width="100%" justifyContent="center" display="flex" paddingBottom={2}>
                    <img src="/qr.png" width="40%"/>
                </Box>
                <Typography variant={"h5"} fontWeight={"bolder"}>
                    {t("begin")}
                </Typography>
                <Typography paddingTop={1} width={"70%"} align={"center"} variant={"body1"}>
                    {t("tryScan")}
                </Typography>
                <Box width="100%" justifyContent="center" display="flex" paddingTop={3}>
                    <CameraAltRoundedIcon sx={{fontSize: "3rem", color: theme.palette.secondary.light}}/>
                </Box>
            </Stack>
        </Stack>
    );
};

export default MainPage;
