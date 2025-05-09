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
import './style.css'
import DragableWindow from '../dragable_window';

// #endregion Imports
// TODO: show and remove animation
// TODO: ^style controls in css and add the station switching functionality
// TODO: Change miniplayer to be able to get a list of youtube videos and switch between them via buttons (maybe add current station as an output or somthing)

// #region Miniplayer
function Miniplayer({ youtubeVideoId }: { youtubeVideoId: string }) {
  return (
    <DragableWindow className="miniplayer-container noselect" anchors="SW NW NE SE" resize={true}>
      {/* Video */}
      <iframe id="miniplayer-video" src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&controls=1&mute=1`} />
      {/* Controls */}
      <div className="miniplayer-controls">
        <div className="miniplayer-controls-area">
          <div className="miniplayer-controls-center">
            {/* Buttons */}
            <div className="miniplayer-controls-buttons">
              <i className="icon icon-previous" />
              <i className="icon icon-lock-locked" />
              <i className="icon icon-next" />
            </div>
            {/* Heading */}
            <span className="miniplayer-heading">
              <span className="miniplayer-country">South Korea</span>
              <span className="miniplayer-divider">⋄</span>
              <span className="miniplayer-station-count">1/2</span>
            </span>
          </div>
          {/* Maximize Button */}
          <i className="maximize icon icon-maximize" />
        </div>
      </div>
    </DragableWindow>
  )
}

export default Miniplayer
// #endregion Miniplayer