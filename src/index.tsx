import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root";
import { createTheme, ThemeProvider } from "@mui/material";
import ExhibitPage from "./routes/ExhibitPage";
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
                path: "exh/:exhibitId",
                element: <ExhibitPage />
            },
            {
                path: "/",
                element: <MainPage />
            },
            {
                path: "col/:exhibitionId",
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
        fontFamily: ["Public Sans", "sans-serif", "Lato", "sans-serif", "Roboto", "sans-serif"].join(",")
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
