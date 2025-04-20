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
  const DRAG_LERP_FACTOR = 0.2;     // Smoothing factor during drag
  const SNAP_LERP_FACTOR = 0.05;    // Smoothing factor when snapping
  const SNAP_PROJECTION_FACTOR = 25; // How much to project movement for snap prediction
  // #endregion


  // #region utils
  /**
   * Converts an anchor string to a Vector2 position
   * @param anchor - The anchor string (e.g., "NE", "SW")
   * @param element - The window element to calculate positions relative to
   * @returns Vector2 representing the anchor position
   */
  const anchorToVec2 = (anchor: string, element: HTMLDivElement) => {
    switch (anchor) {
      case "NE": return new Vector2(margin, margin);
      case "N": return new Vector2(window.innerWidth / 2 - element.offsetWidth / 2, margin);
      case "NW": return new Vector2(window.innerWidth - element.offsetWidth - margin, margin);
      case "W": return new Vector2(margin, window.innerHeight / 2 - element.offsetHeight / 2);
      case "E": return new Vector2(window.innerWidth - element.offsetWidth - margin, window.innerHeight / 2 - element.offsetHeight / 2);
      case "SW": return new Vector2(margin, window.innerHeight - element.offsetHeight - margin);
      case "S": return new Vector2(window.innerWidth / 2 - element.offsetWidth / 2, window.innerHeight - element.offsetHeight - margin);
      case "SE": return new Vector2(window.innerWidth - element.offsetWidth - margin, window.innerHeight - element.offsetHeight - margin);
      default: return new Vector2(margin, margin);
    }
  };

  // Convert space-separated anchor string to array
  const anchorsArray = anchors.split(" ");

  /**
   * Sets the window's position
   * @param element - The window element
   * @param pos - The new position as Vector2
   */
  const setWindowPos = (element: HTMLDivElement, pos: Vector2) => {
    element.style.left = `${pos.x}px`;
    element.style.top = `${pos.y}px`;
  };
  // #endregion utils

  useEffect(() => {
    const windowElement = windowRef.current;
    if (!windowElement) return;

    // #region Resize
    /**Handles window resize by resetting to first anchor */
    const onWindowResize = () => {
      targetPos = anchorToVec2(anchorsArray[0], windowElement);
      requestAnimationFrame(updatePosition);
    };
    window.addEventListener('resize', onWindowResize);
    // TODO: Snap to closest anchor instead of first
    // #endregion Resize


    // #region Default Values
    // Set initial position to first anchor
    let targetPos = anchorToVec2(anchorsArray[0], windowElement);
    let currentPos = targetPos;
    setWindowPos(windowElement, targetPos);
    
    // Drag state
    let isDragging = false;
    let lastMouse = Vector2.ZERO;
    let lastMove = Vector2.ZERO;
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
      e.preventDefault();
      isDragging = true;
      lastMove = Vector2.ZERO;
      lastMouse = new Vector2(e.clientX, e.clientY);

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
      const delta = new Vector2(
        e.clientX - lastMouse.x, 
        e.clientY - lastMouse.y
      );
      lastMove = delta; // Track movement for snap prediction
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

      // Predict future position based on movement velocity
      const projectedPos = new Vector2(
        targetPos.x + lastMove.x * SNAP_PROJECTION_FACTOR,
        targetPos.y + lastMove.y * SNAP_PROJECTION_FACTOR
      );

      // Find closest anchor to projected position
      let closestAnchorPos = anchorToVec2(anchorsArray[0], windowElement);
      let minDist = Vector2.distance(projectedPos, closestAnchorPos);

      anchorsArray.forEach(anchor => {
        const anchorPos = anchorToVec2(anchor, windowElement);
        const dist = Vector2.distance(projectedPos, anchorPos);
        if (dist < minDist) {
          closestAnchorPos = anchorPos;
          minDist = dist;
        }
      });

      targetPos = closestAnchorPos;
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
      window.removeEventListener('resize', onWindowResize);
    };
    // #endregion Cleanup
  }, []);

  // TODO: Hide window
  // TODO: Make anchro snap smoother
  // #region HTML Element
  return (
    <div 
      id={`${id}`} 
      className={`${className}`} 
      ref={windowRef} 
      style={{ position: 'absolute' }}
    >
      {children}
    </div>
  );
  // #endregion HTML Element
}

export default DragableWindow;
// #endregion DragableWindow