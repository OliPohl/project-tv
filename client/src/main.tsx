/**
 * Application Entry Point
 * 
 * Initializes React root and renders the main application component.
 * @file This is the main entry file for the React application.
 */

// #region Imports
// Modules
import React from 'react';
import { createRoot } from 'react-dom/client';

// Styles
import './shared/styles/general.css';
import './shared/styles/fonts.css';
import './shared/resources/icons/icons.css';

// Components
import Miniplayer from './components/miniplayer';
// #endregion Importss


// #region Main
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <Miniplayer youtubeVideoId="FJfwehhzIhw" />
  </React.StrictMode>
);
// #endregion Main