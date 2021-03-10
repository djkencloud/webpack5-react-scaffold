import debounce from 'lodash.debounce';

export const ON_RESIZE = 'resize/ON_RESIZE';

function onResize(width, height) {
  return {
    type: ON_RESIZE,
    width,
    height,
  };
}

export function listenResize() {
  return (dispatch, getState) => {
    // listen for dimension change
    window.addEventListener(
      'resize',
      debounce(() => {
        if (getState().resize.width === window.innerWidth) {
          return;
        }
        dispatch(onResize(window.innerWidth, window.innerHeight));
      }, 200),
    );

    // dispatch initial dimensions
    dispatch(onResize(window.innerWidth, window.innerHeight));
  };
}
