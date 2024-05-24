import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root";
import { createTheme, ThemeProvider } from "@mui/material";
import ExhibitPage2 from "./routes/ExhibitPage2";
import ErrorPage from "./routes/ErrorPage";
import "./translation";
import MainPage from "./routes/MainPage";
import ExhibitionPage from "./routes/ExhibitionPage";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "exhibits/:exhibitId",
                element: <ExhibitPage2 />
            },
            {
                path: "/",
                element: <MainPage />
            },
            {
                path: "exhibitions/:exhibitionId",
                element: <ExhibitionPage />
            }
        ]
    }
]);

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#212121"
        },
        secondary: {
            main: "#103a86",
            light: "#87a5da",
            dark: "#06245e"
        }
    },
    typography: {
        fontFamily: ["Poppins", "sans-serif", "Roboto", "sans-serif"].join(",")
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
                }),
            }
        },
    }
});

root.render(
    <React.StrictMode>
        <React.Suspense fallback="">
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </React.Suspense>
    </React.StrictMode>
);
