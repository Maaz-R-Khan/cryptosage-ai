import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

console.log('🚀 Starting CryptoSage AI...');

// Add error handler for unhandled errors
window.addEventListener('error', (event) => {
  console.error('❌ Global error:', event.error);
  console.error('Error details:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Could not find root element!');
  throw new Error("Could not find root element to mount to");
}

console.log('✅ Root element found, creating React root...');

try {
  const root = ReactDOM.createRoot(rootElement);
  console.log('✅ React root created, rendering app...');
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  console.log('✅ App rendered successfully!');
} catch (error) {
  console.error('❌ Failed to render app:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; color: white; background: #1e293b; font-family: sans-serif;">
      <h1>Error Loading App</h1>
      <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
      <pre style="background: #0f172a; padding: 10px; border-radius: 4px; overflow: auto;">
        ${error instanceof Error ? error.stack : String(error)}
      </pre>
    </div>
  `;
}
