import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router/AppRoutes";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppRoutes />
      </div>
    </BrowserRouter>
  </React.StrictMode>,
);
