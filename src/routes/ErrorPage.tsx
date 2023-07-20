import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import ApplicationMainBar from "../components/ApplicationMainBar";
import { useTranslation } from "react-i18next";

const ErrorPage = () => {
    const { t } = useTranslation();

    return (
        <Stack px={2} height="100svh" display="flex" alignItems="center" justifyContent="center">
            <ApplicationMainBar />
            <Stack alignItems={"center"}>
                <Box width="100%" justifyContent="center" display="flex" paddingBottom={2}>
                    <img src="/qr.png" width="40%" />
                </Box>
                <Typography variant={"h5"} fontWeight={"bolder"}>
                    {t("oops")}
                </Typography>
                <Typography paddingTop={1} width={"70%"} align={"center"} variant={"body1"}>
                    {t("notFound")}
                </Typography>
            </Stack>
        </Stack>
    );
};

export default ErrorPage;
