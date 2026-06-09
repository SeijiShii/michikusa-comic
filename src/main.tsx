import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App.js";
import "./styles/tokens.css";

const el = document.getElementById("root");
if (el) createRoot(el).render(<StrictMode><App /></StrictMode>);
