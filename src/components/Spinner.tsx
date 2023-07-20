import { Box, CircularProgress } from "@mui/material";
import React from "react";

export const Spinner = () => {
    return (
        <Box
            sx={{
                height: "100svh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <CircularProgress />
        </Box>
    );
};
