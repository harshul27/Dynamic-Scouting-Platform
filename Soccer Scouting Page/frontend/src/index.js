import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'; // This imports the CSS file where you'll define your Tailwind styles
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);