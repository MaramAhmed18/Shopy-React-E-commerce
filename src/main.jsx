
// src/main.jsx
import React from 'react' // Add this import
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const initialOptions = {
  "client-id": "AfeTVDAFUXdftqlCHCE8xwD3Ry77w5L49ZXHkomutD00Knibtb_JordDSk9JLLI8LAu_zdZo_8QiYCA3", 
  currency: "USD", 
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PayPalScriptProvider options={initialOptions}>
      <App />
    </PayPalScriptProvider>
  </React.StrictMode>
)