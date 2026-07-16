import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "./app/providers/app-providers";
import { ErrorBoundary } from "./components/layout/error-boundaries";
import { AppRouter } from "./app/router";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary
      fallbackTitle="The application hit an unexpected error"
      fallbackDescription="The Smart City shell recovered with a global safeguard. Reload the page or retry the failed action."
    >
      <AppProviders>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AppProviders>
    </ErrorBoundary>
  </React.StrictMode>,
);
