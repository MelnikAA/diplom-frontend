import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { DatesProvider } from "@mantine/dates";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <DatesProvider settings={{ locale: "ru" }}>
        <App />
      </DatesProvider>{" "}
    </BrowserRouter>
  </StrictMode>
);
