import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Theme } from "@radix-ui/themes";
import App from "./App.jsx";
import "@radix-ui/themes/styles.css"; // Radix UI styles
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Bootstrap JS
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Theme appearance="light" accentColor="violet" radius="medium">
      <App />
    </Theme>
  </StrictMode>
);
