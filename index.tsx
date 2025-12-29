
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- Security Features to deter Developer Tool access ---
if (typeof window !== 'undefined') {
  // Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Disable common developer tool keyboard shortcuts
  document.onkeydown = (e) => {
    // Disable F12
    if (e.keyCode === 123) {
      return false;
    }
    // Disable Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
      return false;
    }
    // Disable Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
      return false;
    }
    // Disable Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
      return false;
    }
    // Disable Ctrl+Shift+C (Inspect element)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
      return false;
    }
  };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
