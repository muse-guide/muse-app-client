import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import React from "react";
import ScrollToTop from "../components/ScrollToTop";

const Root = () => {
    return (
        <Box>
            <CssBaseline />
            <Box component="main">
                <ScrollToTop />
                <Outlet />
            </Box>
        </Box>
    );
};

export default Root;
