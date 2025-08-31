/**
 * anime.js - ESM
 * @version v4.1.2
 * @author Julian Garnier
 * @license MIT
 * @copyright (c) 2025 Julian Garnier
 * @see https://animejs.com
 */

/****************************************************
 * InMotion (InSpatial Motion)
 * @version v1.0.0
 * @author InSpatial Labs
 * @license Apache-2.0
 * @copyright (c) 2026 InSpatial Labs
 * @see https://inspatial.dev/motion
 ****************************************************/

import { tweenTypes, shortTransforms } from "./consts.ts";

import type { DOMTarget } from "./types.ts";

// Define helper functions directly rather than importing from ./helpers.ts
const isSvg = (node: any): boolean => {
  return node instanceof SVGElement || node?.ownerSVGElement || 
         (typeof node?.toString === 'function' && /svg/i.test(node.toString()));
};

const toLowerCase = (str: string): string => str.toLowerCase();

// Define a proper type for the cache
interface PropertyNameCache {
  [key: string]: string;
}

const propertyNamesCache: PropertyNameCache = {};

/**
 * Sanitizes a property name based on the target element and tween type
 * 
 * @param {string} propertyName - The property name to sanitize
 * @param {DOMTarget} target - The target element
 * @param {number} tweenType - The type of tween to apply
 * @return {string} - The sanitized property name
 */
export const sanitizePropertyName = (
  propertyName: string,
  target: DOMTarget, 
  tweenType: number
): string => {
  if (tweenType === tweenTypes.TRANSFORM) {
    const t = shortTransforms.get(propertyName);
    return t ? t : propertyName;
  } else if (tweenType === tweenTypes.CSS) {
    const cachedPropertyName = propertyNamesCache[propertyName];
    if (cachedPropertyName) return cachedPropertyName;
    const lowerCaseName = propertyName ? toLowerCase(propertyName) : propertyName;
    propertyNamesCache[propertyName] = lowerCaseName;
    return lowerCaseName;
  } else if (tweenType === tweenTypes.ATTRIBUTE && isSvg(target)) {
    // For SVG attributes, prefer kebab-case by default (e.g., strokeDashoffset -> stroke-dashoffset)
    const cachedPropertyName = propertyNamesCache[propertyName];
    if (cachedPropertyName) return cachedPropertyName;
    const kebab = propertyName.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
    propertyNamesCache[propertyName] = kebab;
    return kebab;
  } else {
    return propertyName;
  }
};
