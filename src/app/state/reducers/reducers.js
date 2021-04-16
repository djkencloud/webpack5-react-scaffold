import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import browserUtils from './browserUtils';
import data from './data';

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    browserUtils,
    data,
  });

export default createRootReducer;
