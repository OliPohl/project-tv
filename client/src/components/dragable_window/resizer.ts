/**
 * Util functions for the resizer
 * 
 * @module
 * @requires Vector2
 * @functions setResizerPos, getNewWindowWidth
 * @example
 * import { setResizerPos, getNewWindowWidth } from './anchors';
 */


// #region Imports
import { Vector2 } from '../../shared/utils/vector2';
// #endregion Imports


// #region Position
/**
 * Sets the resizers window position to the opposide side of the anchor
 * @param element - The resizer element
 * @param anchor - The anchor string (e.g., "NE", "SW") of the main window
 * @returns void
 */
export const setResizerPos = (element: HTMLDivElement, anchor: string) => {
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
// #endregion Position


// #region Size
/**
 * Returns the new window size based on the resizer position and size
 * @param resizer - The element being resized
 * @param windowStartSize - The starting size of the window
 * @param delta - The change in size based of mouse movement relative to the window
 * @param minWidth - The minimum width of the window
 * @param maxWidth - The maximum width of the window
 * @param aspectRatio - The aspect ratio of the window
 * @returns The new window size as Vector2
 */
export const getDeltaWindowSize = (resizer: HTMLDivElement, windowStartSize: Vector2, delta: Vector2, minWidth: number, maxWidth: number, aspectRatio: number) => {
  switch (resizer.style.cursor) {
    case "ne-resize":
    case "se-resize":
    case "e-resize":
      return new Vector2(Math.max(minWidth, Math.min(maxWidth, windowStartSize.x - delta.x)), Math.max(minWidth, Math.min(maxWidth, windowStartSize.x - delta.x)) / aspectRatio);
    case "nw-resize":
    case "sw-resize":
    case "w-resize":
      return new Vector2(Math.max(minWidth, Math.min(maxWidth, windowStartSize.x + delta.x)), Math.max(minWidth, Math.min(maxWidth, windowStartSize.x + delta.x)) / aspectRatio);
    case "n-resize":
      return new Vector2(Math.max(minWidth, Math.min(maxWidth, windowStartSize.x + delta.y)), Math.max(minWidth, Math.min(maxWidth, windowStartSize.x + delta.y)) / aspectRatio);
    case "s-resize":
      return new Vector2(Math.max(minWidth, Math.min(maxWidth, windowStartSize.x - delta.y)), Math.max(minWidth, Math.min(maxWidth, windowStartSize.x - delta.y)) / aspectRatio);
    default:
      return windowStartSize;
  }
}


/**
 * Returns the window size as Vector2 based on width
 * @param newWidth - The new width of the window
 * @param minWidth - The minimum width of the window
 * @param maxWidth - The maximum width of the window
 * @param aspectRatio - The aspect ratio of the window
 * @returns The window size as Vector2
 */
export const widthToWindowSize = (newWidth: number, minWidth: number, maxWidth: number, aspectRatio: number) => {
  return new Vector2(Math.max(minWidth, Math.min(maxWidth, newWidth)), Math.max(minWidth, Math.min(maxWidth, newWidth)) / aspectRatio);
}
// #endregion Width