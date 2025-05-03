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
 * @param {boolean} [resize=false] - Whether the window can be resized.
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
import { setResizerPos, getDeltaWindowSize, widthToWindowSize } from './resizer';
// #endregion

// #region Interface
interface DragableWindowProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  anchors: string;
  margin?: number;
  resize?: boolean;
}
// #endregion Interface

// #region DragableWindow
function DragableWindow({ children, id = '', className = '', anchors, margin = 15, resize = false }: DragableWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);

  // #region constants
  const DRAG_LERP_FACTOR = 0.2;           // Smoothing factor during drag
  const SNAP_LERP_FACTOR = 0.022;         // Smoothing factor during snaü
  const ANCHOR_SNAP_SPEED_THRESHOLD = 1;  // Threshold for anchor snap

  const WINDOW_MIN_WIDTH = 200;                           // Minimum width of the window
  const WINDOW_MAX_WIDTH = () => window.innerWidth / 2;   // Maximum width of the window
  const DEFAULT_WINDOW_WIDTH = () => window.innerWidth / 5; // Default width of the window
  const ASPECT_RATIO = 16 / 9;
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


  /**
   * Sets the window's size
   * @param element - The window element
   * @param size - The new size as Vector2
   */
  const setWindowSize = (element: HTMLDivElement, size: Vector2) => {
    element.style.width = `${size.x}px`;
    element.style.height = `${size.y}px`;
  }


  /**
   * Gets the window's size
   * @param element - The window element
   * @returns The window's size as Vector2
   */
  const getWindowSize = (element: HTMLDivElement) => {
    return new Vector2(element.offsetWidth, element.offsetHeight);
  }
  // #endregion Utils

  useEffect(() => {
    const windowElement = windowRef.current;
    if (!windowElement) return;

    // #region Browser Resize
    /**Handles browser resize by resetting to current anchor */
    let lastWindowWidthPercentage = windowElement.offsetWidth / window.innerWidth;
    const onBrowserResize = () => {
      if (resize && resizer) {
        setWindowSize(windowElement, widthToWindowSize(window.innerWidth * lastWindowWidthPercentage, WINDOW_MIN_WIDTH, WINDOW_MAX_WIDTH(), ASPECT_RATIO));
      }
      setWindowPos(windowElement, anchorToVec2(currentAnchor, margin, windowElement));
    };
    window.addEventListener('resize', onBrowserResize);
    // #endregion Browser Resize


    // #region Resizer
    const resizer = windowElement.querySelector('#resizer') as HTMLDivElement;
    let isResizing = false;

    // Setting default resizer values
    let resizeStartMouse = Vector2.ZERO;
    setWindowSize(windowElement, widthToWindowSize(DEFAULT_WINDOW_WIDTH(), WINDOW_MIN_WIDTH, WINDOW_MAX_WIDTH(), ASPECT_RATIO));
    let windowStartSize = getWindowSize(windowElement);

    /** Handles resizer start */
    const resizerStart = (e: MouseEvent) => {
      e.preventDefault();
      isResizing = true;
      resizeStartMouse = new Vector2(e.clientX, e.clientY);
      windowStartSize = getWindowSize(windowElement);

      document.addEventListener("mousemove", resizerMove);
      document.addEventListener("mouseup", resizerEnd);
    };

    /** Handles resizer move */
    const resizerMove = (e: MouseEvent) => {
      if (!isResizing) return;
      e.preventDefault();
      const delta = new Vector2(e.clientX - resizeStartMouse.x, e.clientY - resizeStartMouse.y);
  
      setWindowSize(windowElement, getDeltaWindowSize(resizer, windowStartSize, delta, WINDOW_MIN_WIDTH, WINDOW_MAX_WIDTH(), ASPECT_RATIO));
      lastWindowWidthPercentage = windowElement.offsetWidth / window.innerWidth;
      setWindowPos(windowElement, anchorToVec2(currentAnchor, margin, windowElement));
      //TODO: Tablet window resize support on pinch
    };

    /** Handles resizer end */
    const resizerEnd = () => {
      isResizing = false;
      document.removeEventListener("mousemove", resizerMove);
      document.removeEventListener("mouseup", resizerEnd);
    };

    if (resize && resizer) {
      // Adding resizer event listeners to the resizer
      resizer.addEventListener('mousedown', resizerStart);
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
    let lastMove = Vector2.ZERO;
    // #endregion Default Values


    // #region Animation
    /** Animation loop that smoothly updates window position */
    const updatePosition = () => {
      //TODO: Relpace monkey lerp with actual lerp
      const lerpFactor = isDragging ? DRAG_LERP_FACTOR : SNAP_LERP_FACTOR;
      currentPos = Vector2.lerp(currentPos, targetPos, lerpFactor);
      setWindowPos(windowElement, currentPos);

      // Continue animation if not at target or still dragging
      if (isDragging || Vector2.distance(currentPos, targetPos) > 1) {
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
      lastMove = Vector2.ZERO;
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
      lastMove = new Vector2(e.clientX - lastMouse.x, e.clientY - lastMouse.y);
      lastMouse = new Vector2(e.clientX, e.clientY);
      targetPos = Vector2.add(targetPos, lastMove);
    };
    // #endregion Drag Move


    // #region Drag End
    /** Handles drag end and snaps to nearest anchor */
    const dragEnd = () => {
      isDragging = false;
      document.removeEventListener("mousemove", dragMove);
      document.removeEventListener("mouseup", dragEnd);

      if (lastMove){
        // If the window is moving fast enough, snap to the nearest anchor based on angle.
        if (lastMove.magnitude() >  ANCHOR_SNAP_SPEED_THRESHOLD) {
          targetPos = closestAnchorVec2ByAngle(currentPos, lastMove.normalize(), anchorsArray, margin, windowElement);
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