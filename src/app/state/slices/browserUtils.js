/* eslint-disable no-param-reassign */
/* eslint-disable default-param-last */
import { createSlice } from '@reduxjs/toolkit';

const init = {
  width: window.innerWidth,
  height: window.innerHeight,
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  portrait: window.matchMedia('(orientation: portrait)').matches,
  landscape: window.matchMedia('(orientation: landscape)').matches,
  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)')
    .matches,
  prefersDarkColourScheme: window.matchMedia('(prefers-color-scheme: dark)')
    .matches,
};

// Slice
const browserUtils = createSlice({
  name: 'browserUtils',
  initialState: init,
  reducers: {
    onResize: (state) => {
      state.width = window.innerWidth;
      state.height = window.innerHeight;
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
  },
});

export default browserUtils;
