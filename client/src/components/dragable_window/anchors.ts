/**
 * Util functions for anchorss
 * 
 * @module
 * @requires Vector2
 * @functions anchorToVec2, vec2ToAnchor, closestAnchorVec2Angle, closestAnchorVec2Dist
 * @example
 * import { anchorToVec2, vec2ToAnchor, closestAnchorVec2Angle, closestAnchorVec2Dist } from './anchors';
 */


// #region Imports
import { Vector2 } from '../../shared/utils/vector2';
// #endregion Imports


// #region Convertions
/**
 * Converts an anchor string to a Vector2 position
 * @param anchor - The anchor string (e.g., "NE", "SW")
 * @param margin - The margin between the window and screen edges
 * @param element - The window element to calculate positions relative to
 * @returns Vector2 representing the anchor position
 */
export const anchorToVec2 = (anchor: string, margin: number, element: HTMLDivElement) => {
  switch (anchor) {
    case "NW": return new Vector2(margin, margin);
    case "N": return new Vector2(window.innerWidth / 2 - element.offsetWidth / 2, margin);
    case "NE": return new Vector2(window.innerWidth - element.offsetWidth - margin, margin);
    case "W": return new Vector2(margin, window.innerHeight / 2 - element.offsetHeight / 2);
    case "E": return new Vector2(window.innerWidth - element.offsetWidth - margin, window.innerHeight / 2 - element.offsetHeight / 2);
    case "SW": return new Vector2(margin, window.innerHeight - element.offsetHeight - margin);
    case "S": return new Vector2(window.innerWidth / 2 - element.offsetWidth / 2, window.innerHeight - element.offsetHeight - margin);
    case "SE": return new Vector2(window.innerWidth - element.offsetWidth - margin, window.innerHeight - element.offsetHeight - margin);
    default: return new Vector2(margin, margin);
  }
};

/** 
 * Converts a Vector2 position to an anchor string
 * @param vec2 - The Vector2 position
 * @param margin - The margin between the window and screen edges
 * @param element - The window element to calculate positions relative to
 * @returns Anchor string representing the closest anchor position
 */
export const vec2ToAnchor = (vec2: Vector2, margin: number, element: HTMLDivElement) => {
  const anchors = ["NE", "N", "NW", "W", "E", "SW", "S", "SE"];
  let minDist = Number.MAX_VALUE;
  let closestAnchor = anchors[0];
  anchors.forEach(anchor => {
    const anchorVec2 = anchorToVec2(anchor, margin, element);
    const dist = Vector2.distance(vec2, anchorVec2);
    if (dist < minDist) {
      minDist = dist;
      closestAnchor = anchor;
    }
  });
  return closestAnchor;
}
// #endregion Convertions


// #region Distance
/**
 * Gets the closest anchor position to a given Vector2 by distance
 * @param position - The position to find the closest anchor
 * @param anchorsArray - An array of anchor strings (e.g., ["NE", "N", "NW", "W", "E", "SW", "S", "SE"])
 * @param margin - The margin between the window and screen edges
 * @param element - The window element to calculate positions relative to
 * @returns Vector2 representing the closest anchor position
 */
export const closestAnchorVec2ByDistance = (position : Vector2, anchorsArray : string[], margin : number,  element : HTMLDivElement) => {
  let currentClosestVec2 = anchorToVec2(anchorsArray[0], margin, element);
  let minDist = Vector2.distance(position, currentClosestVec2);

  anchorsArray.forEach(anchor => {
    const anchorVec2 = anchorToVec2(anchor, margin, element);
    const dist = Vector2.distance(position, anchorVec2);
    if (dist < minDist) {
      currentClosestVec2 = anchorVec2;
      minDist = dist;
    }
  });
  return currentClosestVec2;
}
// #endregion Distance


// #region Angle
/**
 * Gets the closest anchor position to a given Vector2 by angle
 * @param position - The position to find the closest anchor
 * @param direction - The direction last move
 * @param anchorsArray - An array of anchor strings (e.g., ["NE", "N", "NW", "W", "E", "SW", "S", "SE"])
 * @param margin - The margin between the window and screen edges
 * @param element - The window element to calculate positions relative to
 * @returns Vector2 representing the closest anchor position
 */
export const closestAnchorVec2ByAngle = (position : Vector2, direction : Vector2, anchorsArray : string[], margin : number, element : HTMLDivElement) => {
  let currentClosestVec2 = anchorToVec2(anchorsArray[0], margin, element);
  let minAngle = Number.MAX_VALUE;

  anchorsArray.forEach(anchor => {
    const anchorVec2 = anchorToVec2(anchor, margin, element);
    const angle = direction.angleTo(Vector2.subtract(anchorVec2, position));

    if (Math.abs(angle - minAngle) < 0.1) {
      const dist = Vector2.distance(position, anchorVec2);
      if (dist < Vector2.distance(position, currentClosestVec2)) {
        currentClosestVec2 = anchorVec2;
      }
    } else if (angle < minAngle) {
        currentClosestVec2 = anchorVec2;
        minAngle = angle;
    }
    });
  return currentClosestVec2;
}
// #endregion Angle