/**
 * Moveable Video Player Component
 * 
 * Renders a YouTube iframe player with station controls
 * @component
 * @param {string} youtubeVideoId - The ID of the YouTube video to be played.
 * @returns {React.ReactElement} - Videoplayer component.
 * @example 
 * <VideoPlayer youtubeVideoId="dQw4w9WgXcQ" />
 */

// #region Imports
import React from 'react';
import './style.css'
import './moveable_window.tsx'
import MoveableWindow from './moveable_window.tsx';
// #endregion Imports


// #region Videoplayer
function Videoplayer({ youtubeVideoId }: { youtubeVideoId: string }) {
  return (
    <MoveableWindow className="video-player-container">
      {/* Placeholder for video player implementation */}
      <div className="video-player-placeholder">
        Video player will render: {youtubeVideoId}
      </div>
    </MoveableWindow>
  )
}

export default Videoplayer
// #endregion Videoplayer