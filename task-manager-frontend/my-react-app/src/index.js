import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// import { registerServiceWorker } from './registerServiceWorker';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        console.log('✅ Service Worker registered:', reg);
      })
      .catch(err => console.error('❌ SW registration failed:', err));
  }