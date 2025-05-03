/**
 * Draggable Window Component
 * 
 * Creates a window that can be dragged and snapped to specified anchor points.
 * @component
 * @param {React.ReactNode} children - Content to be rendered inside the window.
 * @param {string} [id] - Element id for the window.
 * @param {string} [className] - Additional CSS classes for the window.
 * @param {string} [anchors] - Anchors the window can snap to (space-separated). Possible values: NW, N, NE, E, SE, S, SW, W
 * @param {number} [margin=15] - Margin between the window and screen edges when snapped.
 * @returns {React.ReactElement} A draggable window component.
 * @example
 * <DragableWindow className="video-player" anchors="SE NW" margin={20}>
 *   <VideoPlayer youtubeVideoId="dQw4w9WgXcQ" />
 * </DragableWindow>
 */

// #region Imports
import React, { useRef, useEffect } from 'react';
import { Vector2 } from '../../shared/utils/vector2';
import { anchorToVec2, vec2ToAnchor, closestAnchorVec2ByDistance, closestAnchorVec2ByAngle } from './anchors';
// #endregion

// #region Interface
interface DragableWindowProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  anchors: string;
  margin?: number;
}
// #endregion Interface

// #region DragableWindow
function DragableWindow({ children, id = '', className = '', anchors, margin = 15 }: DragableWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);

  // #region constants
  const DRAG_LERP_FACTOR = 0.2;           // Smoothing factor during drag
  const MOVE_AVERAGE_COUNT = 5;           // Number of previous moves to average for speed
  const SNAP_LERP_FACTOR = 0.022;         // Smoothing factor during snaü
  const ANCHOR_SNAP_SPEED_THRESHOLD = 2;  // Threshold for anchor snap
  // #endregion


  // #region Utils
  // Convert space-separated anchor string to array
  const anchorsArray = anchors.split(" ");

  /**
   * Sets the window's position
   * @param element - The window element
   * @param position - The new position as Vector2
   */
  const setWindowPos = (element: HTMLDivElement, position: Vector2) => {
    element.style.left = `${position.x}px`;
    element.style.top = `${position.y}px`;
  };

  const setWindowSize = (element: HTMLDivElement, size: Vector2) => {
    element.style.width = `${size.x}px`;
    element.style.height = `${size.y}px`;
  }

  const setResizerPos = (element: HTMLDivElement, anchor: string) => {
    switch (anchor) {
      case "NW": element.style.top = "auto"; element.style.bottom = "0"; element.style.left = "auto";  element.style.right = "0";  element.style.cursor = "nw-resize"; break;
      case "N": element.style.top = "auto"; element.style.bottom = "0"; element.style.left = "50%"; element.style.right = "auto"; element.style.cursor = "n-resize"; break;
      case "NE": element.style.top = "auto"; element.style.bottom = "0"; element.style.left = "0"; element.style.right = "auto"; element.style.cursor = "ne-resize"; break;
      case "W": element.style.top = "50%"; element.style.bottom = "auto"; element.style.left = "auto"; element.style.right = "0"; element.style.cursor = "w-resize"; break;
      case "E": element.style.top = "50%"; element.style.bottom = "auto"; element.style.left = "0"; element.style.right = "auto"; element.style.cursor = "e-resize"; break;
      case "SW": element.style.top = "0"; element.style.bottom = "auto"; element.style.left = "auto"; element.style.right = "0"; element.style.cursor = "sw-resize"; break;
      case "S": element.style.top = "0"; element.style.bottom = "auto"; element.style.left = "50%"; element.style.right = "auto"; element.style.cursor = "s-resize"; break;
      case "SE": element.style.top = "0"; element.style.bottom = "auto"; element.style.left = "0"; element.style.right = "auto"; element.style.cursor = "se-resize"; break;
      default: element.style.top = "auto"; element.style.bottom = "0"; element.style.left = "auto"; element.style.right = "0";
    }
  }
  // #endregion Utils

  useEffect(() => {
    const windowElement = windowRef.current;
    if (!windowElement) return;

    // #region Browser Resize
    /**Handles browser resize by resetting to current anchor */
    const onBrowserResize = () => {
      targetPos = anchorToVec2(currentAnchor, margin, windowElement);
      requestAnimationFrame(updatePosition);
    };
    window.addEventListener('resize', onBrowserResize);
    // #endregion Browser Resize


    // #region Resizer
    const resizer = windowElement.querySelector('#resizer') as HTMLDivElement;
    let isResizing = false;
    const windowSize = () => new Vector2(windowElement.offsetWidth, windowElement.offsetHeight);
    let windowStartSize = windowSize();
    let aspectRatio = windowStartSize.x / windowStartSize.y;
    let maxWidth = window.innerWidth / 2;
    let resizeStartMouse = Vector2.ZERO;
    
    /** Handles resizer drag */
    const resizerStart = (e: MouseEvent) => {
      e.preventDefault();
      isResizing = true;
      resizeStartMouse = new Vector2(e.clientX, e.clientY);
      windowStartSize = windowSize();

      document.addEventListener("mousemove", resizerMove);
      document.addEventListener("mouseup", resizerEnd);
    };
    resizer.addEventListener('mousedown', resizerStart);

    const resizerMove = (e: MouseEvent) => {
      if (!isResizing) return;
      e.preventDefault();
      const delta = new Vector2(e.clientX - resizeStartMouse.x, e.clientY - resizeStartMouse.y);
    
      // Resize based on horizontal drag
      let newWidth;
      switch (resizer.style.cursor) {
        case "ne-resize":
        case "se-resize":
        case "e-resize":
          newWidth = Math.max(200, Math.min(maxWidth, windowStartSize.x - delta.x)); break;
        case "nw-resize":
        case "sw-resize":
        case "w-resize":
          newWidth = Math.max(200, Math.min(maxWidth, windowStartSize.x + delta.x)); break;
        case "n-resize":
          newWidth = Math.max(200, Math.min(maxWidth, windowStartSize.x + delta.y)); break;
        case "s-resize":
          newWidth = Math.max(200, Math.min(maxWidth, windowStartSize.x - delta.y)); break;
        default:
          newWidth = windowStartSize.x;
      }

      setWindowSize(windowElement, new Vector2(newWidth, newWidth / aspectRatio));
      setWindowPos(windowElement, anchorToVec2(currentAnchor, margin, windowElement));
      //TODO: Tablet window resize support on pinch
    };

    const resizerEnd = () => {
      isResizing = false;
      document.removeEventListener("mousemove", resizerMove);
      document.removeEventListener("mouseup", resizerEnd);
    };
    // #endregion Resizer


    // #region Default Values
    // Set initial position to first anchor
    let targetPos = anchorToVec2(anchorsArray[0], margin, windowElement);
    let currentPos = targetPos;
    let currentAnchor = anchorsArray[0];
    setWindowPos(windowElement, targetPos);
    setResizerPos(resizer, currentAnchor);
    
    // Drag state
    let isDragging = false;
    let lastMouse = Vector2.ZERO;
    let lastMove: Vector2[] = [];
    // #endregion Default Values


    // #region Animation
    /** Animation loop that smoothly updates window position */
    const updatePosition = () => {
      const lerpFactor = isDragging ? DRAG_LERP_FACTOR : SNAP_LERP_FACTOR;
      currentPos = Vector2.lerp(currentPos, targetPos, lerpFactor);
      setWindowPos(windowElement, currentPos);

      // Continue animation if not at target or still dragging
      if (Vector2.distance(currentPos, targetPos) > 1 || isDragging) {
        requestAnimationFrame(updatePosition);
      }
    };
    // #endregion Animation


    // #region Drag Start
    /**
     * Handles drag start
     * @param e - Mouse event
     */
    const dragStart = (e: MouseEvent) => {
      if (isResizing) return;
      e.preventDefault();
      isDragging = true;
      lastMove = [];
      lastMouse = new Vector2(e.clientX, e.clientY);
      targetPos = anchorToVec2(currentAnchor, margin, windowElement);
      currentPos = targetPos;

      document.addEventListener("mousemove", dragMove);
      document.addEventListener("mouseup", dragEnd);
      requestAnimationFrame(updatePosition);
    };
    // #endregion Drag Start


    // #region Drag Move
    /**
     * Handles drag movement
     * @param e - Mouse event
     */
    const dragMove = (e: MouseEvent) => {
      const delta = new Vector2(e.clientX - lastMouse.x, e.clientY - lastMouse.y);
      lastMove.push(delta);
      while (lastMove.length > MOVE_AVERAGE_COUNT) lastMove.shift();

      lastMouse = new Vector2(e.clientX, e.clientY);
      targetPos = Vector2.add(targetPos, delta);
    };
    // #endregion Drag Move


    // #region Drag End
    /** Handles drag end and snaps to nearest anchor */
    const dragEnd = () => {
      isDragging = false;
      document.removeEventListener("mousemove", dragMove);
      document.removeEventListener("mouseup", dragEnd);

      if (lastMove[lastMove.length -1]){
        let moveAverage = Vector2.ZERO;
        for (let i = 0; i < lastMove.length; i++) {
          moveAverage = Vector2.add(moveAverage, lastMove[i]);
        }
        moveAverage = Vector2.multiply(moveAverage, new Vector2(1 / lastMove.length, 1 / lastMove.length));
        
        // If the window is moving fast enough, snap to the nearest anchor based on angle.
        if (moveAverage.magnitude() >  ANCHOR_SNAP_SPEED_THRESHOLD) {
          targetPos = closestAnchorVec2ByAngle(currentPos, moveAverage.normalize(), anchorsArray, margin, windowElement);
          currentAnchor = vec2ToAnchor(targetPos, margin, windowElement);
          setResizerPos(resizer, currentAnchor);
          requestAnimationFrame(updatePosition);
          return;
        }
      }

      // Otherwise, snap to the nearest anchor based on distance
      targetPos = closestAnchorVec2ByDistance(targetPos, anchorsArray, margin, windowElement);
      currentAnchor = vec2ToAnchor(targetPos, margin, windowElement);
      setResizerPos(resizer, currentAnchor);
      requestAnimationFrame(updatePosition);
    };
    // #endregion Drag End

    // Set up event listeners
    windowElement.addEventListener("mousedown", dragStart);


    // #region Cleanup
    return () => {
      windowElement.removeEventListener("mousedown", dragStart);
      document.removeEventListener("mousemove", dragMove);
      document.removeEventListener("mouseup", dragEnd);
      window.removeEventListener('resize', onBrowserResize);
      document.removeEventListener("mousemove", resizerMove);
      document.removeEventListener("mouseup", resizerEnd);
    };
    // #endregion Cleanup
  }, []);
  //TODO: fix circling cursor feels like random anchor selected
  //TODO: variable speed on distance snap lerp and fix drag end to distance speed value

  //TODO: Save positions and size in cookies

  // #region HTML Element
  return (
    <div 
      id={`${id}`} 
      className={`${className}`} 
      ref={windowRef} 
      style={{ position: 'absolute' }}
    >
      {children}
      <div id="resizer" style={{ position: 'absolute', height: '15px', width: '15px' }}/>
    </div>
  );
  // #endregion HTML Element
}

export default DragableWindow;
// #endregion DragableWindow