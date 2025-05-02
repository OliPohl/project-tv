/**
 * Moveable Miniplayer Component
 * 
 * Renders a YouTube iframe player with station controls
 * @component
 * @param {string} youtubeVideoId - The ID of the YouTube video to be played.
 * @returns {React.ReactElement} - Miniplayer component.
 * @example 
 * <Miniplayer youtubeVideoId="FJfwehhzIhw" />
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
  console.log(youtubeVideoId)
  return (
    <DragableWindow className="miniplayer-container" anchors="SW NW NE SE">
      <iframe id="miniplayer-video" src={"https://www.youtube.com/embed/" + {youtubeVideoId} + "?autoplay=1&controls=0&modestbranding=1&mute=1"} />
    </DragableWindow>
  )
}

export default Miniplayer
// #endregion Miniplayer