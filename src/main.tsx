import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./lib/ascii.ts";
import { Analytics } from "@vercel/analytics/react";
import App from "./components/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Analytics />
    <App />
  </StrictMode>,
);
