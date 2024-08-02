import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import { Provider } from 'react-redux'; // Import Provider from react-redux
import App from './App';
import './index.css';
import { store } from './store/store'; // Import your Redux store

// Get the root element
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Render the application
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
