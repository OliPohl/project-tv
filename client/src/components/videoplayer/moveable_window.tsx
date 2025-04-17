/**
 * Moveable Window Component
 * 
 * Creates a draggable window container for child components.
 * @component
 * @param {React.ReactNode} children - Content to be rendered inside the window.
 * @param {string} [id] - Element id for the window.
 * @param {string} [className] - Additional CSS classes for the window.
 * @returns {React.ReactElement} A draggable window component.
 * @example
 * <MoveableWindow className="video-player-container">
 *   <VideoPlayer youtubeVideoId="dQw4w9WgXcQ" />
 * </MoveableWindow>
 */

// #region Imports
import React, { useRef, useEffect } from 'react';
import './style.css';
// #endregion


// #region Interface
interface MoveableWindowProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}
// #endregion Interface


// #region MoveableWindow
function MoveableWindow({ children, id ='', className = '' }: MoveableWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const windowElement = windowRef.current;
    if (!windowElement) return;

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    const dragMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;

      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    };

    const elementDrag = (e: MouseEvent) => {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      windowElement.style.top = (windowElement.offsetTop - pos2) + "px";
      windowElement.style.left = (windowElement.offsetLeft - pos1) + "px";
    };

    const closeDragElement = () => {
      document.onmouseup = null;
      document.onmousemove = null;
    };

    windowElement.onmousedown = dragMouseDown;

    return () => {
      document.onmouseup = null;
      document.onmousemove = null;
      windowElement.onmousedown = null;
    };
  }, []);

  return (
    <div id={`${id}`} className={`${className}`} ref={windowRef} style={{position: 'absolute'}}>
      {children}
    </div>
  );
}

export default MoveableWindow;
// #endregion MoveableWindow