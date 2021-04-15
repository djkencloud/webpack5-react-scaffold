import isMobile from 'ismobilejs';

// Actions
import {
  ON_RESIZE,
  ON_DARK_MODE,
  ON_ORIENTATION_CHANGE,
} from '../actions/createBrowserUtils';

const init = {
  width: 0,
  hight: 0,
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  orientation: '',
  hasAudio: window.AudioContext || window.webkitAudioContext,
  isPhone: isMobile.phone,
};

export default function browserUtils(state = init, action) {
  switch (action.type) {
    case ON_RESIZE:
      return {
        ...state,
        width: action.width,
        height: action.height,
      };

    case ON_DARK_MODE:
      return {
        ...state,
        darkMode: action.boolean,
      };

    case ON_ORIENTATION_CHANGE:
      return {
        ...state,
        orientation: action.value,
      };

    default:
      return state;
  }
}
