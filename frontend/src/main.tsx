import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "@fontsource-variable/inter";
import "./app/globals.css";
import { initTheme } from "./app/theme";

initTheme();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
