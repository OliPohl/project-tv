/**
 * Moveable Miniplayer Component
 * 
 * Renders a YouTube iframe player with station controls
 * @component
 * @param {string} youtubeVideoId - The ID of the YouTube video to be played.
 * @returns {React.ReactElement} - Miniplayer component.
 * @example 
 * <Miniplayer youtubeVideoId="dQw4w9WgXcQ" />
 */

// #region Imports
import React from 'react';
import './style.css'
import DragableWindow from '../dragable_window';
// #endregion Imports
// TODO: show and remove animation
// TODO: add youtube video or static video on ""
// TODO: add station controls on hover

// #region Miniplayer
function Miniplayer({ youtubeVideoId }: { youtubeVideoId: string }) {
  return (
    <DragableWindow className="miniplayer-container" anchors="SW NW NE SE">
      {/* Placeholder for video player implementation */}
      <div className="iframe-placeholder">
        Video player will render: {youtubeVideoId}
      </div>
    </DragableWindow>
  )
}

export default Miniplayer
// #endregion Miniplayer