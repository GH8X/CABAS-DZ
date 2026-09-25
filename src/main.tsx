import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ToastProvider } from "@/components/ui/toast";
import { StoreProvider } from "@/lib/store";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container #root was not found in index.html");
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
);
