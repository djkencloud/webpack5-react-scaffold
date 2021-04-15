import debounce from 'lodash.debounce';

export const ON_RESIZE = 'resize/ON_RESIZE';
export const ON_DARK_MODE = 'resize/ON_DARK_MODE';
export const ON_ORIENTATION_CHANGE = 'resize/ON_ORIENTATION_CHANGE';

const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
const portraitView = window.matchMedia('(orientation: portrait)');
const landscapeView = window.matchMedia('(orientation: landscape)');

function onResize(width, height) {
  return {
    type: ON_RESIZE,
    width,
    height,
  };
}

function onDarkMode(boolean) {
  return {
    type: ON_DARK_MODE,
    boolean,
  };
}

function onOrientationChange(value) {
  return {
    type: ON_ORIENTATION_CHANGE,
    value,
  };
}

// Grab bag of different listeners for various states to monitor
export function domListeners() {
  return (dispatch, getState) => {
    window.addEventListener(
      'resize',
      debounce(() => {
        if (getState().browserUtils.width === window.innerWidth) {
          return;
        }
        dispatch(onResize(window.innerWidth, window.innerHeight));
      }, 200),
    );

    // listen for dark mode switch
    colorSchemeQuery.addEventListener('change', (e) => {
      dispatch(onDarkMode(e.matches));
    });

    portraitView.addEventListener('change', (e) => {
      if (e.matches) {
        dispatch(onOrientationChange('portrait'));
      }
    });

    landscapeView.addEventListener('change', (e) => {
      if (e.matches) {
        dispatch(onOrientationChange('landscape'));
      }
    });

    // dispatch initial dimensions
    dispatch(onResize(window.innerWidth, window.innerHeight));

    // dispatch inital portrait or landscape views if on mobile
    if (portraitView.matches) {
      dispatch(onOrientationChange('portrait'));
    }

    if (landscapeView.matches) {
      dispatch(onOrientationChange('landscape'));
    }
  };
}
