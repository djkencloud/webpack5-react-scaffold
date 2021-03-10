import { get } from '../../utils/ajax';

export const REQUEST_STARTED = 'data/REQUEST_STARTED';
export const REQUEST_SUCCEEDED = 'data/REQUEST_SUCCEEDED';
export const REQUEST_FAILED = 'data/REQUEST_FAILED';

function requestStarted() {
  return {
    type: REQUEST_STARTED,
  };
}

function requestSucceeded(data) {
  return {
    type: REQUEST_SUCCEEDED,
    data,
  };
}

function requestFailed(error) {
  return {
    type: REQUEST_FAILED,
    error,
  };
}

export function fetchData() {
  return (dispatch, getState) => {
    const state = getState(); // eslint-disable-line no-unused-vars
    dispatch(requestStarted());

    function getData() {
      return new Promise((resolve) => {
        get('data/data.json').then((e) => {
          resolve(JSON.parse(e));
        });
      });
    }

    async function init() {
      try {
        const d = await getData();
        dispatch(requestSucceeded(d));
      } catch (err) {
        dispatch(requestFailed(err));
      }
    }

    init();
  };
}
