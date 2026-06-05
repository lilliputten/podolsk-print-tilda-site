/** @desc Re-export parsed and typed scss variables (required in the code) */

import * as cssVariables from './variables-export.scss';

const vars = cssVariables as TCssVariables;

const {
  // Colors
  primaryColor,

  // Timeouts
  transitionTimeMs,
  animationTimeMs,
  disappearTimeMs,

  // Dimensions (original, strings)
  navbarHeightPx,

  // Media tresholds
  xxlMediaPx,
  xlMediaPx,
  lgMediaPx,
  mdMediaPx,
  smMediaPx,
  xsMediaPx,
  xxsMediaPx,

  // Media tresholds (all)
  // thresholds,
  mediaKeys,
  mediaSizes,
} = vars;

// See pre-exports in `variables-export.scss`
export interface TCssVariables {
  primaryColor: string;

  // Timeouts (original, strings)
  transitionTimeMs: string;
  animationTimeMs: string;
  disappearTimeMs: string;

  // Timeouts (parsed, numbers)
  transitionTime: number;
  animationTime: number;
  disappearTime: number;

  // Dimensions (original, strings)
  navbarHeightPx: string;

  // Dimensions (parsed, numbers)
  navbarHeight: number;

  // Media tresholds (original, strings)
  xxlMediaPx: string;
  xlMediaPx: string;
  lgMediaPx: string;
  mdMediaPx: string;
  smMediaPx: string;
  xsMediaPx: string;
  xxsMediaPx: string;

  // Media tresholds (parsed, numbers)
  xxlMedia: number;
  xlMedia: number;
  lgMedia: number;
  mdMedia: number;
  smMedia: number;
  xsMedia: number;
  // xxsMedia: number;

  // Media tresholds (all)
  mediaKeys: string;
  mediaSizes: string;
}

export {
  // Colors
  primaryColor,

  // Timeouts (original, strings)
  transitionTimeMs,
  animationTimeMs,
  disappearTimeMs,

  // Dimensions (original, strings)
  navbarHeightPx,

  // Media tresholds (original, strings)
  xxlMediaPx,
  xlMediaPx,
  lgMediaPx,
  mdMediaPx,
  smMediaPx,
  xsMediaPx,
  // xxsMediaPx,

  // Media tresholds (all)
  mediaKeys,
  mediaSizes,
};

// Timeouts (parsed, numbers)
export const transitionTime = parseInt(transitionTimeMs);
export const animationTime = parseInt(animationTimeMs);
export const disappearTime = parseInt(disappearTimeMs);

// Dimensions (parsed, numbers)
export const navbarHeight = parseInt(navbarHeightPx);

// Media tresholds (parsed, numbers)
export const xxlMedia = parseInt(xxlMediaPx);
export const xlMedia = parseInt(xlMediaPx);
export const lgMedia = parseInt(lgMediaPx);
export const mdMedia = parseInt(mdMediaPx);
export const smMedia = parseInt(smMediaPx);
export const xsMedia = parseInt(xsMediaPx);
// export const xxsMedia = parseInt(xxsMediaPx);

// Media tresholds (all)
export const mediaKeysList = mediaKeys.split(',').map((s) => s.trim());
export const mediaSizesList = mediaSizes.split(',').map((s) => parseInt(s.trim()));
