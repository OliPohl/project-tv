import React from 'react';
import { createRoot } from 'react-dom/client'
import './renderer/shared/styles/index.css'
import App from './components/app/App.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
