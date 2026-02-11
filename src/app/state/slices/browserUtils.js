/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable default-param-last */

import debounce from 'lodash.debounce';
import { createSlice } from '@reduxjs/toolkit';

// Media queries
const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
const portraitView = window.matchMedia('(orientation: portrait)');
const landscapeView = window.matchMedia('(orientation: landscape)');

// Initial state
const init = {
  width: window.innerWidth || 0,
  height: window.innerHeight || 0,
  darkMode: colorSchemeQuery.matches,
  orientation: portraitView.matches
    ? 'portrait'
    : landscapeView.matches
      ? 'landscape'
      : '',
};

// Slice
const browserUtils = createSlice({
  name: 'browserUtils',
  initialState: init,
  reducers: {
    onResize: (state, action) => {
      const { width, height } = action.payload || {};
      if (typeof width === 'number') state.width = width;
      if (typeof height === 'number') state.height = height;
    },
    onDarkMode: (state, action) => {
      state.darkMode = Boolean(action.payload?.bool);
    },
    onOrientationChange: (state, action) => {
      state.orientation = action.payload?.orientation || '';
    },
  },
});

export default browserUtils;

// Actions
const { onResize, onDarkMode, onOrientationChange } = browserUtils.actions;

/**
 * Set up browser listeners and dispatch updates into Redux.
 *
 * Usage:
 *   import store from './store';
 *   import { setUpBrowserListeners } from './slices/browserUtils';
 *
 *   const cleanup = setUpBrowserListeners(store.dispatch);
 */
export function setUpBrowserListeners(dispatch) {
  if (typeof dispatch !== 'function') {
    throw new Error(
      'setUpBrowserListeners(dispatch) requires a Redux dispatch function',
    );
  }

  // Resize (debounced)
  const handleResize = debounce(() => {
    dispatch(
      onResize({
        width: window.innerWidth,
        height: window.innerHeight,
      }),
    );
  }, 200);

  // Dark mode
  const handleDarkMode = (e) => {
    dispatch(onDarkMode({ bool: e.matches }));
  };

  // Orientation
  const handlePortrait = (e) => {
    if (e.matches) {
      dispatch(onOrientationChange({ orientation: 'portrait' }));
    }
  };

  const handleLandscape = (e) => {
    if (e.matches) {
      dispatch(onOrientationChange({ orientation: 'landscape' }));
    }
  };

  // Attach listeners
  window.addEventListener('resize', handleResize);
  colorSchemeQuery?.addEventListener('change', handleDarkMode);
  portraitView?.addEventListener('change', handlePortrait);
  landscapeView?.addEventListener('change', handleLandscape);

  // Initial dispatch
  dispatch(
    onResize({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
  );

  if (portraitView.matches) {
    dispatch(onOrientationChange({ orientation: 'portrait' }));
  } else if (landscapeView.matches) {
    dispatch(onOrientationChange({ orientation: 'landscape' }));
  }

  // Cleanup (important for HMR / teardown)
  return () => {
    window.removeEventListener('resize', handleResize);
    handleResize.cancel?.();

    colorSchemeQuery?.removeEventListener('change', handleDarkMode);
    portraitView?.removeEventListener('change', handlePortrait);
    landscapeView?.removeEventListener('change', handleLandscape);
  };
}
