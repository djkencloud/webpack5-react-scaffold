// Actions
import { ON_RESIZE } from '../actions/createResize';

const init = {
  width: 0,
  hight: 0,
};

export default function resize(state = init, action) {
  switch (action.type) {
    case ON_RESIZE:
      return {
        width: action.width > 630 ? 630 : action.width, // change if requried
        height: action.height,
      };

    default:
      return state;
  }
}
