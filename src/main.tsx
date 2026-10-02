// Ensure global fetch has both getter and setter in iframe sandbox
try {
  let _currentFetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    get() {
      return _currentFetch;
    },
    set(newFetch) {
      _currentFetch = newFetch;
    },
    configurable: true,
    enumerable: true,
  });
} catch {
  // Ignore descriptor configuration errors
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
