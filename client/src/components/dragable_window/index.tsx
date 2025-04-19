/**
 * Dragable Window Component
 * 
 * Creates a draggable window container for child components.
 * @component
 * @param {React.ReactNode} children - Content to be rendered inside the window.
 * @param {string} [id] - Element id for the window.
 * @param {string} [className] - Additional CSS classes for the window.
 * @param {string} [anchors] - Anchors the player can snap to. The first anchor is the default anchor. Possible anchors: NW, N, NE, E, SE, S, SW, W
 * @returns {React.ReactElement} - A draggable window component.
 * @example
 * <DragableWindow className="video-player-container" anchors="SE NW NE SW">
 *   <VideoPlayer youtubeVideoId="dQw4w9WgXcQ" />
 * </DragableWindow>
 */

// #region Imports
import React, { useRef, useEffect } from 'react';
import { lerpVec2 } from '../../shared/utils/math';
import { Vector2 } from '../../shared/utils/vector2';
// #endregion


// #region Interface
interface DragableWindowProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  anchors: string;
}
// #endregion Interface


// #region DragableWindow
function DragableWindow({ children, id ='', className = '' , anchors}: DragableWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);

  const DRAG_LERP_FACTOR = 0.2;
  const SNAP_LERP_FACTOR = 0.05;
  const SNAP_PROJECTION_FACTOR = 25;

  // calculate anchor position from anchor string
  const MARGIN = 15;
  const anchor_pos = (anchor: string, element: HTMLDivElement) => {
    switch (anchor) {
      case "NE":
        return [MARGIN, MARGIN]
      case "N":
        return [window.innerWidth / 2 - element.offsetWidth / 2, MARGIN]
      case "NW":
        return [window.innerWidth - element.offsetWidth - MARGIN, MARGIN]
      case "W":
        return [MARGIN, window.innerHeight / 2 - element.offsetHeight / 2]
      case "E":
        return [window.innerWidth - element.offsetWidth - MARGIN, window.innerHeight / 2 - element.offsetHeight / 2]
      case "SW":
        return [MARGIN, window.innerHeight - element.offsetHeight - MARGIN]
      case "S":
        return [window.innerWidth / 2 - element.offsetWidth / 2, window.innerHeight - element.offsetHeight - MARGIN]
      case "SE":
        return [window.innerWidth - element.offsetWidth - MARGIN, window.innerHeight - element.offsetHeight - MARGIN]
      default:
        return [MARGIN, MARGIN]
    }
  }

  // Sets window position
  const set_window_pos = (element: HTMLDivElement, pos: number[]) => { element.style.left = `${pos[0]}px`; element.style.top = `${pos[1]}px`;}

  useEffect(() => {
    const windowElement = windowRef.current;
    if (!windowElement) return;
    // Add resize event listener
    const onWindowResize = () => {target_pos = anchor_pos(anchors.split(" ")[0], windowElement); requestAnimationFrame(updatePosition);};
    window.addEventListener('resize', onWindowResize);

    // Set initial position to the first anchor
    let target_pos = anchor_pos(anchors.split(" ")[0], windowElement);
    set_window_pos(windowElement, target_pos);
    let current_pos = target_pos;
    
    // Set initial values
    let isDragging = false;
    let lastMouse = Vector2.ZERO;
    let lastMove = Vector2.ZERO;

    const updatePosition = () => {
      const lerpFactor = isDragging ? DRAG_LERP_FACTOR : SNAP_LERP_FACTOR;
      current_pos = lerpVec2(current_pos, target_pos, lerpFactor);
      set_window_pos(windowElement, current_pos);

      if ( Math.abs(current_pos[0] - target_pos[0]) > 0.5 || Math.abs(current_pos[1] - target_pos[1]) > 0.5 || isDragging ) {
        requestAnimationFrame(updatePosition);
      }
    };

    const dragStart = (e: MouseEvent) => {
      e.preventDefault();
      isDragging = true;

      lastMouse = new Vector2(e.clientX, e.clientY);
      lastMove = Vector2.ZERO;

      document.addEventListener("mousemove", dragMove);
      document.addEventListener("mouseup", dragEnd);

      requestAnimationFrame(updatePosition);
    };

    const dragMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;

      lastMouse = new Vector2(e.clientX, e.clientY);

      target_pos[0] += dx;
      target_pos[1] += dy;

      lastMouse = new Vector2(dx, dy);
    };

    const dragEnd = () => {
      isDragging = false;
      document.removeEventListener("mousemove", dragMove);
      document.removeEventListener("mouseup", dragEnd);

      // Predict future position based on velocity
      const projected_pos = [target_pos[0] + lastMove.x * SNAP_PROJECTION_FACTOR, target_pos[1] + lastMove.y * SNAP_PROJECTION_FACTOR];

      // Find closest anchor to projected point
      let closest_anchor_pos = anchor_pos(anchors.split(" ")[0], windowElement);
      let minDist = distance2D(projected_pos[0], projected_pos[1], closest_anchor_pos[0], closest_anchor_pos[1]);

      for (let i = 1; i < anchors.split(" ").length; i++) {
        const dist = distance2D(projected_pos[0], projected_pos[1], anchor_pos(anchors.split(" ")[i], windowElement)[0], anchor_pos(anchors.split(" ")[i], windowElement)[1]);
        if (dist < minDist) {
          closest_anchor_pos = anchor_pos(anchors.split(" ")[i], windowElement);
          minDist = dist;
        }
      }

      target_pos = closest_anchor_pos;
      requestAnimationFrame(updatePosition);
    };

    const distance2D = (x1: number, y1: number, x2: number, y2: number) =>
      Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    windowElement.addEventListener("mousedown", dragStart);

    return () => {
      windowElement.removeEventListener("mousedown", dragStart);
      document.removeEventListener("mousemove", dragMove);
      document.removeEventListener("mouseup", dragEnd);
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);
  // TODO: go to closest anchor on screen size change and check if currently dragging
  // TODO: Make pretty
  // TODO: Hide Widow ??
  // TODO: change arrays to vectors
  return (
    <div id={`${id}`} className={`${className}`} ref={windowRef} style={{position: 'absolute'}}>
      {children}
    </div>
  );
}

export default DragableWindow;
// #endregion DragableWindow