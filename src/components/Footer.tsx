import {Stack, Typography} from "@mui/material";
import React from "react";

export default function Footer() {
    return (
        <Stack height={100} width={"100%"} alignItems={"center"} justifyContent={"center"}>
            <Typography variant={"caption"} color={"textSecondary"}>
                Powered by <b>museo.guide, &copy; 2025</b>
            </Typography>
        </Stack>
    );
}