/**
 * Dragable Window Component
 * 
 * Creates a draggable window container for child components.
 * @component
 * @param {React.ReactNode} children - Content to be rendered inside the window.
 * @param {string} [id] - Element id for the window.
 * @param {string} [className] - Additional CSS classes for the window.
 * @param {string} [anchors] - Anchors the player can snap to. The first anchor is the default anchor. Possible anchors: NW, N, NE, E, SE, S, SW, W
 * @param {number} [anchor_margin] - Margin between the window and the anchor
 * @returns {React.ReactElement} - A draggable window component.
 * @example
 * <DragableWindow className="video-player-container" anchors="SE NW NE SW">
 *   <VideoPlayer youtubeVideoId="dQw4w9WgXcQ" />
 * </DragableWindow>
 */

// #region Imports
import React, { useRef, useEffect } from 'react';
import { Vector2 } from '../../shared/utils/vector2';
// #endregion


// #region Interface
interface DragableWindowProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  anchors: string;
  margin?: number
}
// #endregion Interface


// #region DragableWindow
function DragableWindow({ children, id ='', className = '' , anchors, margin: margin = 15}: DragableWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);

  // Constants
  const DRAG_LERP_FACTOR = 0.2;
  const SNAP_LERP_FACTOR = 0.05;
  const SNAP_PROJECTION_FACTOR = 25;

  // calculate anchor position from anchor string
  const anchorToVec2 = (anchor: string, element: HTMLDivElement) => {
    switch (anchor) {
      case "NE":
        return new Vector2(margin, margin)
      case "N":
        return new Vector2(window.innerWidth / 2 - element.offsetWidth / 2, margin)
      case "NW":
        return new Vector2(window.innerWidth - element.offsetWidth - margin, margin)
      case "W":
        return new Vector2(margin, window.innerHeight / 2 - element.offsetHeight / 2)
        case "E":
        return new Vector2(window.innerWidth - element.offsetWidth - margin, window.innerHeight / 2 - element.offsetHeight / 2)
      case "SW":
        return new Vector2(margin, window.innerHeight - element.offsetHeight - margin)
      case "S":
        return new Vector2(window.innerWidth / 2 - element.offsetWidth / 2, window.innerHeight - element.offsetHeight - margin)
      case "SE":
        return new Vector2(window.innerWidth - element.offsetWidth - margin, window.innerHeight - element.offsetHeight - margin)
      default:
        return new Vector2(margin, margin)
    }
  }
  // Anchor strings as array
  const anchorsArray = anchors.split(" ");

  // Sets window position
  const setWindowPos = (element: HTMLDivElement, pos: Vector2) => { element.style.left = `${pos.x}px`; element.style.top = `${pos.y}px`;}

  useEffect(() => {
    const windowElement = windowRef.current;
    if (!windowElement) return;
    // Add resize event listener
    const onWindowResize = () => {targetPos = anchorToVec2(anchorsArray[0], windowElement); requestAnimationFrame(updatePosition);}; // TODO: make to closest
    window.addEventListener('resize', onWindowResize);

    // Set initial position to the first anchor
    let targetPos = anchorToVec2(anchorsArray[0], windowElement);
    let currentPos = targetPos;
    setWindowPos(windowElement, targetPos);
    
    // Set initial values
    let isDragging = false;
    let lastMouse = Vector2.ZERO;
    let lastMove = Vector2.ZERO;

    const updatePosition = () => {
      const lerpFactor = isDragging ? DRAG_LERP_FACTOR : SNAP_LERP_FACTOR;
      currentPos = Vector2.lerp(currentPos, targetPos, lerpFactor);
      setWindowPos(windowElement, currentPos);

      if (Vector2.distance(currentPos, targetPos) > 1 || isDragging ) {
        requestAnimationFrame(updatePosition);
      }
    };

    const dragStart = (e: MouseEvent) => {
      e.preventDefault();
      isDragging = true;
      lastMove = Vector2.ZERO;
      lastMouse = new Vector2(e.clientX, e.clientY);

      document.addEventListener("mousemove", dragMove);
      document.addEventListener("mouseup", dragEnd);
      requestAnimationFrame(updatePosition);
    };
    windowElement.addEventListener("mousedown", dragStart);

    const dragMove = (e: MouseEvent) => {
      const delta = new Vector2(e.clientX - lastMouse.x, e.clientY - lastMouse.y);
      lastMouse = new Vector2(e.clientX, e.clientY);

      targetPos = Vector2.add(targetPos, delta);
    };

    const dragEnd = () => {
      isDragging = false;
      document.removeEventListener("mousemove", dragMove);
      document.removeEventListener("mouseup", dragEnd);

      // Predict future position based on velocity
      const projectedPos = new Vector2(targetPos.x + lastMove.x * SNAP_PROJECTION_FACTOR, targetPos.y + lastMove.y * SNAP_PROJECTION_FACTOR);

      // Find closest anchor to projected point
      let closestAnchorPos = anchorToVec2(anchorsArray[0], windowElement);
      let minDist = Vector2.distance(projectedPos, closestAnchorPos);

      anchorsArray.forEach(anchor => {
        const dist = Vector2.distance(projectedPos, anchorToVec2(anchor, windowElement));
        if (dist < minDist) {
          closestAnchorPos = anchorToVec2(anchor, windowElement);
          minDist = dist;
        }
      });

      targetPos = closestAnchorPos;
      requestAnimationFrame(updatePosition);
    };

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