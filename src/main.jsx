import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./styles/theme.css";
import "./styles/main.css";
import "./styles/animations.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { RouteLoadingFallback } from "./components/LoadingFallback.jsx";

// Performance monitoring in development
if (import.meta.env.DEV) {
  import("./hooks/usePerformance.js").then(({ useWebVitals }) => {
    // Initialize web vitals tracking
    const vitals = useWebVitals();
    console.log("[Performance] Monitoring enabled");
  });
}

// Error handling for chunk loading failures
window.addEventListener("error", (event) => {
  if (
    event.message?.includes("Loading chunk") ||
    event.message?.includes("Loading CSS chunk")
  ) {
    console.warn("Chunk loading failed, reloading page...");
    window.location.reload();
  }
});

// Unhandled promise rejection handling
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);

  // Don't prevent default in development to see the error
  if (import.meta.env.PROD) {
    event.preventDefault();
  }
});

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<RouteLoadingFallback />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);
