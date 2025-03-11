/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable default-param-last */
import { createSlice } from '@reduxjs/toolkit';

function calculateIframeScrollPercentage(props) {
  const { iframeHeight, iframeY, windowInnerHeight } = props;
  // If the iframe fits within the viewport, there's no scrolling.
  if (iframeHeight <= windowInnerHeight) {
    return 0;
  }

  // Maximum scroll distance is when the top of the iframe moves from 0 to (viewportHeight - rect.height)
  const maxScroll = iframeHeight - windowInnerHeight;
  const scrolledAmount = Math.max(0, 0 - iframeY);
  // const scrolledAmount =  0 - iframeY;

  // Calculate percentage: when scrolledAmount equals maxScroll, we've scrolled 100%.
  let percentage = (scrolledAmount / maxScroll) * 100;
  // console.log('Percentage:', percentage);
  percentage = Math.min(Math.max(percentage, 0), 100);
  return percentage;
}

const init = {
  width: window.innerWidth,
  height: window.innerHeight,
  scrollYPosition: window.scrollY,
  pageHeight: 0,
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  portrait: window.matchMedia('(orientation: portrait)').matches,
  landscape: window.matchMedia('(orientation: landscape)').matches,
  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)')
    .matches,
  prefersDarkColourScheme: window.matchMedia('(prefers-color-scheme: dark)')
    .matches,
  intersection: {
    intersectionRatio: 0,
    boundingClientRect: {},
  },
  parentUpdate: {
    iframeHeight: 0,
    iframetop: 0,
    iframeY: 0,
    scrollY: 0,
  },
  percentageScrolled: 0,
};

// Slice
const browserUtils = createSlice({
  name: 'browserUtils',
  initialState: init,
  reducers: {
    onResize: (state) => {
      state.width = window.innerWidth;
      state.height = window.innerHeight;
      state.scrollYPosition = window.scrollY;
    },
    onDarkMode: (state) => {
      state.darkMode = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
    },
    onOrientationChange: (state) => {
      state.portrait = window.matchMedia('(orientation: portrait)').matches;
      state.landscape = window.matchMedia('(orientation: landscape)').matches;
    },
    onScroll: (state) => {
      state.scrollYPosition = window.scrollY;
    },
    setIntersection: (state, action) => {
      state.intersection = action.payload;
    },
    setParentUpdate: (state, action) => {
      // console.log('Parent update:', action.payload);
      state.parentUpdate = action.payload;
      state.percentageScrolled = calculateIframeScrollPercentage(
        action.payload,
      );
    },
  },
});

export default browserUtils;
