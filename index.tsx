import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Target container 'root' not found");
}

const root = createRoot(rootElement);
// Using React.createElement directly for the entry point to bypass JSX transformation requirements
root.render(
  React.createElement(React.StrictMode, null, 
    React.createElement(App)
  )
);