import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from "./routes/Root";
import {createTheme, ThemeProvider} from "@mui/material";
import ExhibitPage from "./routes/exhibit/ExhibitPage";
import ErrorPage from "./routes/ErrorPage";
import "./translation";
import MainPage from "./routes/MainPage";
import ExhibitionPage from "./routes/exhibition/ExhibitionPage";
import InstitutionPage from "./routes/insititution/InstitutionPage";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/",
                element: <MainPage/>
            },
            {
                path: "exhibitions/:exhibitionId",
                element: <ExhibitionPage/>
            },
            {
                path: "institutions/:institutionId",
                element: <InstitutionPage/>
            },
            {
                path: "exhibits/:exhibitId",
                element: <ExhibitPage/>
            },
        ]
    }
]);

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            // main: "#212121"
            main: "#000000",
            light: "rgb(0,0,0)",
        },
        secondary: {
            main: "#000000",
            light: "#f2f2f2",
            dark: "rgb(0,0,0)"
        },
        divider: "rgba(0,0,0,0.56)"
    },
    typography: {
        fontFamily: ["Inter", "sans-serif"].join(",")
        // fontFamily: ["Merriweather", "serif"].join(",")
    },
    shape: {
        borderRadius: 28
    },
    components: {
        MuiMobileStepper: {
            styleOverrides: {
                root: ({theme}) => ({
                    "& .MuiMobileStepper-dot": {
                        backgroundColor: "rgba(255,255,255,0.5)",
                    },
                    "& .MuiMobileStepper-dotActive": {
                        backgroundColor: "rgba(255,255,255,0.8)",
                    },
                })
            }
        },
    }
});

root.render(
    <React.StrictMode>
        <React.Suspense fallback="">
            <ThemeProvider theme={theme}>
                <RouterProvider router={router}/>
            </ThemeProvider>
        </React.Suspense>
    </React.StrictMode>
);
