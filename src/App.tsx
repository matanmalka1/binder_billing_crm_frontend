import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
};
