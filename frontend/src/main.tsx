import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RouterWithRole from "./lib/router";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterWithRole/>
  </StrictMode>
);
