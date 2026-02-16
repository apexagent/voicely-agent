import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Suppress Dynamic SDK CORS errors in development (.replit.dev domain)
// These errors are expected and won't occur on production (voicelyagent.ai)
let dynamicErrorSuppressed = false;

window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason;
  
  // Check if this is a Dynamic SDK fetch error (identifies by stack trace patterns)
  if (error?.message === 'Failed to fetch' && 
      (error?.stack?.includes('SDKApi') || 
       error?.stack?.includes('BaseAPI') ||
       error?.stack?.includes('chunk-7N5PQZQF'))) {
    console.log('[DEV] Suppressing expected Dynamic SDK CORS error on .replit.dev domain');
    event.preventDefault(); // Prevent browser error
    dynamicErrorSuppressed = true;
    return;
  }
});

// Aggressively remove error overlays for Dynamic SDK CORS errors
// This runs continuously to catch overlays that appear after page load
const removeErrorOverlay = () => {
  const overlay = document.querySelector('vite-error-overlay');
  if (overlay && dynamicErrorSuppressed) {
    const overlayText = overlay.shadowRoot?.textContent || '';
    // Only remove if it's the Dynamic SDK "Failed to fetch" error
    if (overlayText.includes('Failed to fetch')) {
      console.log('[DEV] Removing Vite error overlay for Dynamic SDK CORS error');
      overlay.remove();
    }
  }
};

// Check immediately and then continuously
setInterval(removeErrorOverlay, 50);

// Also use MutationObserver to catch overlays as soon as they're added
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    Array.from(mutation.addedNodes).forEach((node) => {
      if (node.nodeName === 'VITE-ERROR-OVERLAY') {
        setTimeout(removeErrorOverlay, 0);
      }
    });
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

createRoot(document.getElementById("root")!).render(<App />);
