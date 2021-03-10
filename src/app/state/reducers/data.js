// Actions
import {
  REQUEST_STARTED,
  REQUEST_SUCCEEDED,
  REQUEST_FAILED,
} from '../actions/createData';

const init = {
  data: [],
  error: null,
  request: false,
};

export default function data(state = init, action) {
  switch (action.type) {
    case REQUEST_STARTED:
      return { ...state, request: true };

    case REQUEST_SUCCEEDED:
      return {
        ...state,
        data: action.data,
      };

    case REQUEST_FAILED:
      return { ...state, request: false, error: action.error };

    default:
      return state;
  }
}
