import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-blue-200 border border-blue-300 rounded-lg shadow-md">
     
    <BrowserRouter>
      <App />
    </BrowserRouter>
        </div>

  </StrictMode>
);
